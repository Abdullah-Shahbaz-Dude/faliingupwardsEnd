// ⚠️ UNUSED FILE - CAN BE DELETED
// This file contains Zod validation schemas that are not currently used in the application.
// The application uses manual validation instead. This file can be safely removed.

import { z } from 'zod';
import { ApiError } from './apiResponse';

// User validation schemas based on your existing User type
export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['user', 'admin']).default('user'),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  role: z.enum(['user', 'admin']).optional(),
  isCompleted: z.boolean().optional(),
  dashboardExpired: z.boolean().optional(),
});

// Workbook validation schemas based on your existing Workbook type
export const createWorkbookSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  content: z.string().optional(),
  questions: z.array(z.object({
    question: z.string().min(5, 'Question must be at least 5 characters'),
    answer: z.string().default(''),
  })).default([]),
});

export const assignWorkbookSchema = z.object({
  workbookId: z.string().min(1, 'Workbook ID is required'),
  userId: z.string().min(1, 'User ID is required'),
});

export const updateWorkbookSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(10).max(500).optional(),
  content: z.string().optional(),
  questions: z.array(z.object({
    question: z.string().min(5),
    answer: z.string(),
  })).optional(),
  status: z.enum(['assigned', 'in_progress', 'completed', 'submitted', 'reviewed']).optional(),
  userResponse: z.string().optional(),
  adminFeedback: z.string().optional(),
});

// Authentication validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});


// Validation helper function that throws ApiError on validation failure
export function validateRequest<T>(schema: z.ZodSchema<T>, data: any): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new ApiError(`Validation failed: ${errors.join(', ')}`, 400, 'VALIDATION_ERROR');
    }
    throw new ApiError('Validation failed', 400, 'VALIDATION_ERROR');
  }
}

// Safe validation that returns result object instead of throwing
export function safeValidateRequest<T>(schema: z.ZodSchema<T>, data: any): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}
