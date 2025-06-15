"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Plus, Trash2, Eye, EyeOff } from "lucide-react";

interface SecureInfo {
  id: string;
  key: string;
  value: string;
  isVisible: boolean;
}

interface SecureInfoSectionProps {
  userId: string;
}

export function SecureInfoSection({ userId }: SecureInfoSectionProps) {
  const [secureInfo, setSecureInfo] = useState<SecureInfo[]>([]);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSecureInfo() {
      try {
        const response = await fetch(`/api/context/${userId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch secure info: ${response.statusText}`);
        }
        const data = await response.json();
        // Ensure we have an array of secure info
        const secureInfoData = data.secureInfo || [];
        const formattedSecureInfo = Array.isArray(secureInfoData)
          ? secureInfoData
          : Object.entries(secureInfoData).map(([key, value]) => ({
              id: crypto.randomUUID(),
              key,
              value: String(value),
              isVisible: false,
            }));
        setSecureInfo(formattedSecureInfo);
        setError(null);
      } catch (err) {
        console.error('Error fetching secure info:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch secure info');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSecureInfo();
  }, [userId]);

  const addSecureInfo = async () => {
    if (!newKey.trim() || !newValue.trim()) return;
    
    const newInfo = {
      id: crypto.randomUUID(),
      key: newKey,
      value: newValue,
      isVisible: false,
    };

    try {
      const response = await fetch(`/api/context/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secureInfo: [...secureInfo, newInfo],
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add secure info: ${response.statusText}`);
      }

      setSecureInfo([...secureInfo, newInfo]);
      setNewKey("");
      setNewValue("");
      setError(null);
    } catch (err) {
      console.error('Error adding secure info:', err);
      setError(err instanceof Error ? err.message : 'Failed to add secure info');
    }
  };

  const deleteSecureInfo = async (id: string) => {
    try {
      const updatedInfo = secureInfo.filter(s => s.id !== id);
      const response = await fetch(`/api/context/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secureInfo: updatedInfo,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete secure info: ${response.statusText}`);
      }

      setSecureInfo(updatedInfo);
      setError(null);
    } catch (err) {
      console.error('Error deleting secure info:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete secure info');
    }
  };

  const toggleVisibility = (id: string) => {
    setSecureInfo(secureInfo.map(s => 
      s.id === id ? { ...s, isVisible: !s.isVisible } : s
    ));
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
          <h2 className="text-xl font-semibold">What sensitive information would you like to store securely?</h2>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Encrypted
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Add sensitive information that will be encrypted and only visible to you.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Secure info key..."
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
            />
            <Input
              placeholder="Secure info value..."
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              type="password"
            />
          </div>
          <Button onClick={addSecureInfo}>
            <Plus className="h-4 w-4 mr-2" />
            Add Secure Info
          </Button>
        </div>

        <div className="space-y-4">
          {secureInfo.map((info) => (
            <Card key={info.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Key</Label>
                      <p className="text-sm">{info.key}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Value</Label>
                      <div className="flex items-center gap-2">
                        <p className="text-sm">
                          {info.isVisible ? info.value : "••••••••"}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleVisibility(info.id)}
                        >
                          {info.isVisible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteSecureInfo(info.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}

          {secureInfo.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">
              No secure information yet. Add your first secure info above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 