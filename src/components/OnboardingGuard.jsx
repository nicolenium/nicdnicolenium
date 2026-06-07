
import React from 'react';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus.js';
import OnboardingTrustScreen from '@/components/OnboardingTrustScreen.jsx';

export default function OnboardingGuard({ children }) {
  const { shouldShowOnboarding, completeOnboarding } = useOnboardingStatus();

  return (
    <>
      {/* Always render children so the game loads in the background, 
          but overlay the trust screen if needed to block interaction */}
      {children}
      
      {shouldShowOnboarding && (
        <OnboardingTrustScreen onComplete={completeOnboarding} />
      )}
    </>
  );
}
