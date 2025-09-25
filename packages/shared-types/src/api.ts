import { User, Pharmacy, TimeEntry } from './entities';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  pharmacy: Pharmacy;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  role: 'employee' | 'admin';
  password: string;
}

// Time Entry types
export interface TimeHistoryRequest {
  start_date?: string;
  end_date?: string;
}

export interface TimeHistoryResponse {
  entries: TimeEntry[];
  total_minutes: number;
  total_days: number;
}

export interface TimeStatusResponse {
  status: 'checked-in' | 'checked-out';
  current_entry?: TimeEntry;
  working_time?: string;
}