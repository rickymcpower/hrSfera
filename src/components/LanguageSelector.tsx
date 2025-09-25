import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useApp } from '../contexts/AppContext';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ca', name: 'Català', flag: '🏴󠁥󠁳󠁣󠁴󠁿' },
  { code: 'en', name: 'English', flag: '🇬🇧' }
];

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useApp();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-500" />
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};