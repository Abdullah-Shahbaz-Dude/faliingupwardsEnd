// ⚠️ UNUSED FILE - CAN BE DELETED
// This file contains API response utilities that are not currently used in the application.
// The application uses manual response handling instead. This file can be safely removed.
// Note: Only imported by validation.ts which is also unused.

import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  code?: string;
  timestamp: string;
}

export class ApiError extends Error {
  public statusCode: number;
  public code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
  }
}

export function createSuccessResponse<T>(
  data: T,
  message: string = 'Success',
  status: number = 200
): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  
  return NextResponse.json(response, { status });
}

export function createErrorResponse(
  message: string,
  status: number = 500,
  code?: string,
  error?: any
): NextResponse {
  console.error(`❌ API Error [${status}]:`, {
    message,
    code,
    error: error?.message || error,
    stack: error?.stack,
    timestamp: new Date().toISOString(),
  });

  const response: ApiResponse = {
    success: false,
    message,
    code,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && error && { 
      error: error.message || error 
    }),
  };

  return NextResponse.json(response, { status });
}

export function handleApiError(error: any, context?: string): NextResponse {
  const contextMsg = context ? ` in ${context}` : '';
  
  if (error instanceof ApiError) {
    return createErrorResponse(error.message, error.statusCode, error.code, error);
  }

  // MongoDB validation errors
  if (error.name === 'ValidationError') {
    const validationErrors = Object.values(error.errors).map((err: any) => err.message);
    return createErrorResponse(
      `Validation failed: ${validationErrors.join(', ')}`,
      400,
      'VALIDATION_ERROR',
      error
    );
  }

  // MongoDB duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'field';
    return createErrorResponse(
      `${field} already exists`,
      409,
      'DUPLICATE_ERROR',
      error
    );
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return createErrorResponse('Invalid authentication token', 401, 'INVALID_TOKEN', error);
  }

  if (error.name === 'TokenExpiredError') {
    return createErrorResponse('Authentication token expired', 401, 'TOKEN_EXPIRED', error);
  }

  // Default server error
  return createErrorResponse(
    `Internal server error${contextMsg}`,
    500,
    'INTERNAL_ERROR',
    error
  );
}
