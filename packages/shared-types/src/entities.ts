export interface User {
  id: number;
  email: string;
  name: string;
  role: 'employee' | 'admin';
  pharmacy_id: number;
  created_at: string;
  updated_at: string;
  pharmacy?: Pharmacy;
}

export interface Pharmacy {
  id: number;
  name: string;
  logo?: string;
  primary_color: string;
  secondary_color: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface TimeEntry {
  id: number;
  user_id: number;
  pharmacy_id: number;
  check_in: string;
  check_out?: string;
  duration_minutes?: number;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  pharmacy?: Pharmacy;
}