import { User, Pharmacy, TimeEntry } from '../types';

export const pharmacies: Pharmacy[] = [
  {
    id: 'pharmacy-1',
    name: 'Farmacia Central',
    logo: '💊',
    primaryColor: '#22c55e',
    secondaryColor: '#16a34a',
    address: 'Calle Mayor 123, Madrid'
  },
  {
    id: 'pharmacy-2',
    name: 'Farmacia San José',
    logo: '🏥',
    primaryColor: '#3b82f6',
    secondaryColor: '#1d4ed8',
    address: 'Avenida Diagonal 456, Barcelona'
  },
  {
    id: 'pharmacy-3',
    name: 'Farmacia del Sol',
    logo: '☀️',
    primaryColor: '#f59e0b',
    secondaryColor: '#d97706',
    address: 'Plaza del Sol 789, Valencia'
  }
];

export const users: User[] = [
  {
    id: 'user-1',
    email: 'maria.garcia@farmaciacentral.com',
    name: 'María García',
    role: 'employee',
    pharmacyId: 'pharmacy-1'
  },
  {
    id: 'user-2',
    email: 'carlos.lopez@farmaciacentral.com',
    name: 'Carlos López',
    role: 'admin',
    pharmacyId: 'pharmacy-1'
  },
  {
    id: 'user-3',
    email: 'ana.martinez@farmaciasanjose.com',
    name: 'Ana Martínez',
    role: 'employee',
    pharmacyId: 'pharmacy-2'
  },
  {
    id: 'user-4',
    email: 'pedro.ruiz@farmaciadelsol.com',
    name: 'Pedro Ruiz',
    role: 'employee',
    pharmacyId: 'pharmacy-3'
  }
];

export const mockTimeEntries: TimeEntry[] = [
  {
    id: 'entry-1',
    userId: 'user-1',
    pharmacyId: 'pharmacy-1',
    checkIn: new Date('2024-01-15T09:00:00'),
    checkOut: new Date('2024-01-15T17:30:00'),
    duration: 510,
    date: '2024-01-15'
  },
  {
    id: 'entry-2',
    userId: 'user-1',
    pharmacyId: 'pharmacy-1',
    checkIn: new Date('2024-01-16T08:45:00'),
    checkOut: new Date('2024-01-16T17:15:00'),
    duration: 510,
    date: '2024-01-16'
  },
  {
    id: 'entry-3',
    userId: 'user-1',
    pharmacyId: 'pharmacy-1',
    checkIn: new Date('2024-01-17T09:15:00'),
    checkOut: new Date('2024-01-17T18:00:00'),
    duration: 525,
    date: '2024-01-17'
  },
  {
    id: 'entry-4',
    userId: 'user-1',
    pharmacyId: 'pharmacy-1',
    checkIn: new Date('2024-01-18T08:30:00'),
    checkOut: new Date('2024-01-18T16:45:00'),
    duration: 495,
    date: '2024-01-18'
  },
  {
    id: 'entry-5',
    userId: 'user-1',
    pharmacyId: 'pharmacy-1',
    checkIn: new Date('2024-01-19T09:00:00'),
    date: '2024-01-19'
  }
];

export const translations = {
  es: {
    login: 'Iniciar Sesión',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    checkIn: 'Fichar Entrada',
    checkOut: 'Fichar Salida',
    working: 'Trabajando',
    offDuty: 'Fuera de Turno',
    timeHistory: 'Histórico de Fichajes',
    dashboard: 'Panel de Control',
    employees: 'Empleados',
    reports: 'Reportes',
    export: 'Exportar',
    date: 'Fecha',
    timeIn: 'Entrada',
    timeOut: 'Salida',
    duration: 'Duración',
    currentlyWorking: 'Actualmente Trabajando',
    logout: 'Cerrar Sesión',
    welcome: 'Bienvenido/a',
    today: 'Hoy',
    thisWeek: 'Esta Semana',
    thisMonth: 'Este Mes',
    totalHours: 'Horas Totales',
    averageDaily: 'Promedio Diario',
    language: 'Idioma',
    addEmployee: 'Añadir Empleado',
    newEmployee: 'Nuevo Empleado',
    employeeName: 'Nombre del Empleado',
    employeeRole: 'Rol',
    admin: 'Administrador',
    employee: 'Empleado',
    save: 'Guardar',
    cancel: 'Cancelar',
    employeeAdded: 'Empleado añadido correctamente',
    emailExists: 'Este email ya está registrado',
    fillAllFields: 'Por favor, rellena todos los campos',
    employeeManagement: 'Gestión de Empleados'
  },
  ca: {
    login: 'Iniciar Sessió',
    email: 'Correu Electrònic',
    password: 'Contrasenya',
    checkIn: 'Fitxar Entrada',
    checkOut: 'Fitxar Sortida',
    working: 'Treballant',
    offDuty: 'Fora de Torn',
    timeHistory: 'Històric de Fitxatges',
    dashboard: 'Panell de Control',
    employees: 'Empleats',
    reports: 'Reports',
    export: 'Exportar',
    date: 'Data',
    timeIn: 'Entrada',
    timeOut: 'Sortida',
    duration: 'Durada',
    currentlyWorking: 'Actualment Treballant',
    logout: 'Tancar Sessió',
    welcome: 'Benvingut/da',
    today: 'Avui',
    thisWeek: 'Aquesta Setmana',
    thisMonth: 'Aquest Mes',
    totalHours: 'Hores Totals',
    averageDaily: 'Promig Diari',
    language: 'Idioma',
    addEmployee: 'Afegir Empleat',
    newEmployee: 'Nou Empleat',
    employeeName: 'Nom de l\'Empleat',
    employeeRole: 'Rol',
    admin: 'Administrador',
    employee: 'Empleat',
    save: 'Guardar',
    cancel: 'Cancel·lar',
    employeeAdded: 'Empleat afegit correctament',
    emailExists: 'Aquest email ja està registrat',
    fillAllFields: 'Si us plau, ompliu tots els camps',
    employeeManagement: 'Gestió d\'Empleats'
  },
  en: {
    login: 'Login',
    email: 'Email',
    password: 'Password',
    checkIn: 'Check In',
    checkOut: 'Check Out',
    working: 'Working',
    offDuty: 'Off Duty',
    timeHistory: 'Time History',
    dashboard: 'Dashboard',
    employees: 'Employees',
    reports: 'Reports',
    export: 'Export',
    date: 'Date',
    timeIn: 'Time In',
    timeOut: 'Time Out',
    duration: 'Duration',
    currentlyWorking: 'Currently Working',
    logout: 'Logout',
    welcome: 'Welcome',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    totalHours: 'Total Hours',
    averageDaily: 'Daily Average',
    language: 'Language',
    addEmployee: 'Add Employee',
    newEmployee: 'New Employee',
    employeeName: 'Employee Name',
    employeeRole: 'Role',
    admin: 'Administrator',
    employee: 'Employee',
    save: 'Save',
    cancel: 'Cancel',
    employeeAdded: 'Employee added successfully',
    emailExists: 'This email is already registered',
    fillAllFields: 'Please fill all fields',
    employeeManagement: 'Employee Management'
  }
};