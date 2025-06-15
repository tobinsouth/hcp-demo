import { useState, useEffect } from 'react';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import type { HumanContextData } from './humanContext';

export function useOnboarding() {
  const { user, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [initialData, setInitialData] = useState<HumanContextData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user || loading) return;

      try {
        // First sync the user's identity data
        const syncResponse = await fetch('/api/context/sync', {
          method: 'POST',
        });
        
        if (!syncResponse.ok) {
          throw new Error('Failed to sync user identity');
        }

        // Then check if they have completed onboarding
        const contextResponse = await fetch(`/api/context/${user.id}`);
        
        if (contextResponse.status === 404) {
          // If context doesn't exist, show onboarding with initial data from user
          setInitialData({
            identity: {
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email,
              country: undefined,
              city: undefined,
            },
            publicAbout: undefined,
            privateAbout: undefined,
            privateMemories: undefined,
            privatePreferences: undefined,
            secureInfo: undefined,
            customRules: undefined,
          });
          setShowOnboarding(true);
          setIsLoading(false);
          return;
        }
        
        if (!contextResponse.ok) {
          throw new Error('Failed to get user context');
        }

        const context = await contextResponse.json();
        
        if (context) {
          setInitialData({
            identity: {
              firstName: context.firstName,
              lastName: context.lastName,
              email: context.email,
              country: context.country || undefined,
              city: context.city || undefined,
            },
            publicAbout: context.publicAbout || undefined,
            privateAbout: context.privateAbout || undefined,
            privateMemories: context.privateMemories as string[] || undefined,
            privatePreferences: context.privatePreferences as Record<string, any> || undefined,
            secureInfo: context.secureInfo as Record<string, any> || undefined,
            customRules: context.customRules || undefined,
          });

          // Show onboarding if they haven't filled out their profile
          const hasCompletedOnboarding = context.publicAbout && context.country;
          setShowOnboarding(!hasCompletedOnboarding);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // If there's an error, show onboarding with initial data from user
        setInitialData({
          identity: {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email,
            country: undefined,
            city: undefined,
          },
          publicAbout: undefined,
          privateAbout: undefined,
          privateMemories: undefined,
          privatePreferences: undefined,
          secureInfo: undefined,
          customRules: undefined,
        });
        setShowOnboarding(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.firstName && user?.lastName && user?.publicAbout) {
      setHasOnboarded(true);
    }

    checkOnboardingStatus();
  }, [user, loading]);

  return {
    showOnboarding,
    setShowOnboarding,
    initialData,
    isLoading,
    hasOnboarded,
  };
} 