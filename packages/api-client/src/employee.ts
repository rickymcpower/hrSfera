import { ApiClient } from './client';
import type {
  ApiResponse,
  User,
  CreateEmployeeRequest
} from '@hrsfera/shared-types';

export class EmployeeAPI {
  constructor(private client: ApiClient) {}

  async getAll(): Promise<User[]> {
    const response = await this.client.get<User[]>('/employees');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to get employees');
  }

  async create(employeeData: CreateEmployeeRequest): Promise<User> {
    const response = await this.client.post<User>('/employees', employeeData);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to create employee');
  }

  async getById(id: number): Promise<User> {
    const response = await this.client.get<User>(`/employees/${id}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Employee not found');
  }

  async delete(id: number): Promise<void> {
    const response = await this.client.delete(`/employees/${id}`);

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete employee');
    }
  }
}