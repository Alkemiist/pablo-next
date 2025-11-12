'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import SeedForm from './seed-form';
import { SeedInput } from '@/lib/seed-ideas-types';

interface CreateSeedModalProps {
  onClose: () => void;
}

export default function CreateSeedModal({ onClose }: CreateSeedModalProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<SeedInput | null>(null);

  const handleBack = () => {
    setShowForm(false);
    setEditingData(null);
  };

  const handleFormComplete = () => {
    onClose();
  };

  if (showForm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-neutral-950 border border-neutral-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <SeedForm 
            onComplete={handleFormComplete}
            onBack={handleBack}
            initialData={editingData || undefined}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-950 border border-neutral-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Create Seed Idea</h2>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-neutral-400 hover:text-white"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <p className="text-neutral-400 mb-6">
              Seed ideas capture the transferable essence of successful campaigns. By documenting the core mechanisms, psychological drivers, and cultural tensions that made an idea powerful, you create reusable creative DNA that can inspire new contexts.
            </p>

            <div className="p-6 bg-neutral-900 border border-neutral-700 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">What you'll document:</h3>
              <ul className="space-y-2 text-sm text-neutral-400 list-disc list-inside">
                <li>Original campaign context and intent</li>
                <li>Core creative mechanism</li>
                <li>Psychological and emotional triggers</li>
                <li>Cultural tensions and resolutions</li>
                <li>Archetype alignment</li>
                <li>Transferable essence</li>
                <li>Context dependencies and risks</li>
                <li>Format-agnostic expression</li>
              </ul>
            </div>

            <Button
              onClick={() => setShowForm(true)}
              className="w-full bg-green-800 hover:bg-green-700 mt-6"
            >
              Start Creating Seed Idea
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

