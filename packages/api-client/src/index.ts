export * from './client';
export * from './auth';
export * from './timeEntry';
export * from './employee';

// Main API class
import { ApiClient, apiClient } from './client';
import { AuthAPI } from './auth';
import { TimeEntryAPI } from './timeEntry';
import { EmployeeAPI } from './employee';

export class HrSferaAPI {
  public auth: AuthAPI;
  public timeEntry: TimeEntryAPI;
  public employee: EmployeeAPI;

  constructor(private client: ApiClient = apiClient) {
    this.auth = new AuthAPI(client);
    this.timeEntry = new TimeEntryAPI(client);
    this.employee = new EmployeeAPI(client);
  }

  initializeToken() {
    this.client.initializeToken();
  }
}

// Default instance
export const hrSferaAPI = new HrSferaAPI();