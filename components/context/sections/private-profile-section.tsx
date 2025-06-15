"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Lock } from "lucide-react";
import type { HumanContextData } from "@/lib/humanContext";

interface PrivateProfileSectionProps {
  userId: string;
  contextData: HumanContextData;
  updateContext: (data: HumanContextData) => Promise<HumanContextData>;
}

export function PrivateProfileSection({ userId, contextData, updateContext }: PrivateProfileSectionProps) {
  const [content, setContent] = useState(contextData.privateAbout || "");
  const [error, setError] = useState<string | null>(null);

  const handleContentChange = async (newContent: string) => {
    setContent(newContent);
    try {
      await updateContext({ ...contextData, privateAbout: newContent });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update private profile');
    }
  };

  if (!contextData) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">What would you like to keep private?</h2>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Private
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          This information is only visible to you and will never be shared.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="privateAbout">Private Profile</Label>
          <Textarea
            id="privateAbout"
            placeholder="Write something about yourself that you'd like to keep private..."
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="min-h-[200px]"
          />
          <div className="text-sm text-muted-foreground">
            {content.length} characters
          </div>
          {error && <div className="text-red-500">Error: {error}</div>}
        </div>
      </div>
    </div>
  );
} 