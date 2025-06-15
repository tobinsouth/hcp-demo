"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Heading, Section, Text, Flex, Container } from "@radix-ui/themes"
import Link from "next/link";

// Type for context data
interface ContextData {
  firstName: string;
  lastName: string;
  email: string;
  _count?: {
    memories: number;
    preferences: number;
  };
  publicAbout: string;
}

function ContextDashboard({ userId }: { userId: string }) {
  const [contextData, setContextData] = useState<ContextData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContextData() {
      try {
        const response = await fetch(`/api/context/${userId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch context data: ${response.statusText}`);
        }
        const data = await response.json();
        setContextData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch context data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchContextData();
  }, [userId]);

  if (isLoading) {
    return (
      <Card className="p-8 mt-8 max-w-2xl mx-auto">
        <div className="flex flex-col items-center gap-6">
          <Skeleton className="h-10 w-2/3 mb-2" />
          <div className="flex gap-4">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <Skeleton className="h-6 w-1/2 mt-6" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 mt-8 max-w-2xl mx-auto">
        <p className="text-red-500 text-center">Error: {error}</p>
      </Card>
    );
  }

  if (!contextData) {
    return (
      <Card className="p-8 mt-8 max-w-2xl mx-auto">
        <p className="text-center">No context data available.</p>
      </Card>
    );
  }

  const header_text = contextData.firstName ? `Welcome back, ${contextData.firstName}` : "Time to set some context";
  const memoriesCount = contextData._count?.memories || 0;
  const preferencesCount = contextData._count?.preferences || 0;

  if (!contextData.firstName || !contextData.publicAbout) {
    return (
      <Section>
        <Flex direction="column" gap="4">
          <Heading size="8" className="text-center">Time to set some context</Heading>
          <Text>
            Welcome to your Human Context Dashboard! This app empowers you to view, manage, and control the personal context you share with language models. Use the sidebar on the left to navigate:
            <ul className="list-disc pl-6 mt-2">
              <li><b>Home</b>: Your main dashboard (this page).</li>
              <li><b>My Context</b>: Review and update your memories and preferences.</li>
              <li><b>Connect MCP</b>: Link your context to the Model Context Protocol for smarter AI experiences.</li>
              <li><b>Integrations</b>: (Coming soon) Connect with other services.</li>
              <li><b>Settings</b>: Set rules and control how your context is shared with language models.</li>
            </ul>
            <br />
            Visit <b>Settings</b> to define control rules, manage privacy, and decide exactly what information is shared and how it is used by AI systems.
          </Text>
          <Flex justify="center">
            <Button className="max-w-lg">Resume Onboarding</Button>
          </Flex>
        </Flex>
      </Section>
    );
  }

  return (
    <Flex direction={{ initial: "column" }} gap="4" className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <Flex align="center" justify="between" className="flex-col sm:flex-row gap-2 sm:gap-0 w-full">
        <Heading size={{ initial: "6", sm: "8" }} className="text-center w-full sm:w-auto">{header_text}</Heading>
        <Link href="/hcp/context">
          <Button className="ml-0 sm:ml-auto w-full sm:w-auto" variant="outline">
            Edit my context &rarr;
          </Button>
        </Link>
      </Flex>
      <Text size={{ initial: "2", sm: "3" }}>
            Welcome to your Human Context Dashboard! This app empowers you to view, manage, and control the personal context you share with language models. Use the sidebar on the left to navigate:
            <ul className="list-disc pl-4 sm:pl-6 mt-2">
              <li><b>Home</b>: Your main dashboard (this page).</li>
              <li><b>My Context</b>: Review and update your memories and preferences.</li>
              <li><b>Connect MCP</b>: Link your context to the Model Context Protocol for smarter AI experiences.</li>
              <li><b>Integrations</b>: (Coming soon) Connect with other services.</li>
              <li><b>Settings</b>: Set rules and control how your context is shared with language models.</li>
            </ul>
            <br />
            Visit <b>Settings</b> to define control rules, manage privacy, and decide exactly what information is shared and how it is used by AI systems.
          </Text>
        <Card className="p-2 sm:p-4 mx-auto w-full">
          <Flex gap="8" justify="center" className="flex-col sm:flex-row items-center">
            <Flex direction="column" gap="1" align="center">
              <Text size={{ initial: "2", sm: "3" }}>Memories</Text>
              <Badge className="text-base sm:text-lg px-4 py-2 bg-fuchsia-500/90 text-white shadow-md">{memoriesCount}</Badge>
            </Flex>
            <Flex direction="column" gap="1" align="center">
              <Text size={{ initial: "2", sm: "3" }}>Preferences</Text>
              <Badge className="text-base sm:text-lg px-4 py-2 bg-yellow-400/90 text-fuchsia-900 shadow-md">{preferencesCount}</Badge>
            </Flex>
          </Flex>
        </Card>
        <Separator className="my-4" />
        <Flex direction="column" gap="4">
          <Heading size={{ initial: "2", sm: "3" }} className="text-center">A fun fact you might like based on what we know about you</Heading>
          <Text size={{ initial: "2", sm: "3" }}>
            Elicitation is the latest proposed feature of the Model Context Protocol (MCP)! It lets the MCP server actively ask the chat session for specific information—like a server raising its hand in class. This turns the context-sharing flow into a two-way street, opening the door to smarter, more dynamic AI interactions.
          </Text>
        </Flex>
    </Flex>
  );
}

export default function Page() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      // Use a dynamic import to call withAuth on the client
      const mod = await import("@workos-inc/authkit-nextjs");
      const { user } = await mod.withAuth();
      setUserId(user?.id || null);
      setLoading(false);
    }
    getUser();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center mt-12">
        <Skeleton className="h-10 w-2/3 mb-2" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center mt-12">
        <p className="text-red-500">You must be signed in to view your context.</p>
      </div>
    );
  }

  return <ContextDashboard userId={userId} />;
} 