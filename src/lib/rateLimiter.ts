/**
 * 🚦 RATE LIMITER - Production-Ready API Protection
 * 
 * Protects against:
 * - DOS attacks
 * - Brute force attacks  
 * - Resource exhaustion
 * - API abuse
 * - Cost explosion
 */

import { NextRequest, NextResponse } from 'next/server';

// 📊 Rate Limit Configuration
interface RateLimitConfig {
  windowMs: number;     // Time window in milliseconds
  maxRequests: number;  // Max requests per window
  message?: string;     // Custom error message
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean;     // Don't count failed requests
}

// 🗃️ In-Memory Store (for development/small scale)
// For production, use Redis for distributed rate limiting
class MemoryStore {
  private store = new Map<string, { count: number; resetTime: number }>();

  get(key: string): { count: number; resetTime: number } | undefined {
    const record = this.store.get(key);
    if (record && Date.now() > record.resetTime) {
      this.store.delete(key);
      return undefined;
    }
    return record;
  }

  set(key: string, value: { count: number; resetTime: number }): void {
    this.store.set(key, value);
  }

  increment(key: string, windowMs: number): { count: number; resetTime: number } {
    const now = Date.now();
    const record = this.get(key);
    
    if (!record) {
      const newRecord = { count: 1, resetTime: now + windowMs };
      this.set(key, newRecord);
      return newRecord;
    }
    
    record.count++;
    this.set(key, record);
    return record;
  }

  // 🧹 Cleanup expired entries (run periodically)
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

// 🏪 Global store instance
const store = new MemoryStore();

// 🧹 Cleanup expired entries every 5 minutes
setInterval(() => store.cleanup(), 5 * 60 * 1000);

/**
 * 🛡️ Rate Limiter Factory
 * Creates rate limiting middleware for different endpoints
 */
export function createRateLimiter(config: RateLimitConfig) {
  return async (req: NextRequest): Promise<NextResponse | null> => {
    // 🔍 Get client identifier (IP + User Agent for better uniqueness)
    const clientIP = getClientIP(req);
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const identifier = `${clientIP}:${userAgent.slice(0, 50)}`;
    
    // 📊 Track request count
    const record = store.increment(identifier, config.windowMs);
    
    // 🚫 Check if limit exceeded
    if (record.count > config.maxRequests) {
      const resetTime = new Date(record.resetTime).toISOString();
      
      return NextResponse.json(
        {
          error: config.message || 'Too many requests',
          retryAfter: Math.ceil((record.resetTime - Date.now()) / 1000),
          resetTime,
          limit: config.maxRequests,
          windowMs: config.windowMs
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': Math.max(0, config.maxRequests - record.count).toString(),
            'X-RateLimit-Reset': record.resetTime.toString(),
            'Retry-After': Math.ceil((record.resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }

    // ✅ Request allowed - add rate limit headers
    return null; // Continue to next middleware
  };
}

/**
 * 🌐 Get Client IP Address
 * Handles various proxy scenarios
 */
function getClientIP(req: NextRequest): string {
  // Check various headers for real IP (in order of preference)
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfConnectingIP = req.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) return realIP;
  if (cfConnectingIP) return cfConnectingIP;
  
  // Fallback - use a generic identifier if no IP available
  return 'unknown-client';
}

// 🎯 Pre-configured Rate Limiters for Different Use Cases

/**
 * 🔐 Admin API Rate Limiter - Strict limits for admin operations
 */
export const adminRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,          // 100 requests per 15 minutes
  message: 'Too many admin API requests. Please try again in 15 minutes.'
});

/**
 * 🔑 Auth Rate Limiter - Very strict for login attempts
 */
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,            // Only 5 login attempts per 15 minutes
  message: 'Too many login attempts. Please try again in 15 minutes.'
});

/**
 * 📧 Email Rate Limiter - Prevent email spam
 */
export const emailRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10,           // 10 emails per hour
  message: 'Too many emails sent. Please try again in 1 hour.'
});

/**
 * 👤 User API Rate Limiter - Moderate limits for user operations
 */
export const userRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 200,          // 200 requests per 15 minutes
  message: 'Too many requests. Please try again in 15 minutes.'
});

/**
 * 📚 Workbook Rate Limiter - Prevent workbook spam
 */
export const workbookRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,  // 5 minutes
  maxRequests: 50,           // 50 requests per 5 minutes
  message: 'Too many workbook requests. Please slow down.'
});

/**
 * 🌐 General API Rate Limiter - Default protection
 */
export const generalRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 300,          // 300 requests per 15 minutes
  message: 'Too many requests. Please try again later.'
});

/**
 * 🚨 Emergency Rate Limiter - For critical endpoints
 */
export const emergencyRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,      // 1 minute
  maxRequests: 10,           // Only 10 requests per minute
  message: 'This endpoint is heavily rate limited. Please try again in 1 minute.'
});

/**
 * 🛠️ Rate Limit Middleware Helper
 * Apply rate limiting to API routes
 */
export async function applyRateLimit(
  req: NextRequest, 
  rateLimiter: (req: NextRequest) => Promise<NextResponse | null>
): Promise<NextResponse | null> {
  try {
    return await rateLimiter(req);
  } catch (error) {
    console.error('Rate limiter error:', error);
    // Don't block requests if rate limiter fails - FAIL OPEN for safety
    return null;
  }
}

/**
 * 📊 Rate Limit Stats (for monitoring)
 * Edge Runtime compatible version
 */
export function getRateLimitStats(): {
  totalKeys: number;
  timestamp: string;
} {
  return {
    totalKeys: (store as any).store.size,
    timestamp: new Date().toISOString()
  };
}
