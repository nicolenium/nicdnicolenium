
import React from 'react';
import { Globe2, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' }
];

export default function LanguageSupportSection() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <section className="py-24 bg-card border-y border-border relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
            <Globe2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 text-foreground">
            Play in your language
          </h2>
          <p className="text-xl text-muted-foreground font-medium">
            NICD NICOLENIUM is fully localized in 12 languages. Select your preferred language below to instantly translate the entire platform.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isActive = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isActive 
                    ? 'bg-primary/10 border-primary shadow-glow-primary scale-105 z-10' 
                    : 'bg-background border-border hover:border-primary/50 hover:bg-muted hover:-translate-y-1'
                }`}
              >
                {isActive && (
                  <div className="absolute top-3 right-3 text-primary">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                <span className="text-4xl mb-3 block drop-shadow-sm">{lang.flag}</span>
                <span className={`font-bold text-base mb-1 ${isActive ? 'text-primary' : 'text-foreground'}`}>
                  {lang.native}
                </span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {lang.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
