"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { HumanContextData } from "@/lib/humanContext";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialData: HumanContextData;
}

export function OnboardingModal({ isOpen, onClose, userId, initialData }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<HumanContextData>(initialData);

  const handleInputChange = (field: keyof HumanContextData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIdentityChange = (field: keyof HumanContextData['identity'], value: string) => {
    setFormData(prev => ({
      ...prev,
      identity: {
        ...prev.identity,
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/context/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update context');
      }

      onClose();
    } catch (error) {
      console.error('Error updating context:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Location Information</h3>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.identity.country || ''}
                onChange={(e) => handleIdentityChange('country', e.target.value)}
                placeholder="Enter your country"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.identity.city || ''}
                onChange={(e) => handleIdentityChange('city', e.target.value)}
                placeholder="Enter your city"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Public Profile</h3>
            <div className="space-y-2">
              <Label htmlFor="publicAbout">What would you like others to know about you?</Label>
              <Textarea
                id="publicAbout"
                value={formData.publicAbout || ''}
                onChange={(e) => handleInputChange('publicAbout', e.target.value)}
                placeholder="Share some information about yourself..."
                rows={4}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Private Profile</h3>
            <div className="space-y-2">
              <Label htmlFor="privateAbout">What would you like to keep private?</Label>
              <Textarea
                id="privateAbout"
                value={formData.privateAbout || ''}
                onChange={(e) => handleInputChange('privateAbout', e.target.value)}
                placeholder="Share some private information about yourself..."
                rows={4}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome! Let's set up your profile</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {renderStep()}
        </div>
        <div className="flex justify-between">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Previous
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              Complete Setup
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 