import { z } from 'zod';

// Email validation schema
export const emailSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  
  email: z.string()
    .email('Invalid email format')
    .max(254, 'Email too long'),
  
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number too long')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format'),
  
  formType: z.string().optional(),
  
  consultationTypeLabel: z.string()
    .min(1, 'Consultation type is required')
    .max(200, 'Consultation type too long'),
  
  message: z.string()
    .max(2000, 'Message too long')
    .optional()
});

// User creation schema
export const createUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  
  email: z.string()
    .email('Invalid email format')
    .max(254, 'Email too long'),
  
  workbooks: z.array(z.string()).optional(),
  
  role: z.enum(['user', 'admin']).default('user')
});

// Workbook creation schema
export const createWorkbookSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title too long'),
  
  description: z.string()
    .max(1000, 'Description too long')
    .optional(),
  
  questions: z.array(z.object({
    id: z.string(),
    type: z.enum(['text', 'textarea', 'radio', 'checkbox', 'select']),
    question: z.string().min(1, 'Question text is required'),
    options: z.array(z.string()).optional(),
    required: z.boolean().default(false)
  })).min(1, 'At least one question is required'),
  
  isTemplate: z.boolean().default(true)
});

// Workbook update schema
export const updateWorkbookSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title too long')
    .optional(),
  
  description: z.string()
    .max(1000, 'Description too long')
    .optional(),
  
  questions: z.array(z.object({
    id: z.string(),
    type: z.enum(['text', 'textarea', 'radio', 'checkbox', 'select']),
    question: z.string().min(1, 'Question text is required'),
    options: z.array(z.string()).optional(),
    required: z.boolean().default(false)
  })).optional(),
  
  responses: z.record(z.string(), z.any()).optional(),
  
  status: z.enum(['assigned', 'in_progress', 'completed']).optional()
});

// User update schema
export const updateUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters')
    .optional(),
  
  email: z.string()
    .email('Invalid email format')
    .max(254, 'Email too long')
    .optional(),
  
  workbooks: z.array(z.string()).optional(),
  
  isCompleted: z.boolean().optional(),
  
  dashboardExpired: z.boolean().optional()
});

// Workbook assignment schema
export const assignWorkbookSchema = z.object({
  userIds: z.array(z.string().min(1, 'User ID required'))
    .min(1, 'At least one user ID is required'),
  
  workbookIds: z.array(z.string().min(1, 'Workbook ID required'))
    .min(1, 'At least one workbook ID is required')
});

// ID parameter validation
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required')
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce.number().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(10)
});

// Rate limit validation helper
export const validateRateLimit = (identifier: string) => {
  const rateLimitSchema = z.string()
    .min(1, 'Rate limit identifier required')
    .max(200, 'Rate limit identifier too long');
  
  return rateLimitSchema.parse(identifier);
};

// Generic validation helper
export const validateRequest = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new Error(`Validation failed: ${errorMessage}`);
    }
    throw error;
  }
};

// Type exports for TypeScript
export type EmailFormData = z.infer<typeof emailSchema>;
export type CreateUserData = z.infer<typeof createUserSchema>;
export type CreateWorkbookData = z.infer<typeof createWorkbookSchema>;
export type UpdateWorkbookData = z.infer<typeof updateWorkbookSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;
export type AssignWorkbookData = z.infer<typeof assignWorkbookSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
