import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useApp } from '../contexts/AppContext';
import { translations } from '../data/mockData';
import { Users, Search, Mail, UserCog, Crown } from 'lucide-react';
import { AddEmployeeDialog } from './AddEmployeeDialog';

export const EmployeeManagement: React.FC = () => {
  const { employees, pharmacy, language, refreshEmployees } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const t = translations[language as keyof typeof translations];

  // Filter employees by pharmacy and search term
  const pharmacyEmployees = employees
    .filter(emp => emp.pharmacyId === pharmacy?.id)
    .filter(emp =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleEmployeeAdded = () => {
    // No need for refreshKey anymore - addEmployee already refreshes the list
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {t.employeeManagement}
          </CardTitle>
          <AddEmployeeDialog onEmployeeAdded={handleEmployeeAdded} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar empleados por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Employees Table */}
          {pharmacyEmployees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>
                {searchTerm 
                  ? 'No se encontraron empleados que coincidan con la búsqueda'
                  : 'No hay empleados registrados'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empleado</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pharmacyEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                            {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{employee.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={employee.role === 'admin' ? 'default' : 'secondary'}
                          className={employee.role === 'admin' ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' : ''}
                        >
                          {employee.role === 'admin' ? (
                            <div className="flex items-center gap-1">
                              <Crown className="w-3 h-3" />
                              {t.admin}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <UserCog className="w-3 h-3" />
                              {t.employee}
                            </div>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Activo
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {pharmacyEmployees.length}
              </div>
              <div className="text-sm text-gray-600">Total Empleados</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {pharmacyEmployees.filter(emp => emp.role === 'admin').length}
              </div>
              <div className="text-sm text-gray-600">Administradores</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {pharmacyEmployees.filter(emp => emp.role === 'employee').length}
              </div>
              <div className="text-sm text-gray-600">Empleados</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};