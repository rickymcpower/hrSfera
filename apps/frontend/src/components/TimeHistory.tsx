import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { useApp } from '../contexts/AppContext';
import { translations } from '../data/mockData';
import { Calendar, Clock, Download } from 'lucide-react';
import { Button } from './ui/button';

export const TimeHistory: React.FC = () => {
  const { user, timeEntries, language, pharmacy } = useApp();
  const t = translations[language as keyof typeof translations];

  const userEntries = timeEntries
    .filter(entry => entry.userId === user?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20); // Show last 20 entries

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const exportToCSV = () => {
    const headers = [t.date, t.timeIn, t.timeOut, t.duration];
    const csvContent = [
      headers.join(','),
      ...userEntries.map(entry => [
        entry.date,
        formatTime(entry.checkIn),
        entry.checkOut ? formatTime(entry.checkOut) : '',
        entry.duration ? formatDuration(entry.duration) : ''
      ].join(','))
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `fichajes_${user?.name?.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {t.timeHistory}
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToCSV}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {t.export} CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {userEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay registros de fichajes</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.date}</TableHead>
                  <TableHead>{t.timeIn}</TableHead>
                  <TableHead>{t.timeOut}</TableHead>
                  <TableHead>{t.duration}</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      {formatDate(entry.date)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        {formatTime(entry.checkIn)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {entry.checkOut ? (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-red-500" />
                          {formatTime(entry.checkOut)}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono">
                        {formatDuration(entry.duration)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={entry.checkOut ? "default" : "secondary"}
                        className={!entry.checkOut ? "" : ""}
                        style={!entry.checkOut ? {} : {
                          backgroundColor: pharmacy?.primaryColor || '#22c55e',
                          color: 'white'
                        }}
                      >
                        {entry.checkOut ? 'Completado' : t.working}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};