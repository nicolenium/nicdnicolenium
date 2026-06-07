
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils.js';

const LANGUAGE_NAMES = {
  en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', it: 'Italiano', 
  pt: 'Português', zh: '中文', ja: '日本語', ko: '한국어', ar: 'العربية', 
  hi: 'हिन्दी', tr: 'Türkçe', nl: 'Nederlands', pl: 'Polski', sv: 'Svenska', 
  no: 'Norsk', da: 'Dansk', fi: 'Suomi', el: 'Ελληνικά', cs: 'Čeština', 
  hu: 'Magyar', ro: 'Română', bg: 'Български', hr: 'Hrvatski', sr: 'Српски', 
  sk: 'Slovenčina', sl: 'Slovenščina', uk: 'Українська', vi: 'Tiếng Việt', 
  th: 'ไทย', id: 'Bahasa Indonesia', fil: 'Filipino', ms: 'Bahasa Melayu'
};

export default function LanguageSwitcher({ variant = 'default', className }) {
  const { language, setLanguage, supportedLanguages } = useLanguage();

  if (variant === 'icon') {
    return (
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className={cn("w-10 h-10 rounded-xl p-0 flex items-center justify-center bg-muted/50 border-border hover:bg-muted focus:ring-primary", className)}>
          <Globe className="w-5 h-5 text-foreground" />
        </SelectTrigger>
        <SelectContent align="end" className="border-2 rounded-xl shadow-xl max-h-[300px]">
          {supportedLanguages.map((lang) => (
            <SelectItem key={lang} value={lang} className="font-bold cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary">
              {LANGUAGE_NAMES[lang] || lang.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className={cn("w-[140px] h-10 rounded-xl bg-muted/50 border-border font-bold text-sm hover:bg-muted focus:ring-primary transition-colors", className)}>
        <Globe className="w-4 h-4 mr-2 text-primary" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent align="end" className="border-2 rounded-xl shadow-xl max-h-[300px]">
        {supportedLanguages.map((lang) => (
          <SelectItem key={lang} value={lang} className="font-bold cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary">
            {LANGUAGE_NAMES[lang] || lang.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
