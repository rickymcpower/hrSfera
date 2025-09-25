import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useApp } from '../contexts/AppContext';
import { translations } from '../data/mockData';
import { Clock } from './Clock';
import { StatusIndicator } from './StatusIndicator';
import { LanguageSelector } from './LanguageSelector';
import { LogIn, LogOut, History, Settings, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TimeHistory } from './TimeHistory';
import { AdminDashboard } from './AdminDashboard';

export const EmployeeCheckIn: React.FC = () => {
  const { user, pharmacy, currentStatus, checkIn, checkOut, logout, language } = useApp();
  const t = translations[language as keyof typeof translations];

  const isWorking = currentStatus === 'checked-in';
  const isAdmin = user?.role === 'admin';

  const handleCheckInOut = () => {
    if (isWorking) {
      checkOut();
    } else {
      checkIn();
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      style={{
        background: `linear-gradient(135deg, ${pharmacy?.primaryColor}10 0%, ${pharmacy?.secondaryColor}05 100%)`
      }}
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{pharmacy?.logo}</div>
              <div>
                <h1 className="text-lg">{pharmacy?.name}</h1>
                <p className="text-sm text-gray-600">{t.welcome}, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              <Button variant="outline" size="sm" onClick={logout}>
                <User className="w-4 h-4 mr-2" />
                {t.logout}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <Tabs defaultValue="checkin" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="checkin" className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Check-in
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              {t.timeHistory}
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {t.dashboard}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="checkin" className="space-y-6">
            {/* Status Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Clock />
              <StatusIndicator />
            </div>

            {/* Main Check-in/out Button */}
            <Card className="shadow-lg border-0">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">
                  {isWorking ? t.checkOut : t.checkIn}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  size="lg"
                  className="w-full h-16 text-lg rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: isWorking ? '#ef4444' : pharmacy?.primaryColor || '#22c55e',
                    color: 'white'
                  }}
                  onClick={handleCheckInOut}
                >
                  {isWorking ? (
                    <>
                      <LogOut className="w-6 h-6 mr-3" />
                      {t.checkOut}
                    </>
                  ) : (
                    <>
                      <LogIn className="w-6 h-6 mr-3" />
                      {t.checkIn}
                    </>
                  )}
                </Button>
                
                <div className="mt-4 text-sm text-gray-600">
                  {isWorking 
                    ? 'Pulsa para registrar tu salida'
                    : 'Pulsa para registrar tu entrada'
                  }
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center p-4">
                <div className="text-2xl mb-1">8h 30m</div>
                <div className="text-sm text-gray-600">{t.today}</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl mb-1">42h 15m</div>
                <div className="text-sm text-gray-600">{t.thisWeek}</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl mb-1">180h 30m</div>
                <div className="text-sm text-gray-600">{t.thisMonth}</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl mb-1">8.2h</div>
                <div className="text-sm text-gray-600">{t.averageDaily}</div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <TimeHistory />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin">
              <AdminDashboard />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};