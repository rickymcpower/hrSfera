import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useApp } from '../contexts/AppContext';
import { translations } from '../data/mockData';
import { Users, BarChart3, Download, TrendingUp, Clock, AlertCircle, UserPlus } from 'lucide-react';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { EmployeeManagement } from './EmployeeManagement';

export const AdminDashboard: React.FC = () => {
  const { pharmacy, timeEntries, language, employees } = useApp();
  const t = translations[language as keyof typeof translations];

  // Get employees from this pharmacy
  const pharmacyEmployees = employees.filter(u => u.pharmacyId === pharmacy?.id && u.role === 'employee');
  
  // Calculate current working employees
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = timeEntries.filter(entry => entry.date === today && entry.pharmacyId === pharmacy?.id);
  const currentlyWorking = todayEntries.filter(entry => !entry.checkOut).length;

  // Calculate weekly stats
  const thisWeek = getThisWeekEntries();
  const weeklyHours = thisWeek.reduce((total, entry) => total + (entry.duration || 0), 0);
  const averageDaily = weeklyHours / 7;

  function getThisWeekEntries() {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    weekStart.setHours(0, 0, 0, 0);
    
    return timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekStart && entry.pharmacyId === pharmacy?.id;
    });
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const exportReport = () => {
    const reportData = pharmacyEmployees.map(employee => {
      const employeeEntries = timeEntries.filter(entry => 
        entry.userId === employee.id && 
        entry.pharmacyId === pharmacy?.id
      );
      const totalHours = employeeEntries.reduce((total, entry) => total + (entry.duration || 0), 0);
      
      return {
        name: employee.name,
        email: employee.email,
        totalHours: formatDuration(totalHours),
        entriesCount: employeeEntries.length,
        averageDaily: formatDuration(totalHours / Math.max(employeeEntries.length, 1))
      };
    });

    const headers = ['Empleado', 'Email', 'Horas Totales', 'Días Trabajados', 'Promedio Diario'];
    const csvContent = [
      headers.join(','),
      ...reportData.map(row => [
        row.name,
        row.email,
        row.totalHours,
        row.entriesCount,
        row.averageDaily
      ].join(','))
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_${pharmacy?.name?.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Resumen
        </TabsTrigger>
        <TabsTrigger value="employees" className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          {t.employees}
        </TabsTrigger>
        <TabsTrigger value="reports" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          {t.reports}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t.employees}</p>
                <p className="text-2xl">{pharmacyEmployees.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t.currentlyWorking}</p>
                <p className="text-2xl">{currentlyWorking}</p>
              </div>
              <Clock 
                className="w-8 h-8" 
                style={{ color: pharmacy?.primaryColor || '#22c55e' }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Horas Semanales</p>
                <p className="text-2xl">{formatDuration(weeklyHours)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Promedio Diario</p>
                <p className="text-2xl">{formatDuration(averageDaily)}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Estado Actual de Empleados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Hora Entrada</TableHead>
                <TableHead>Duración</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pharmacyEmployees.map((employee) => {
                const todayEntry = todayEntries.find(entry => entry.userId === employee.id);
                const isWorking = todayEntry && !todayEntry.checkOut;
                const duration = todayEntry && !todayEntry.checkOut 
                  ? Math.floor((Date.now() - todayEntry.checkIn.getTime()) / (1000 * 60))
                  : todayEntry?.duration || 0;

                return (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={isWorking ? "default" : "secondary"}
                        style={isWorking ? {
                          backgroundColor: pharmacy?.primaryColor || '#22c55e',
                          color: 'white'
                        } : {}}
                      >
                        {isWorking ? t.working : t.offDuty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {todayEntry ? (
                        todayEntry.checkIn.toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono">
                        {duration > 0 ? formatDuration(duration) : '-'}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Compliance Report */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Reporte de Cumplimiento
            </CardTitle>
            <Button 
              variant="outline" 
              onClick={exportReport}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {t.export} Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pharmacyEmployees.map((employee) => {
              const employeeEntries = timeEntries.filter(entry => 
                entry.userId === employee.id && 
                entry.pharmacyId === pharmacy?.id
              );
              const completedEntries = employeeEntries.filter(entry => entry.checkOut);
              const complianceRate = employeeEntries.length > 0 
                ? (completedEntries.length / employeeEntries.length) * 100 
                : 100;

              return (
                <div key={employee.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{employee.name}</h4>
                      <p className="text-sm text-gray-600">{employee.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{complianceRate.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">Cumplimiento</div>
                    </div>
                  </div>
                  <Progress 
                    value={complianceRate} 
                    className="h-2"
                  />
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{completedEntries.length} de {employeeEntries.length} registros completos</span>
                    {complianceRate < 90 && (
                      <div className="flex items-center gap-1 text-amber-600">
                        <AlertCircle className="w-3 h-3" />
                        Requiere atención
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      </TabsContent>

      <TabsContent value="employees">
        <EmployeeManagement />
      </TabsContent>

      <TabsContent value="reports" className="space-y-6">
        {/* Compliance Report */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Reporte de Cumplimiento
              </CardTitle>
              <Button 
                variant="outline" 
                onClick={exportReport}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t.export} Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pharmacyEmployees.map((employee) => {
                const employeeEntries = timeEntries.filter(entry => 
                  entry.userId === employee.id && 
                  entry.pharmacyId === pharmacy?.id
                );
                const completedEntries = employeeEntries.filter(entry => entry.checkOut);
                const complianceRate = employeeEntries.length > 0 
                  ? (completedEntries.length / employeeEntries.length) * 100 
                  : 100;

                return (
                  <div key={employee.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{employee.name}</h4>
                        <p className="text-sm text-gray-600">{employee.email}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{complianceRate.toFixed(1)}%</div>
                        <div className="text-xs text-gray-500">Cumplimiento</div>
                      </div>
                    </div>
                    <Progress 
                      value={complianceRate} 
                      className="h-2"
                    />
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>{completedEntries.length} de {employeeEntries.length} registros completos</span>
                      {complianceRate < 90 && (
                        <div className="flex items-center gap-1 text-amber-600">
                          <AlertCircle className="w-3 h-3" />
                          Requiere atención
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};