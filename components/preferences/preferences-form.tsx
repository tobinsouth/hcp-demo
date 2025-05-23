"use client";

import { useState, useEffect } from 'react';

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
      <h1 className="text-3xl font-bold mb-8">Preferences</h1>
      
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Location Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <input
                type="text"
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* General Preferences */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">General Preferences</h2>
          <div>
            <label htmlFor="generalPreferences" className="block text-sm font-medium text-gray-700">
              General Preferences
            </label>
            <textarea
              id="generalPreferences"
              value={formData.generalPreferences}
              onChange={(e) => setFormData({ ...formData, generalPreferences: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter your general preferences (e.g., language, timezone, theme, notification preferences)"
            />
          </div>
        </div>

        {/* Sensitive Preferences */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Sensitive Preferences</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="privacySettings" className="block text-sm font-medium text-gray-700">
                Privacy Settings
              </label>
              <select
                id="privacySettings"
                value={formData.privacySettings}
                onChange={(e) => setFormData({ ...formData, privacySettings: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select privacy level</option>
                <option value="strict">Strict</option>
                <option value="moderate">Moderate</option>
                <option value="relaxed">Relaxed</option>
              </select>
            </div>
            <div>
              <label htmlFor="dataSharing" className="block text-sm font-medium text-gray-700">
                Data Sharing
              </label>
              <select
                id="dataSharing"
                value={formData.dataSharing}
                onChange={(e) => setFormData({ ...formData, dataSharing: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select data sharing preference</option>
                <option value="none">No Sharing</option>
                <option value="anonymous">Anonymous Only</option>
                <option value="full">Full Sharing</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stored Credentials */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Stored Credentials</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="apiKeys" className="block text-sm font-medium text-gray-700">
                API Keys
              </label>
              <textarea
                id="apiKeys"
                value={formData.apiKeys}
                onChange={(e) => setFormData({ ...formData, apiKeys: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter API keys (one per line)"
              />
            </div>
            <div>
              <label htmlFor="tokens" className="block text-sm font-medium text-gray-700">
                Tokens
              </label>
              <textarea
                id="tokens"
                value={formData.tokens}
                onChange={(e) => setFormData({ ...formData, tokens: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter tokens (one per line)"
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
} 