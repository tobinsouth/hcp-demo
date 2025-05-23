"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem } from "@/components/ui/select";

interface FormData {
  // Basic Info
  name: string;
  
  // Location Information
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  
  // General Preferences (single string)
  generalPreferences: string;
  
  // Sensitive Preferences
  privacySettings: string;
  dataSharing: string;
  
  // Stored Credentials
  apiKeys: string;
  tokens: string;
}

export function PreferencesForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    generalPreferences: '',
    privacySettings: '',
    dataSharing: '',
    apiKeys: '',
    tokens: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please sign in to save preferences');
        }
        throw new Error('Failed to save preferences');
      }

      const data = await response.json();
      setFormData(data);
      setSuccessMessage('Preferences saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch('/api/preferences');
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Please sign in to view preferences');
          }
          throw new Error('Failed to fetch preferences');
        }

        const data = await response.json();
        setFormData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch preferences');
      }
    };

    fetchPreferences();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">Preferences</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
            />
          </div>
        </Card>

        {/* Location Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Location Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                type="text"
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                type="text"
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="State"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                type="text"
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Country"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                type="text"
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="ZIP Code"
              />
            </div>
          </div>
        </Card>

        {/* General Preferences */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">General Preferences</h2>
          <div className="space-y-2">
            <Label htmlFor="generalPreferences">General Preferences</Label>
            <Textarea
              id="generalPreferences"
              value={formData.generalPreferences}
              onChange={(e) => setFormData({ ...formData, generalPreferences: e.target.value })}
              rows={4}
              placeholder="Enter your general preferences (e.g., language, timezone, theme, notification preferences)"
            />
          </div>
        </Card>

        {/* Sensitive Preferences */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Sensitive Preferences</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="privacySettings">Privacy Settings</Label>
              <Select
                value={formData.privacySettings}
                onValueChange={(value) => setFormData({ ...formData, privacySettings: value })}
                placeholder="Select privacy level"
              >
                <SelectItem value="strict">Strict</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="relaxed">Relaxed</SelectItem>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataSharing">Data Sharing</Label>
              <Select
                value={formData.dataSharing}
                onValueChange={(value) => setFormData({ ...formData, dataSharing: value })}
                placeholder="Select data sharing preference"
              >
                <SelectItem value="none">No Sharing</SelectItem>
                <SelectItem value="anonymous">Anonymous Only</SelectItem>
                <SelectItem value="full">Full Sharing</SelectItem>
              </Select>
            </div>
          </div>
        </Card>

        {/* Stored Credentials */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Stored Credentials</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKeys">API Keys</Label>
              <Textarea
                id="apiKeys"
                value={formData.apiKeys}
                onChange={(e) => setFormData({ ...formData, apiKeys: e.target.value })}
                rows={3}
                placeholder="Enter API keys (one per line)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tokens">Tokens</Label>
              <Textarea
                id="tokens"
                value={formData.tokens}
                onChange={(e) => setFormData({ ...formData, tokens: e.target.value })}
                rows={3}
                placeholder="Enter tokens (one per line)"
              />
            </div>
          </div>
        </Card>

        <Button
          type="submit"
          disabled={isSaving}
          className="w-full text-lg font-semibold mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </form>
    </div>
  );
} 