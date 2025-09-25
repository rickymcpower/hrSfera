import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useApp } from '../contexts/AppContext';
import { translations } from '../data/mockData';
import { UserPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from './ui/alert';

interface AddEmployeeDialogProps {
  onEmployeeAdded?: () => void;
}

export const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({ onEmployeeAdded }) => {
  const { addEmployee, language, pharmacy } = useApp();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee' as 'employee' | 'admin'
  });

  const t = translations[language as keyof typeof translations];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role) {
      setError(t.fillAllFields);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Por favor, introduce un email válido');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await addEmployee(formData);
      
      if (success) {
        toast.success(t.employeeAdded);
        setFormData({ name: '', email: '', role: 'employee' });
        setOpen(false);
        onEmployeeAdded?.();
      } else {
        setError(t.emailExists);
      }
    } catch (err) {
      setError('Error al añadir empleado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setFormData({ name: '', email: '', role: 'employee' });
      setError('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          className="flex items-center gap-2"
          style={{
            backgroundColor: pharmacy?.primaryColor || '#22c55e',
            color: 'white'
          }}
        >
          <UserPlus className="w-4 h-4" />
          {t.addEmployee}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            {t.newEmployee}
          </DialogTitle>
          <DialogDescription>
            Añade un nuevo empleado a {pharmacy?.name}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">{t.employeeName}</Label>
            <Input
              id="name"
              type="text"
              placeholder="Juan Pérez"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">{t.email}</Label>
            <Input
              id="email"
              type="email"
              placeholder="juan.perez@farmacia.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">{t.employeeRole}</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value: 'employee' | 'admin') => 
                setFormData(prev => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">{t.employee}</SelectItem>
                <SelectItem value="admin">{t.admin}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              {t.cancel}
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              style={{
                backgroundColor: pharmacy?.primaryColor || '#22c55e',
                color: 'white'
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                t.save
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};