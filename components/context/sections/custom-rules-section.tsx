"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Lock, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CustomRulesSectionProps {
  userId: string;
}

export function CustomRulesSection({ userId }: CustomRulesSectionProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch(`/api/context/${userId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch custom rules: ${response.statusText}`);
        }
        const data = await response.json();
        setContent(data.customRules || "");
        setError(null);
      } catch (err) {
        console.error('Error fetching custom rules:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch custom rules');
      } finally {
        setIsLoading(false);
      }
    }

    fetchContent();
  }, [userId]);

  const handleContentChange = async (newContent: string) => {
    try {
      const response = await fetch(`/api/context/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customRules: newContent,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update custom rules: ${response.statusText}`);
      }

      setContent(newContent);
      setError(null);
    } catch (err) {
      console.error('Error updating custom rules:', err);
      setError(err instanceof Error ? err.message : 'Failed to update custom rules');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">How would you like the system to handle your preferences?</h2>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Private
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Define custom rules to guide how the system should handle your preferences and context.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="customRules">Custom Rules</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Write rules in natural language to guide how the system should handle your preferences.
                    For example: "Always prioritize my work schedule over social events" or
                    "Keep my dietary preferences private unless explicitly shared".
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Textarea
            id="customRules"
            placeholder="Write your custom rules here..."
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="min-h-[200px]"
          />
          
          <div className="text-sm text-muted-foreground">
            {content.length} characters
          </div>
        </div>
      </div>
    </div>
  );
} 