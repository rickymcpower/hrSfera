export interface User {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'admin';
  pharmacyId: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  address: string;
}

export interface TimeEntry {
  id: string;
  userId: string;
  pharmacyId: string;
  checkIn: Date;
  checkOut?: Date;
  duration?: number; // in minutes
  date: string; // YYYY-MM-DD format
}

export interface Language {
  code: string;
  name: string;
}

export interface NewEmployeeData {
  name: string;
  email: string;
  role: 'employee' | 'admin';
}

export interface AppContextType {
  user: User | null;
  pharmacy: Pharmacy | null;
  language: string;
  currentStatus: 'checked-in' | 'checked-out';
  timeEntries: TimeEntry[];
  employees: User[];
  loading: boolean;
  setUser: (user: User | null) => void;
  setLanguage: (lang: string) => void;
  checkIn: () => Promise<void>;
  checkOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addEmployee: (employeeData: NewEmployeeData) => Promise<boolean>;
  refreshEmployees: () => Promise<void>;
  refreshTimeData: () => Promise<void>;
}