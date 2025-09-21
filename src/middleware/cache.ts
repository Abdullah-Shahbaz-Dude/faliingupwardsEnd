// 🚀 API RESPONSE CACHING MIDDLEWARE FOR LIGHTNING-FAST RESPONSES

import { NextRequest, NextResponse } from 'next/server';

interface CacheEntry {
  data: any;
  timestamp: number;
  etag: string;
}

// 💾 IN-MEMORY CACHE - Use Redis in production for multi-instance apps
const cache = new Map<string, CacheEntry>();

// 🧹 CACHE CLEANUP - Prevent memory leaks
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 1000; // Maximum cache entries

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
  
  // Limit cache size
  if (cache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toDelete = entries.slice(0, cache.size - MAX_CACHE_SIZE);
    toDelete.forEach(([key]) => cache.delete(key));
  }
}, 5 * 60 * 1000); // Optimized: Clean every 5 minutes instead of 1 minute

/**
 * 🔄 CACHE WRAPPER FOR API ROUTES
 * Usage: return withCache(request, cacheKey, async () => { ... your logic ... });
 */
export async function withCache<T>(
  request: NextRequest,
  cacheKey: string,
  handler: () => Promise<T>,
  ttl: number = CACHE_TTL
): Promise<NextResponse> {
  try {
    // 🔍 CHECK IF-NONE-MATCH HEADER (ETag support)
    const ifNoneMatch = request.headers.get('if-none-match');
    
    // 📦 CHECK CACHE
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < ttl) {
      // Return 304 Not Modified if ETag matches
      if (ifNoneMatch && ifNoneMatch === cached.etag) {
        return new NextResponse(null, { status: 304 });
      }
      
      return NextResponse.json(cached.data, {
        status: 200,
        headers: {
          'Cache-Control': `public, max-age=${Math.floor((ttl - (Date.now() - cached.timestamp)) / 1000)}`,
          'ETag': cached.etag,
          'X-Cache': 'HIT',
          'X-Cache-Time': new Date(cached.timestamp).toISOString(),
        },
      });
    }

    // 🔄 EXECUTE HANDLER AND CACHE RESULT
    const data = await handler();
    const timestamp = Date.now();
    const etag = `"${Buffer.from(JSON.stringify(data)).toString('base64').slice(0, 16)}"`;
    
    // 💾 STORE IN CACHE
    cache.set(cacheKey, { data, timestamp, etag });
    
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': `public, max-age=${Math.floor(ttl / 1000)}`,
        'ETag': etag,
        'X-Cache': 'MISS',
        'X-Cache-Time': new Date(timestamp).toISOString(),
      },
    });
    
  } catch (error) {
    console.error('❌ Cache middleware error:', error);
    // Fallback to handler without caching
    const data = await handler();
    return NextResponse.json(data, { status: 200 });
  }
}

/**
 * 🗑️ CLEAR CACHE BY PATTERN
 */
export function clearCache(pattern?: string) {
  if (!pattern) {
    cache.clear();
    console.log('🧹 Cleared all cache entries');
    return;
  }
  
  const regex = new RegExp(pattern);
  let cleared = 0;
  
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key);
      cleared++;
    }
  }
  
  console.log(`🧹 Cleared ${cleared} cache entries matching pattern: ${pattern}`);
}

/**
 * 📊 CACHE STATISTICS
 */
export function getCacheStats() {
  const now = Date.now();
  let validEntries = 0;
  let expiredEntries = 0;
  
  for (const entry of cache.values()) {
    if (now - entry.timestamp < CACHE_TTL) {
      validEntries++;
    } else {
      expiredEntries++;
    }
  }
  
  return {
    totalEntries: cache.size,
    validEntries,
    expiredEntries,
    hitRate: validEntries / (validEntries + expiredEntries) || 0,
    memoryUsage: process.memoryUsage(),
  };
}
