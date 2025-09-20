/**
 * 📊 RATE LIMIT MONITORING API
 * 
 * Admin-only endpoint to monitor rate limiting statistics
 * Helps track API usage and potential abuse
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextauth';
import { getRateLimitStats } from '@/lib/rateLimiter';

export async function GET(req: NextRequest) {
  try {
    // 🔐 Admin authentication required
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // 📊 Get rate limiting statistics
    const stats = getRateLimitStats();
    
    // 🕒 Edge Runtime compatible response
    const response = {
      timestamp: new Date().toISOString(),
      rateLimitStats: stats,
      environment: 'Edge Runtime Compatible'
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Rate limit stats error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch rate limit statistics' },
      { status: 500 }
    );
  }
}
