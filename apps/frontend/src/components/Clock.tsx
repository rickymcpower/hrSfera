import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';

export const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-center gap-2 mb-4">
        <ClockIcon className="w-6 h-6 text-gray-500" />
      </div>
      <div className="text-3xl font-mono mb-2">
        {formatTime(time)}
      </div>
      <div className="text-sm text-gray-600 capitalize">
        {formatDate(time)}
      </div>
    </div>
  );
};