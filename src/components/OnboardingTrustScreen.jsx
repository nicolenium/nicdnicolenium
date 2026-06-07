
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Lock, HelpCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

export default function OnboardingTrustScreen({ onComplete }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    setIsSubmitting(true);
    await onComplete();
    // The parent component will unmount this when state updates
  };

  return (
    <div className="trust-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="trust-card"
      >
        {/* Header Area */}
        <div className="bg-muted/20 border-b border-border/50 p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-2">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              Welcome to NICD NICOLENIUM
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Before you start playing, please review our core principles. We are committed to providing a fair, secure, and enjoyable environment for all players globally.
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="trust-section-grid">
          
          <div className="trust-feature-block">
            <div className="flex items-start gap-4">
              <div className="trust-icon-wrapper">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Fair Play Commitment</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We enforce strict anti-cheat measures. Using external assistance, engines, or exploiting bugs is strictly prohibited and will result in account suspension. Play honorably.
                </p>
              </div>
            </div>
          </div>

          <div className="trust-feature-block">
            <div className="flex items-start gap-4">
              <div className="trust-icon-wrapper">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Game Rules & Standards</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  All games follow official international rulesets unless specified otherwise in the lobby. Familiarize yourself with the specific variant rules before joining competitive matches.
                </p>
              </div>
            </div>
          </div>

          <div className="trust-feature-block">
            <div className="flex items-start gap-4">
              <div className="trust-icon-wrapper">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Your Privacy Matters</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your data is encrypted and protected. We do not share your personal information with third parties without consent. You control your profile visibility in settings.
                </p>
              </div>
            </div>
          </div>

          <div className="trust-feature-block">
            <div className="flex items-start gap-4">
              <div className="trust-icon-wrapper">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">We're Here to Help</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Encountered an issue or toxic behavior? Use the in-game reporting tools or contact our support team. We actively moderate the community to ensure a safe space.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Action */}
        <div className="p-6 md:p-8 border-t border-border/50 bg-muted/10 flex flex-col items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="w-full sm:w-auto min-w-[280px] h-14 text-lg font-bold rounded-xl shadow-glow-primary transition-all active:scale-[0.98]"
            onClick={handleComplete}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5 mr-2" />
            )}
            I Understand & Continue
          </Button>
          <p className="text-xs text-muted-foreground text-center max-w-md">
            By continuing, you agree to abide by these principles and our Terms of Service.
          </p>
        </div>

      </motion.div>
    </div>
  );
}
