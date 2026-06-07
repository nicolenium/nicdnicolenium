
import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { promptInstallation } from '@/utils/pwa-utils.js';

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const hasDismissed = localStorage.getItem('pwa-prompt-dismissed');
    
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      if (!hasDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    const accepted = await promptInstallation();
    if (accepted) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-prompt-dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-card border border-border shadow-2xl rounded-2xl p-4 z-50 flex items-start gap-4 animate-in slide-in-from-bottom-10">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
        <Download className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-foreground">Install Gaming Platform</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-3">
          Install our app for offline play, faster loading, and a better mobile experience.
        </p>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleInstall} className="flex-1">
            Install App
          </Button>
          <Button size="sm" variant="outline" onClick={handleDismiss}>
            Not Now
          </Button>
        </div>
      </div>
      <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground absolute top-2 right-2">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PWAInstallPrompt;
