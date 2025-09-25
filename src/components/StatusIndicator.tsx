import React from 'react';
import { useApp } from '../contexts/AppContext';
import { translations } from '../data/mockData';
import { Badge } from './ui/badge';
import { CircleDot, Circle } from 'lucide-react';

export const StatusIndicator: React.FC = () => {
  const { currentStatus, language, pharmacy } = useApp();
  const t = translations[language as keyof typeof translations];

  const isWorking = currentStatus === 'checked-in';

  return (
    <div className="flex items-center justify-center gap-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2">
        {isWorking ? (
          <CircleDot 
            className="w-5 h-5" 
            style={{ color: pharmacy?.primaryColor || '#22c55e' }}
          />
        ) : (
          <Circle className="w-5 h-5 text-gray-400" />
        )}
        <Badge 
          variant={isWorking ? "default" : "secondary"}
          className={isWorking ? "" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}
          style={isWorking ? { 
            backgroundColor: pharmacy?.primaryColor || '#22c55e',
            color: 'white'
          } : {}}
        >
          {isWorking ? t.working : t.offDuty}
        </Badge>
      </div>
    </div>
  );
};