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

import { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';


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

export type ClientResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export class GenericApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private axiosInstance: AxiosInstance;

  constructor(baseUrl?: string) {
    baseUrl = baseUrl || API_BASE_PATH;
    console.log('111 baseUrl:', baseUrl, 'API_BASE_PATH:', API_BASE_PATH, 'API_BASE_URL:', API_BASE_URL);
    const apiBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    this.baseUrl = (baseUrl.startsWith('http') ? baseUrl : apiBaseUrl + baseUrl);
    console.log('222 baseUrl:', this.baseUrl);
    // Pobierz token z localStorage przy inicjalizacji
    console.log('API Client initialized with baseUrl:', this.baseUrl);
    this.token = localStorage.getItem('authToken');
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
    });
    this.axiosInstance.interceptors.request.use(
		async (config) => {
			const token = this.getAccessToken();
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		},
		(error) => Promise.reject(error)
	);
  }
  private getAccessToken(): string | null {
    return localStorage.getItem('authToken');
  }
  public async rawGet<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<AxiosResponse<T>> {
    let url = endpoint;

    if (params) {
      const query = new URLSearchParams(params).toString();
      url += `?${query}`;
    }
    const result = await this.axiosInstance.get<T>(url);
    return result;
  }

  public async get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T> {
    const result = await this.rawGet<T>(endpoint, params);
    return result.data;
  }

  public async post<T, U>(
    endpoint: string,
    body?: U,
  ): Promise<T> {
    console.log('POST to', endpoint, 'with body', body);
    const response = await this.axiosInstance.post<T>(endpoint, body);
    return response.data;
  }
  public async rawPost<T, U>(
    endpoint: string,
    body?: U,
  ): Promise<AxiosResponse<T>> {
    return await this.axiosInstance.post<T>(endpoint, body);
  }
  
  public async put<T, U>(
    endpoint: string,
    body?: U,
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(endpoint, body);
    return response.data;
  }
  public async rawPut<T, U>(
    endpoint: string,
    body?: U,
  ): Promise<AxiosResponse<T>> {
    return await this.axiosInstance.put<T>(endpoint, body);
  }
  public async patch<T, U>(
    endpoint: string,
    body?: U,
  ): Promise<T> {
    const response = await this.axiosInstance.patch<T>(endpoint, body);
    return response.data;
  }
  public async rawPatch<T, U>(
    endpoint: string,
    body?: U,
  ): Promise<AxiosResponse<T>> {
    return await this.axiosInstance.patch<T>(endpoint, body);
  }

  public async delete<T>(
    endpoint: string,
  ): Promise<T> {
    const response = await this.axiosInstance.delete<T>(endpoint);
    return response.data;
  }
  public async rawDelete<T>(
    endpoint: string,
  ): Promise<AxiosResponse<T>> {
    return await this.axiosInstance.delete<T>(endpoint);
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
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const validatedData = registerSchema.parse(data);
    return this.apiClient.post<AuthResponse, RegisterRequest>('/auth/register', validatedData);
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const validatedData = loginSchema.parse(data);
    const response = await this.apiClient.post<AuthResponse, LoginRequest>('/auth/login', validatedData);

    if (response.access_token) {
      this.setToken(response.access_token);
    }

    return response;
  }

  async logout(): Promise<{ message: string }> {
    try {
      // Call server logout endpoint to invalidate token
      const response = await this.apiClient.rawPost<{ message: string }, null>('/auth/logout');
      
      // Always clear token regardless of server response
      this.clearToken();

      return response.status === 200
        ? response.data
        : { message: 'Logged out locally' };
    } catch (error) {
      // Even if server logout fails, clear local token
      this.clearToken();
      return { message: 'Logged out locally' };
    }
  }

  async getProfile(): Promise<User> {
    return this.apiClient.get<User>('/auth/me');
  }

  // Users methods
  async updateProfile(data: UpdateUserRequest): Promise<User> {
    const validatedData = updateUserSchema.parse(data);
    return this.apiClient.patch<User, UpdateUserRequest>('/users/profile', validatedData);
  }

  async changePassword(data: ChangePasswordRequest): Promise<null> {
    const validatedData = changePasswordSchema.parse(data);
    return this.apiClient.patch<null, ChangePasswordRequest>('/users/change-password', validatedData);
  }

  // Posts methods
  async getPosts(filters?: PostFilters, pagination?: PaginationQuery): Promise<PostWithRelations[]> {
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

  async getPostById(id: number): Promise<PostWithRelations> {
    return this.apiClient.get<PostWithRelations>(`/posts/${id}`);
  }

  async createPost(data: CreatePostRequest): Promise<Post> {
    const validatedData = createPostSchema.parse(data);
    return this.apiClient.post<Post, CreatePostRequest>('/posts', validatedData);
  }

  async updatePost(id: number, data: UpdatePostRequest): Promise<Post> {
    const validatedData = updatePostSchema.parse(data);
    return this.apiClient.patch<Post, UpdatePostRequest>(`/posts/${id}`, validatedData);
  }

  async deletePost(id: number): Promise<null> {
    return this.apiClient.delete<null>(`/posts/${id}`);
  }

  // Categories methods
  async getCategories(filters?: CategoryFilters): Promise<Category[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    
    const query = params.toString();
    return this.apiClient.get<Category[]>(`/categories${query ? `?${query}` : ''}`);
  }

  async getCategoryById(id: number): Promise<CategoryWithPosts> {
    return this.apiClient.get<CategoryWithPosts>(`/categories/${id}`);
  }

  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const validatedData = createCategorySchema.parse(data);
    return this.apiClient.post<Category, CreateCategoryRequest>('/categories', validatedData);
  }

  async updateCategory(id: number, data: UpdateCategoryRequest): Promise<Category> {
    const validatedData = updateCategorySchema.parse(data);
    return this.apiClient.patch<Category, UpdateCategoryRequest>(`/categories/${id}`, validatedData);
  }

  async deleteCategory(id: number): Promise<null> {
    return this.apiClient.delete<null>(`/categories/${id}`);
  }
}

// Eksport singletona
export const apiClient = new ApiClient();
export default apiClient;
export const apiService = new ApiService();