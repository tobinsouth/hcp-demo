"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import type { HumanContextData } from "@/lib/humanContext";

interface PublicProfileSectionProps {
  userId: string;
  contextData: HumanContextData;
  updateContext: (data: HumanContextData) => Promise<HumanContextData>;
}

export function PublicProfileSection({ userId, contextData, updateContext }: PublicProfileSectionProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [content, setContent] = useState(contextData.publicAbout || "");
  const [error, setError] = useState<string | null>(null);

  const handleContentChange = async (newContent: string) => {
    setContent(newContent);
    try {
      await updateContext({ ...contextData, publicAbout: newContent });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update public profile');
    }
  };

  if (!contextData) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">What would you like others to know about you?</h2>
          <Badge variant="secondary">Public</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          This information will be visible to anyone who views your profile.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="publicAbout">Public Profile</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
            >
              {isPreview ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </>
              )}
            </Button>
          </div>
          {isPreview ? (
            <Card className="p-4">
              <div className="prose prose-sm max-w-none">
                {content || "No content yet. Click 'Edit' to add your public profile."}
              </div>
            </Card>
          ) : (
            <Textarea
              id="publicAbout"
              placeholder="Write something about yourself that you'd like others to know..."
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="min-h-[200px]"
            />
          )}
          <div className="text-sm text-muted-foreground">
            {content.length} characters
          </div>
          {error && <div className="text-red-500">Error: {error}</div>}
        </div>
      </div>
    </div>
  );
} 