"use client";

import { useEffect, useState, useCallback } from "react";
import { IdentitySection } from "./sections/identity-section";
import { PublicProfileSection } from "./sections/public-profile-section";
import { PrivateProfileSection } from "./sections/private-profile-section";
import type { HumanContextData } from "@/lib/humanContext";
import { getHumanContextFromApi, updateHumanContextViaApi } from "@/lib/humanContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flex } from "@radix-ui/themes";

interface MyContextProps {
  userId: string;
}

export function MyContext({ userId }: MyContextProps) {
  const [contextData, setContextData] = useState<HumanContextData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContextData() {
      try {
        const data = await getHumanContextFromApi(userId);
        setContextData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch context data');
      } finally {
        setIsLoading(false);
      }
    }
    fetchContextData();
  }, [userId]);

  const updateContext = useCallback(async (data: HumanContextData) => {
    const updated = await updateHumanContextViaApi(userId, data);
    setContextData(updated);
    return updated;
  }, [userId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!contextData) return <div>No context data found.</div>;

  return (
    <Flex direction="column" gap="8" className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <IdentitySection contextData={contextData} userId={userId} updateContext={updateContext} />
      <PublicProfileSection contextData={contextData} userId={userId} updateContext={updateContext} />
      <PrivateProfileSection contextData={contextData} userId={userId} updateContext={updateContext} />
      <Flex justify="end" className="mt-4">
        <Link href="/hcp/preferences" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto my-auto" variant="outline">
            Edit my preferences &rarr;
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
} 