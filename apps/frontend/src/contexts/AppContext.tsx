import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppContextType, User, Pharmacy, TimeEntry, NewEmployeeData } from '../types';
import { hrSferaAPI } from '@hrsfera/api-client';
import type { User as ApiUser, TimeEntry as ApiTimeEntry, Pharmacy as ApiPharmacy } from '@hrsfera/shared-types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [language, setLanguage] = useState('es');
  const [currentStatus, setCurrentStatus] = useState<'checked-in' | 'checked-out'>('checked-out');
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load time status
      const statusResponse = await hrSferaAPI.timeEntry.getStatus();
      setCurrentStatus(statusResponse.is_checked_in ? 'checked-in' : 'checked-out');

      // Load time history
      const historyResponse = await hrSferaAPI.timeEntry.getHistory();
      const mappedEntries: TimeEntry[] = historyResponse.data.map((entry: ApiTimeEntry) => ({
        id: entry.id.toString(),
        userId: entry.user_id.toString(),
        pharmacyId: entry.pharmacy_id.toString(),
        checkIn: new Date(entry.check_in_time),
        checkOut: entry.check_out_time ? new Date(entry.check_out_time) : undefined,
        duration: entry.duration || undefined,
        date: entry.date
      }));
      setTimeEntries(mappedEntries);

      // Load employees if user is admin
      if (user.role === 'admin') {
        const employeesResponse = await hrSferaAPI.employee.getAll();
        const mappedEmployees: User[] = employeesResponse.map((emp: ApiUser) => ({
          id: emp.id.toString(),
          email: emp.email,
          name: emp.name,
          role: emp.role as 'admin' | 'employee',
          pharmacyId: emp.pharmacy_id.toString()
        }));
        setEmployees(mappedEmployees);
      }

    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await hrSferaAPI.auth.login({ email, password });

      const mappedUser: User = {
        id: response.user.id.toString(),
        email: response.user.email,
        name: response.user.name,
        role: response.user.role as 'admin' | 'employee',
        pharmacyId: response.user.pharmacy_id.toString()
      };

      const mappedPharmacy: Pharmacy = {
        id: response.user.pharmacy.id.toString(),
        name: response.user.pharmacy.name,
        logo: '💊',
        primaryColor: response.user.pharmacy.primary_color || '#22c55e',
        secondaryColor: response.user.pharmacy.secondary_color || '#16a34a',
        address: response.user.pharmacy.address
      };

      setUser(mappedUser);
      setPharmacy(mappedPharmacy);
      hrSferaAPI.initializeToken();

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await hrSferaAPI.auth.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setPharmacy(null);
      setCurrentStatus('checked-out');
      setTimeEntries([]);
      setEmployees([]);
    }
  };

  const checkIn = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await hrSferaAPI.timeEntry.checkIn();

      // Refresh all time data to ensure consistency
      await refreshTimeData();
    } catch (error) {
      console.error('Check-in failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkOut = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await hrSferaAPI.timeEntry.checkOut();

      // Refresh all time data to ensure consistency
      await refreshTimeData();
    } catch (error) {
      console.error('Check-out failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshEmployees = async () => {
    if (!user || user.role !== 'admin') return;

    try {
      const employeesResponse = await hrSferaAPI.employee.getAll();
      const mappedEmployees: User[] = employeesResponse.map((emp: ApiUser) => ({
        id: emp.id.toString(),
        email: emp.email,
        name: emp.name,
        role: emp.role as 'admin' | 'employee',
        pharmacyId: emp.pharmacy_id.toString()
      }));
      setEmployees(mappedEmployees);
    } catch (error) {
      console.error('Failed to refresh employees:', error);
    }
  };

  const refreshTimeData = async () => {
    if (!user) return;

    try {
      // Load time status
      const statusResponse = await hrSferaAPI.timeEntry.getStatus();
      setCurrentStatus(statusResponse.is_checked_in ? 'checked-in' : 'checked-out');

      // Load time history
      const historyResponse = await hrSferaAPI.timeEntry.getHistory();
      const mappedEntries: TimeEntry[] = historyResponse.data.map((entry: ApiTimeEntry) => ({
        id: entry.id.toString(),
        userId: entry.user_id.toString(),
        pharmacyId: entry.pharmacy_id.toString(),
        checkIn: new Date(entry.check_in_time),
        checkOut: entry.check_out_time ? new Date(entry.check_out_time) : undefined,
        duration: entry.duration || undefined,
        date: entry.date
      }));
      setTimeEntries(mappedEntries);
    } catch (error) {
      console.error('Failed to refresh time data:', error);
    }
  };

  const addEmployee = async (employeeData: NewEmployeeData): Promise<boolean> => {
    if (!user || !pharmacy) return false;

    try {
      setLoading(true);

      const response = await hrSferaAPI.employee.create({
        name: employeeData.name,
        email: employeeData.email,
        password: 'password123', // Default password
        role: employeeData.role
      });

      // Refresh the entire employee list from API to ensure consistency
      await refreshEmployees();

      return true;
    } catch (error) {
      console.error('Failed to add employee:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value: AppContextType = {
    user,
    pharmacy,
    language,
    currentStatus,
    timeEntries,
    employees,
    loading,
    setUser,
    setLanguage,
    checkIn,
    checkOut,
    login,
    logout,
    addEmployee,
    refreshEmployees,
    refreshTimeData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};