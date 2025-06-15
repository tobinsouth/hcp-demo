"use client";

import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { useOnboarding } from '@/lib/use-onboarding';
import { OnboardingModal } from './onboarding-modal';

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { showOnboarding, setShowOnboarding, initialData, isLoading, hasOnboarded } = useOnboarding();

  if (isLoading || authLoading) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {initialData && !hasOnboarded && (
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          userId={user?.id || ''}
          initialData={initialData}
        />
      )}
    </>
  );
} 