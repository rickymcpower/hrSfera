import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { LoginScreen } from './components/LoginScreen';
import { EmployeeCheckIn } from './components/EmployeeCheckIn';
import { Toaster } from './components/ui/sonner';

const AppContent: React.FC = () => {
  const { user } = useApp();

  if (!user) {
    return <LoginScreen />;
  }

  return <EmployeeCheckIn />;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="font-sans">
        <AppContent />
        <Toaster position="top-right" />
      </div>
    </AppProvider>
  );
};

export default App;