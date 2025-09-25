import { ApiClient } from './client';
import type {
  ApiResponse,
  TimeEntry,
  TimeHistoryRequest,
  TimeHistoryResponse,
  TimeStatusResponse
} from '@hrsfera/shared-types';

export class TimeEntryAPI {
  constructor(private client: ApiClient) {}

  async checkIn(): Promise<TimeEntry> {
    const response = await this.client.post<TimeEntry>('/time-entries/check-in');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Check-in failed');
  }

  async checkOut(): Promise<TimeEntry> {
    const response = await this.client.put<TimeEntry>('/time-entries/check-out');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Check-out failed');
  }

  async getStatus(): Promise<TimeStatusResponse> {
    const response = await this.client.get<TimeStatusResponse>('/time-entries/status');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to get status');
  }

  async getHistory(params?: TimeHistoryRequest): Promise<TimeHistoryResponse> {
    const queryParams = new URLSearchParams();

    if (params?.start_date) {
      queryParams.append('start_date', params.start_date);
    }

    if (params?.end_date) {
      queryParams.append('end_date', params.end_date);
    }

    const url = `/time-entries/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.client.get<TimeHistoryResponse>(url);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to get history');
  }

  async getTodayEntry(): Promise<TimeEntry | null> {
    const response = await this.client.get<TimeEntry | null>('/time-entries/today');

    if (response.success) {
      return response.data || null;
    }

    throw new Error(response.message || 'Failed to get today entry');
  }
}