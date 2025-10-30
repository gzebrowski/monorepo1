// Base types
export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// User types
export interface User extends BaseEntity {
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isActive: boolean;
}

export interface UserWithPosts extends User {
  posts: Post[];
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface UpdateUserRequest {
  email?: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isActive?: boolean;
}

// Category types
export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  color: string;
}

export interface CategoryWithPosts extends Category {
  posts: Post[];
  _count: {
    posts: number;
  };
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  color?: string;
}

// Post types
export interface Post extends BaseEntity {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  isPublished: boolean;
  publishedAt?: Date;
  authorId: number;
  categoryId: number;
}

export interface PostWithRelations extends Post {
  author: Pick<User, 'id' | 'username' | 'firstName' | 'lastName'>;
  category: Category;
}

export interface CreatePostRequest {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  isPublished?: boolean;
  publishedAt?: Date;
  categoryId: number;
}

export interface UpdatePostRequest {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  isPublished?: boolean;
  publishedAt?: Date;
  categoryId?: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter types
export interface PostFilters {
  categoryId?: number;
  authorId?: number;
  isPublished?: boolean;
  search?: string;
}

export interface CategoryFilters {
  search?: string;
}

export interface UserFilters {
  isActive?: boolean;
  search?: string;
}