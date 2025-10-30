import type { 
  ApiResponse, 
  AuthResponse,
  User,
  Post,
  PostWithRelations,
  Category,
  CategoryWithPosts,
  PaginatedResponse,
  LoginRequest,
  RegisterRequest,
  CreatePostRequest,
  UpdatePostRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ChangePasswordRequest,
  CreateUserRequest,
  UpdateUserRequest,
  PostFilters,
  CategoryFilters,
  PaginationQuery
} from '@simpleblog/shared';
import {
  createUserSchema,
  loginSchema,
  createPostSchema,
  createCategorySchema,
  updateUserSchema,
  registerSchema,
  changePasswordSchema
} from '@simpleblog/shared';

const API_BASE_URL = 'http://localhost:3001/api';

// Własny typ dla response z błędem
interface ApiErrorResponse {
  success: false;
  error: string;
  statusCode: number;
}

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  statusCode: number;
}

type ClientResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    // Pobierz token z localStorage przy inicjalizacji
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ClientResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Wystąpił błąd',
          statusCode: response.status,
        };
      }

      return {
        success: true,
        data,
        statusCode: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Błąd sieci',
        statusCode: 0,
      };
    }
  }

  // Token management
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  getToken(): string | null {
    return this.token;
  }

  // Auth methods
  async register(data: RegisterRequest): Promise<ClientResponse<AuthResponse>> {
    const validatedData = registerSchema.parse(data);
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(validatedData),
    });
  }

  async login(data: LoginRequest): Promise<ClientResponse<AuthResponse>> {
    const validatedData = loginSchema.parse(data);
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(validatedData),
    });

    if (response.success) {
      this.setToken(response.data.access_token);
    }

    return response;
  }

  async logout(): Promise<ClientResponse<null>> {
    this.clearToken();
    return { success: true, data: null, statusCode: 200 };
  }

  async getProfile(): Promise<ClientResponse<User>> {
    return this.request<User>('/auth/me');
  }

  // Users methods
  async updateProfile(data: UpdateUserRequest): Promise<ClientResponse<User>> {
    const validatedData = updateUserSchema.parse(data);
    return this.request<User>('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(validatedData),
    });
  }

  async changePassword(data: ChangePasswordRequest): Promise<ClientResponse<null>> {
    const validatedData = changePasswordSchema.parse(data);
    return this.request<null>('/users/change-password', {
      method: 'PATCH',
      body: JSON.stringify(validatedData),
    });
  }

  // Posts methods
  async getPosts(filters?: PostFilters, pagination?: PaginationQuery): Promise<ClientResponse<PostWithRelations[]>> {
    const params = new URLSearchParams();
    
    if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());
    if (filters?.isPublished !== undefined) params.append('isPublished', filters.isPublished.toString());
    if (filters?.search) params.append('search', filters.search);
    
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    if (pagination?.sortBy) params.append('sortBy', pagination.sortBy);
    if (pagination?.sortOrder) params.append('sortOrder', pagination.sortOrder);
    
    const query = params.toString();
    return this.request<PostWithRelations[]>(`/posts${query ? `?${query}` : ''}`);
  }

  async getPostById(id: number): Promise<ClientResponse<PostWithRelations>> {
    return this.request<PostWithRelations>(`/posts/${id}`);
  }

  async createPost(data: CreatePostRequest): Promise<ClientResponse<Post>> {
    const validatedData = createPostSchema.parse(data);
    return this.request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(validatedData),
    });
  }

  async updatePost(id: number, data: UpdatePostRequest): Promise<ClientResponse<Post>> {
    return this.request<Post>(`/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deletePost(id: number): Promise<ClientResponse<null>> {
    return this.request<null>(`/posts/${id}`, { method: 'DELETE' });
  }

  // Categories methods
  async getCategories(filters?: CategoryFilters): Promise<ClientResponse<Category[]>> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    
    const query = params.toString();
    return this.request<Category[]>(`/categories${query ? `?${query}` : ''}`);
  }

  async getCategoryById(id: number): Promise<ClientResponse<CategoryWithPosts>> {
    return this.request<CategoryWithPosts>(`/categories/${id}`);
  }

  async createCategory(data: CreateCategoryRequest): Promise<ClientResponse<Category>> {
    const validatedData = createCategorySchema.parse(data);
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(validatedData),
    });
  }

  async updateCategory(id: number, data: UpdateCategoryRequest): Promise<ClientResponse<Category>> {
    return this.request<Category>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: number): Promise<ClientResponse<null>> {
    return this.request<null>(`/categories/${id}`, { method: 'DELETE' });
  }
}

// Eksport singletona
export const apiClient = new ApiClient();
export default apiClient;