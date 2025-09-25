import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppContextType, User, Pharmacy, TimeEntry, NewEmployeeData } from '../types';
import { users, pharmacies, mockTimeEntries } from '../data/mockData';

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
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(mockTimeEntries);
  const [employees, setEmployees] = useState<User[]>(users);

  useEffect(() => {
    if (user) {
      const userPharmacy = pharmacies.find(p => p.id === user.pharmacyId);
      setPharmacy(userPharmacy || null);
      
      // Check if user is currently checked in
      const todayEntries = timeEntries.filter(entry => 
        entry.userId === user.id && 
        entry.date === new Date().toISOString().split('T')[0]
      );
      
      const lastEntry = todayEntries[todayEntries.length - 1];
      if (lastEntry && !lastEntry.checkOut) {
        setCurrentStatus('checked-in');
      } else {
        setCurrentStatus('checked-out');
      }
    }
  }, [user, timeEntries]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = employees.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setPharmacy(null);
    setCurrentStatus('checked-out');
  };

  const checkIn = () => {
    if (!user) return;
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const newEntry: TimeEntry = {
      id: `entry-${Date.now()}`,
      userId: user.id,
      pharmacyId: user.pharmacyId,
      checkIn: now,
      date: today
    };
    
    setTimeEntries(prev => [...prev, newEntry]);
    setCurrentStatus('checked-in');
  };

  const checkOut = () => {
    if (!user) return;
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    setTimeEntries(prev => prev.map(entry => {
      if (entry.userId === user.id && entry.date === today && !entry.checkOut) {
        const duration = Math.floor((now.getTime() - entry.checkIn.getTime()) / (1000 * 60));
        return {
          ...entry,
          checkOut: now,
          duration
        };
      }
      return entry;
    }));
    
    setCurrentStatus('checked-out');
  };

  const addEmployee = async (employeeData: NewEmployeeData): Promise<boolean> => {
    if (!user || !pharmacy) return false;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    const emailExists = employees.some(emp => emp.email === employeeData.email);
    if (emailExists) {
      return false;
    }
    
    const newEmployee: User = {
      id: `user-${Date.now()}`,
      email: employeeData.email,
      name: employeeData.name,
      role: employeeData.role,
      pharmacyId: pharmacy.id
    };
    
    setEmployees(prev => [...prev, newEmployee]);
    return true;
  };

  const value: AppContextType = {
    user,
    pharmacy,
    language,
    currentStatus,
    timeEntries,
    employees,
    setUser,
    setLanguage,
    checkIn,
    checkOut,
    login,
    logout,
    addEmployee
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};