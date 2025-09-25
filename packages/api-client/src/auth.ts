import { ApiClient } from './client';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  User,
  Pharmacy
} from '@hrsfera/shared-types';

export class AuthAPI {
  constructor(private client: ApiClient) {}

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/auth/login', credentials);

    if (response.success && response.data) {
      this.client.setToken(response.data.token);
      return response.data;
    }

    throw new Error(response.message || 'Login failed');
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
    this.client.clearToken();
  }

  async getCurrentUser(): Promise<{ user: User; pharmacy: Pharmacy }> {
    const response = await this.client.get<{ user: User; pharmacy: Pharmacy }>('/auth/user');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to get user');
  }
}