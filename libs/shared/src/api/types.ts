import type {
  User,
  UserWithPosts,
  CreateUserRequest,
  UpdateUserRequest,
  Post,
  PostWithRelations,
  CreatePostRequest,
  UpdatePostRequest,
  Category,
  CategoryWithPosts,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  AuthResponse,
  ApiResponse,
  PaginatedResponse,
  PaginationQuery,
  PostFilters,
  CategoryFilters,
  UserFilters,
} from '../types';

// Base API configuration
export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Generic API client interface
export interface ApiClient {
  get<T>(url: string, params?: any): Promise<T>;
  post<T>(url: string, data?: any): Promise<T>;
  put<T>(url: string, data?: any): Promise<T>;
  patch<T>(url: string, data?: any): Promise<T>;
  delete<T>(url: string): Promise<T>;
}

// Auth API
export interface AuthApi {
  login(data: LoginRequest): Promise<AuthResponse>;
  register(data: RegisterRequest): Promise<AuthResponse>;
  changePassword(data: ChangePasswordRequest): Promise<ApiResponse<null>>;
  getProfile(): Promise<User>;
}

// Users API
export interface UsersApi {
  getAll(filters?: UserFilters, pagination?: PaginationQuery): Promise<PaginatedResponse<User>>;
  getById(id: number): Promise<UserWithPosts>;
  create(data: CreateUserRequest): Promise<User>;
  update(id: number, data: UpdateUserRequest): Promise<User>;
  delete(id: number): Promise<ApiResponse<null>>;
}

// Posts API
export interface PostsApi {
  getAll(filters?: PostFilters, pagination?: PaginationQuery): Promise<PaginatedResponse<PostWithRelations>>;
  getById(id: number): Promise<PostWithRelations>;
  getBySlug(slug: string): Promise<PostWithRelations>;
  getByCategory(categoryId: number, pagination?: PaginationQuery): Promise<PaginatedResponse<PostWithRelations>>;
  create(data: CreatePostRequest): Promise<Post>;
  update(id: number, data: UpdatePostRequest): Promise<Post>;
  delete(id: number): Promise<ApiResponse<null>>;
  publish(id: number): Promise<Post>;
  unpublish(id: number): Promise<Post>;
}

// Categories API
export interface CategoriesApi {
  getAll(filters?: CategoryFilters): Promise<CategoryWithPosts[]>;
  getById(id: number): Promise<CategoryWithPosts>;
  getBySlug(slug: string): Promise<CategoryWithPosts>;
  create(data: CreateCategoryRequest): Promise<Category>;
  update(id: number, data: UpdateCategoryRequest): Promise<Category>;
  delete(id: number): Promise<ApiResponse<null>>;
}

// Complete API interface
export interface SimpleBlogApi {
  auth: AuthApi;
  users: UsersApi;
  posts: PostsApi;
  categories: CategoriesApi;
}

// API Response utilities
export const createApiResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  data,
  message,
  success: true,
});

export const createPaginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
): PaginatedResponse<T> => ({
  data,
  meta: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  },
});

// Error handling utilities
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public error?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any): never => {
  if (error.response) {
    throw new ApiError(
      error.response.data?.message || 'API request failed',
      error.response.status,
      error.response.data?.error,
    );
  } else if (error.request) {
    throw new ApiError('Network error - no response received', 0);
  } else {
    throw new ApiError(error.message || 'Unknown error occurred', 500);
  }
};

// URL building utilities
export const buildUrl = (baseUrl: string, endpoint: string, params?: Record<string, any>): string => {
  const url = new URL(endpoint, baseUrl);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
};

// Query parameter helpers
export const buildQueryParams = (pagination?: PaginationQuery, filters?: any): Record<string, any> => {
  const params: Record<string, any> = {};
  
  if (pagination) {
    if (pagination.page) params.page = pagination.page;
    if (pagination.limit) params.limit = pagination.limit;
    if (pagination.sortBy) params.sortBy = pagination.sortBy;
    if (pagination.sortOrder) params.sortOrder = pagination.sortOrder;
  }
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params[key] = value;
      }
    });
  }
  
  return params;
};