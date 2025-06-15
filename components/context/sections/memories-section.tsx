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

interface Memory {
  id: string;
  content: string;
  date: string;
}

interface MemoriesSectionProps {
  userId: string;
}

export function MemoriesSection({ userId }: MemoriesSectionProps) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [newMemory, setNewMemory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMemories() {
      try {
        const data: HumanContextData = await getHumanContextFromApi(userId);
        let memoriesData = data.privateMemories;
        let formattedMemories: Memory[];
        if (Array.isArray(memoriesData)) {
          formattedMemories = memoriesData as Memory[];
        } else {
          formattedMemories = [];
        }
        setMemories(formattedMemories);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch memories');
      } finally {
        setIsLoading(false);
      }
    }
    fetchMemories();
  }, [userId]);

  const addMemory = async () => {
    if (!newMemory.trim()) return;
    const newMemoryObj: Memory = {
      id: crypto.randomUUID(),
      content: newMemory,
      date: new Date().toISOString(),
    };
    try {
      setIsLoading(true);
      const context = await getHumanContextFromApi(userId);
      let memoriesData = context.privateMemories;
      let currentMemories: Memory[];
      if (Array.isArray(memoriesData)) {
        currentMemories = memoriesData as Memory[];
      } else {
        currentMemories = [];
      }
      const updatedMemories = [...currentMemories, newMemoryObj];
      await updateHumanContextViaApi(userId, { ...context, privateMemories: updatedMemories });
      setMemories(updatedMemories);
      setNewMemory("");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add memory');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMemory = async (id: string) => {
    try {
      setIsLoading(true);
      const context = await getHumanContextFromApi(userId);
      let memoriesData = context.privateMemories;
      let currentMemories: Memory[];
      if (Array.isArray(memoriesData)) {
        currentMemories = memoriesData as Memory[];
      } else {
        currentMemories = [];
      }
      const updatedMemories = currentMemories.filter((m: Memory) => m.id !== id);
      await updateHumanContextViaApi(userId, { ...context, privateMemories: updatedMemories });
      setMemories(updatedMemories);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete memory');
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
          <h2 className="text-xl font-semibold">What moments would you like to remember?</h2>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Private
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Add personal memories that you'd like to keep track of.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="flex gap-2">
          <Input
            placeholder="Add a new memory..."
            value={newMemory}
            onChange={(e) => setNewMemory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMemory()}
          />
          <Button onClick={addMemory}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {memories.map((memory) => (
            <Card key={memory.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm">{memory.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(memory.date).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMemory(memory.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
          {memories.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">
              No memories yet. Add your first memory above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 