"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";

interface Preference {
  id: string;
  label: string;
  description: string;
  value: string;
  type: "text" | "textarea" | "sensitive";
}

const initialPreferences: Preference[] = [
  {
    id: "name",
    label: "Display Name",
    description: "How you'd like to be addressed by AI assistants",
    value: "John Doe",
    type: "text"
  },
  {
    id: "language",
    label: "Preferred Language",
    description: "Your preferred language for AI interactions",
    value: "English",
    type: "text"
  },
  {
    id: "tone",
    label: "Communication Style",
    description: "How formal or casual you prefer AI responses",
    value: "Professional but friendly",
    type: "text"
  },
  {
    id: "interests",
    label: "Areas of Interest",
    description: "Topics you're most interested in discussing",
    value: "Technology, Science, Philosophy",
    type: "textarea"
  },
  {
    id: "api_key",
    label: "API Key",
    description: "Your personal API key for integrations",
    value: "sk-••••••••••••••••••••••••",
    type: "sensitive"
  }
];

export function PreferencesForm() {
  const [preferences, setPreferences] = useState<Preference[]>(initialPreferences);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (id: string, value: string) => {
    setPreferences(prev => 
      prev.map(pref => 
        pref.id === id ? { ...pref, value } : pref
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement save functionality
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert("Preferences saved!");
    } catch (error) {
      alert("Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Your Preferences</h1>
        <p className="text-gray-500 mb-8">
          Customize how AI assistants interact with you across different platforms
        </p>

        <div className="grid gap-6">
          {preferences.map((pref) => (
            <Card key={pref.id} className="p-6">
              <div className="space-y-2">
                <Label htmlFor={pref.id} className="text-lg font-semibold">
                  {pref.label}
                </Label>
                <p className="text-sm text-gray-500">{pref.description}</p>
                {pref.type === "textarea" ? (
                  <textarea
                    id={pref.id}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    value={pref.value}
                    onChange={(e) => handleChange(pref.id, e.target.value)}
                  />
                ) : (
                  <Input
                    id={pref.id}
                    type={pref.type === "sensitive" ? "password" : "text"}
                    className={pref.type === "sensitive" ? "text-red-500" : ""}
                    value={pref.value}
                    onChange={(e) => handleChange(pref.id, e.target.value)}
                  />
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            className={`bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </div>
  );
} 