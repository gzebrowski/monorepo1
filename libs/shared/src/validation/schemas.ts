import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatar: z.string().url().optional(),
});

export const updateUserSchema = createUserSchema.partial();

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

// Category validation schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name too long'),
  slug: z.string().min(1, 'Slug is required').max(50, 'Slug too long').regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// Post validation schemas
export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').max(200, 'Slug too long').regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(500, 'Excerpt too long').optional(),
  coverImage: z.string().url().optional(),
  isPublished: z.boolean().optional(),
  publishedAt: z.date().optional(),
  categoryId: z.number().positive('Valid category is required'),
});

export const updatePostSchema = createPostSchema.partial();

// Query validation schemas
export const paginationSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const postFiltersSchema = z.object({
  categoryId: z.number().positive().optional(),
  authorId: z.number().positive().optional(),
  isPublished: z.boolean().optional(),
  search: z.string().optional(),
});

export const categoryFiltersSchema = z.object({
  search: z.string().optional(),
});

export const userFiltersSchema = z.object({
  isActive: z.boolean().optional(),
  search: z.string().optional(),
});

// Export types from schemas
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;

export type PaginationInput = z.infer<typeof paginationSchema>;
export type PostFiltersInput = z.infer<typeof postFiltersSchema>;
export type CategoryFiltersInput = z.infer<typeof categoryFiltersSchema>;
export type UserFiltersInput = z.infer<typeof userFiltersSchema>;

// Poll validation schemas
export const createPollSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  isActive: z.boolean().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  questions: z.array(z.object({
    question: z.string().min(1, 'Question is required').max(500, 'Question too long'),
    questionType: z.enum(['single', 'multiple', 'text']),
    isRequired: z.boolean(),
    order: z.number().min(0),
    options: z.array(z.object({
      text: z.string().min(1, 'Option text is required').max(200, 'Option text too long'),
      order: z.number().min(0),
    })).optional(),
  })).min(1, 'At least one question is required'),
});

export const updatePollSchema = createPollSchema.partial().omit({ questions: true });

export const submitPollResponseSchema = z.object({
  pollId: z.number().positive('Valid poll ID is required'),
  answers: z.array(z.object({
    questionId: z.number().positive('Valid question ID is required'),
    optionId: z.number().positive().optional(),
    textAnswer: z.string().max(1000, 'Text answer too long').optional(),
  })).min(1, 'At least one answer is required'),
});

export const pollFiltersSchema = z.object({
  isActive: z.boolean().optional(),
  authorId: z.number().positive().optional(),
  search: z.string().optional(),
});

// Export types from poll schemas
export type CreatePollInput = z.infer<typeof createPollSchema>;
export type UpdatePollInput = z.infer<typeof updatePollSchema>;
export type SubmitPollResponseInput = z.infer<typeof submitPollResponseSchema>;
export type PollFiltersInput = z.infer<typeof pollFiltersSchema>;