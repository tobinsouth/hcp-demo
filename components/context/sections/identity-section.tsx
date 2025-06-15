"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { HumanContextData } from "@/lib/humanContext";
import { useState } from "react";

interface IdentitySectionProps {
  userId: string;
  contextData: HumanContextData;
  updateContext: (data: HumanContextData) => Promise<HumanContextData>;
}

export function IdentitySection({ userId, contextData, updateContext }: IdentitySectionProps) {
  const [localContext, setLocalContext] = useState(contextData);

  const handleLocationChange = async (field: 'country' | 'city', value: string) => {
    const updatedData = {
      ...localContext,
      [field]: value,
    };
    try {
      await updateContext(updatedData);
      setLocalContext(updatedData);
    } catch (error) {
      console.error('Error updating context:', error);
    }
  };

  if (!localContext) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Tell us about yourself</h2>
        <p className="text-sm text-muted-foreground">
          Your basic identity information. Some fields are synced with your authentication profile.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <div className="flex gap-2">
            <Input
              id="firstName"
              value={localContext.firstName ?? ""}
              readOnly
              className="bg-muted"
            />
            <Badge variant="secondary">Synced</Badge>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <div className="flex gap-2">
            <Input
              id="lastName"
              value={localContext.lastName ?? ""}
              readOnly
              className="bg-muted"
            />
            <Badge variant="secondary">Synced</Badge>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <div className="flex gap-2">
            <Input
              id="email"
              value={localContext.email ?? ""}
              readOnly
              className="bg-muted"
            />
            <Badge variant="secondary">Synced</Badge>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            placeholder="Enter your country"
            value={localContext.country ?? ""}
            onChange={(e) => handleLocationChange('country', e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="Enter your city"
            value={localContext.city ?? ""}
            onChange={(e) => handleLocationChange('city', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
} 