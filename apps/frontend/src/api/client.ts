import type { 
  AuthResponse,
  User,
  Post,
  PostWithRelations,
  Category,
  CategoryWithPosts,
  LoginRequest,
  RegisterRequest,
  CreatePostRequest,
  UpdatePostRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ChangePasswordRequest,
  UpdateUserRequest,
  PostFilters,
  CategoryFilters,
  PaginationQuery
} from '@simpleblog/shared';
import {
  loginSchema,
  createPostSchema,
  createCategorySchema,
  updateUserSchema,
  registerSchema,
  changePasswordSchema,
  updatePostSchema,
  updateCategorySchema,
  apiUrl,
} from '@simpleblog/shared';

const API_BASE_URL = apiUrl();
const API_BASE_PATH = '/api';

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

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl?: string) {
    baseUrl = baseUrl || API_BASE_PATH;
    this.baseUrl = (baseUrl.startsWith('http') ? baseUrl : API_BASE_URL + baseUrl);
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
  public async get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<ClientResponse<T>> {
    let url = endpoint;

    if (params) {
      const query = new URLSearchParams(params).toString();
      url += `?${query}`;
    }

    return this.request<T>(url);
  }

  public async post<T, U>(
    endpoint: string,
    body?: U,
    options: RequestInit = {}
  ): Promise<ClientResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : null,
    });
  }
  
  public async put<T, U>(
    endpoint: string,
    body?: U,
    options: RequestInit = {}
  ): Promise<ClientResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : null,
    });
  }
  
  public async delete<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ClientResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  public async patch<T, U>(
    endpoint: string,
    body?: U,
    options: RequestInit = {}
  ): Promise<ClientResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : null,
    });
  }
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

}
export class ApiService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  // Token management
  setToken(token: string) {
    this.apiClient.setToken(token);
  }

  clearToken() {
    this.apiClient.clearToken();
  }

  getToken(): string | null {
    return this.apiClient.getToken();
  }

  // Auth methods
  async register(data: RegisterRequest): Promise<ClientResponse<AuthResponse>> {
    const validatedData = registerSchema.parse(data);
    return this.apiClient.post<AuthResponse, RegisterRequest>('/auth/register', validatedData);
  }

  async login(data: LoginRequest): Promise<ClientResponse<AuthResponse>> {
    const validatedData = loginSchema.parse(data);
    const response = await this.apiClient.post<AuthResponse, LoginRequest>('/auth/login', validatedData);

    if (response.success) {
      this.setToken(response.data.access_token);
    }

    return response;
  }

  successResponse(data: any, statusCode: number = 200): ClientResponse<any> {
    return {
      success: true,
      data,
      statusCode
    };
  }

  async logout(): Promise<ClientResponse<{ message: string }>> {
    try {
      // Call server logout endpoint to invalidate token
      const response = await this.apiClient.post<{ message: string }, null>('/auth/logout');
      
      // Always clear token regardless of server response
      this.clearToken();
      
      return response.success 
        ? response 
        : this.successResponse({ message: 'Logged out locally' });
    } catch (error) {
      // Even if server logout fails, clear local token
      this.clearToken();
      return this.successResponse({ message: 'Logged out locally' });
    }
  }

  async getProfile(): Promise<ClientResponse<User>> {
    return this.apiClient.get<User>('/auth/me');
  }

  // Users methods
  async updateProfile(data: UpdateUserRequest): Promise<ClientResponse<User>> {
    const validatedData = updateUserSchema.parse(data);
    return this.apiClient.patch<User, UpdateUserRequest>('/users/profile', validatedData);
  }

  async changePassword(data: ChangePasswordRequest): Promise<ClientResponse<null>> {
    const validatedData = changePasswordSchema.parse(data);
    return this.apiClient.patch<null, ChangePasswordRequest>('/users/change-password', validatedData);
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
    return this.apiClient.get<PostWithRelations[]>(`/posts${query ? `?${query}` : ''}`);
  }

  async getPostById(id: number): Promise<ClientResponse<PostWithRelations>> {
    return this.apiClient.get<PostWithRelations>(`/posts/${id}`);
  }

  async createPost(data: CreatePostRequest): Promise<ClientResponse<Post>> {
    const validatedData = createPostSchema.parse(data);
    return this.apiClient.post<Post, CreatePostRequest>('/posts', validatedData);
  }

  async updatePost(id: number, data: UpdatePostRequest): Promise<ClientResponse<Post>> {
    const validatedData = updatePostSchema.parse(data);
    return this.apiClient.patch<Post, UpdatePostRequest>(`/posts/${id}`, validatedData);
  }

  async deletePost(id: number): Promise<ClientResponse<null>> {
    return this.apiClient.delete<null>(`/posts/${id}`);
  }

  // Categories methods
  async getCategories(filters?: CategoryFilters): Promise<ClientResponse<Category[]>> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    
    const query = params.toString();
    return this.apiClient.get<Category[]>(`/categories${query ? `?${query}` : ''}`);
  }

  async getCategoryById(id: number): Promise<ClientResponse<CategoryWithPosts>> {
    return this.apiClient.get<CategoryWithPosts>(`/categories/${id}`);
  }

  async createCategory(data: CreateCategoryRequest): Promise<ClientResponse<Category>> {
    const validatedData = createCategorySchema.parse(data);
    return this.apiClient.post<Category, CreateCategoryRequest>('/categories', validatedData);
  }

  async updateCategory(id: number, data: UpdateCategoryRequest): Promise<ClientResponse<Category>> {
    const validatedData = updateCategorySchema.parse(data);
    return this.apiClient.patch<Category, UpdateCategoryRequest>(`/categories/${id}`, validatedData);
  }

  async deleteCategory(id: number): Promise<ClientResponse<null>> {
    return this.apiClient.delete<null>(`/categories/${id}`);
  }
}

// Eksport singletona
export const apiClient = new ApiClient();
export default apiClient;
export const apiService = new ApiService();