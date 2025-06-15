"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Plus, Trash2 } from "lucide-react";
import { getHumanContextFromApi, updateHumanContextViaApi } from "@/lib/humanContext";
import type { HumanContextData } from "@/lib/humanContext";
import Link from "next/link";
import { Flex } from "@radix-ui/themes";

interface Preference {
  id: string;
  key: string;
  value: string;
}

interface PreferencesSectionProps {
  userId: string;
}

export function PreferencesSection({ userId }: PreferencesSectionProps) {
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPreferences() {
      try {
        const data: HumanContextData = await getHumanContextFromApi(userId);
        let preferencesData = data.privatePreferences || [];
        let formattedPreferences: Preference[];
        if (Array.isArray(preferencesData)) {
          formattedPreferences = preferencesData as Preference[];
        } else if (typeof preferencesData === 'object' && preferencesData !== null) {
          formattedPreferences = Object.entries(preferencesData).map(([key, value]) => ({
            id: crypto.randomUUID(),
            key,
            value: String(value),
          }));
        } else {
          formattedPreferences = [];
        }
        setPreferences(formattedPreferences);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch preferences');
      } finally {
        setIsLoading(false);
      }
    }
    fetchPreferences();
  }, [userId]);

  const addPreference = async () => {
    if (!newKey.trim() || !newValue.trim()) return;
    const newPreference = {
      id: crypto.randomUUID(),
      key: newKey,
      value: newValue,
    };
    try {
      setIsLoading(true);
      const context = await getHumanContextFromApi(userId);
      let currentPreferences: Preference[] = [];
      if (Array.isArray(context.privatePreferences)) {
        currentPreferences = context.privatePreferences as Preference[];
      } else if (typeof context.privatePreferences === 'object' && context.privatePreferences !== null) {
        currentPreferences = Object.entries(context.privatePreferences).map(([key, value]) => ({
          id: crypto.randomUUID(),
          key,
          value: String(value),
        }));
      }
      const updatedPreferences = [...currentPreferences, newPreference];
      await updateHumanContextViaApi(userId, { ...context, privatePreferences: updatedPreferences });
      setPreferences(updatedPreferences);
      setNewKey("");
      setNewValue("");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add preference');
    } finally {
      setIsLoading(false);
    }
  };

  const deletePreference = async (id: string) => {
    try {
      setIsLoading(true);
      const context = await getHumanContextFromApi(userId);
      let currentPreferences: Preference[] = [];
      if (Array.isArray(context.privatePreferences)) {
        currentPreferences = context.privatePreferences as Preference[];
      } else if (typeof context.privatePreferences === 'object' && context.privatePreferences !== null) {
        currentPreferences = Object.entries(context.privatePreferences).map(([key, value]) => ({
          id: crypto.randomUUID(),
          key,
          value: String(value),
        }));
      }
      const updatedPreferences = currentPreferences.filter((p: Preference) => p.id !== id);
      await updateHumanContextViaApi(userId, { ...context, privatePreferences: updatedPreferences });
      setPreferences(updatedPreferences);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete preference');
    } finally {
      setIsLoading(false);
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
          <h2 className="text-xl font-semibold">What are your preferences?</h2>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Private
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Add key-value pairs to store your preferences.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Preference key..."
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
            />
            <Input
              placeholder="Preference value..."
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </div>
          <Button onClick={addPreference}>
            <Plus className="h-4 w-4 mr-2" />
            Add Preference
          </Button>
        </div>
        <div className="space-y-4">
          {preferences.map((pref) => (
            <Card key={pref.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Key</Label>
                      <p className="text-sm">{pref.key}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Value</Label>
                      <p className="text-sm">{pref.value}</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deletePreference(pref.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
          {preferences.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">
              No preferences yet. Add your first preference above.
            </div>
          )}
        </div>
      </div>
      <Flex justify="end" className="mt-4">
        <Link href="/hcp/memories" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto my-auto" variant="outline">
            Edit my memories &rarr;
          </Button>
        </Link>
      </Flex>
    </div>
  );
} 