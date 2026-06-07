
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

export default function BackButton({ className = '', variant = 'ghost', size = 'default' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  // Don't show back button on the home page
  if (location.pathname === '/') return null;

  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={() => navigate(-1)} 
      className={`gap-2 font-bold transition-all duration-300 hover:-translate-x-1 ${className}`}
      aria-label="Go Back"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="hidden sm:inline">{t('common.goBack') || 'Go Back'}</span>
    </Button>
  );
}
