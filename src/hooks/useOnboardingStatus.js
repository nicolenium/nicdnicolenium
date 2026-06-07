
import { useAuth } from '@/contexts/AuthContext.jsx';

export function useOnboardingStatus() {
  const { currentUser, completeOnboarding, isAuthenticated } = useAuth();

  // If not authenticated, we might not want to show it, or we might want to force login first.
  // Assuming this is used in protected routes, isAuthenticated should be true.
  const hasCompletedOnboarding = currentUser?.onboardingCompleted === true;
  const shouldShowOnboarding = isAuthenticated && !hasCompletedOnboarding;

  return {
    hasCompletedOnboarding,
    shouldShowOnboarding,
    completeOnboarding
  };
}
