import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useApp } from '../contexts/AppContext';
import { translations } from '../data/mockData';
import { LanguageSelector } from './LanguageSelector';
import { Loader2, Building2, Mail, Lock } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export const LoginScreen: React.FC = () => {
  const { login, language } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const t = translations[language as keyof typeof translations];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(email, password);
    
    if (!success) {
      setError('Credenciales inválidas. Intenta con: maria.garcia@farmaciacentral.com');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl mb-2">PharmaClock</h1>
          <p className="text-gray-600">Sistema de Control Horario</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">{t.login}</CardTitle>
            <CardDescription className="text-center">
              Accede a tu cuenta para fichar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@farmacia.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  t.login
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 mb-3 text-center">
                Demo - Usuarios de prueba:
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div>👩‍💼 <span className="font-mono">maria.garcia@farmaciacentral.com</span></div>
                <div>👨‍💼 <span className="font-mono">carlos.lopez@farmaciacentral.com</span> (Admin)</div>
                <div>👩‍💼 <span className="font-mono">ana.martinez@farmaciasanjose.com</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-center">
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
};