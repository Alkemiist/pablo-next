'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Edit, Trash2, Save } from 'lucide-react';
import { Seed } from '@/lib/seed-ideas-types';
import { deleteSeed } from '@/lib/seed-ideas-storage';
import SeedForm from './seed-form';

interface SeedDetailModalProps {
  seed: Seed;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function SeedDetailModal({ 
  seed, 
  onClose, 
  onEdit, 
  onDelete 
}: SeedDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<any>(null);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditComplete = () => {
    setIsEditing(false);
    onEdit();
  };

  const handleSave = () => {
    console.log('Save button clicked!');
    console.log('Form ref:', formRef.current);
    if (formRef.current && formRef.current.handleSave) {
      console.log('Calling form handleSave');
      formRef.current.handleSave();
    } else {
      console.error('Form ref or handleSave not available');
    }
  };

  const handleSaveComplete = () => {
    setIsEditing(false);
    onEdit();
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this seed idea? This action cannot be undone.')) {
      try {
        // Delete from localStorage
        deleteSeed(seed.id);
        
        // Delete from file storage
        const response = await fetch(`/api/seed-ideas/files?id=${seed.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          onDelete();
        } else {
          console.error('Failed to delete seed from file storage');
          alert('Failed to delete seed. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting seed:', error);
        alert('Failed to delete seed. Please try again.');
      }
    }
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <SeedForm 
          ref={formRef}
          onComplete={handleEditComplete}
          onBack={() => setIsEditing(false)}
          initialData={seed}
          editingId={seed.id}
          onSaveComplete={handleSaveComplete}
        />
      );
    }

    // View mode
    return (
      <div className="p-8">
        {/* Content */}
        <div className="space-y-6">
            <div className="pb-6 border-b border-neutral-800/50">
              <h3 className="text-lg font-semibold text-white mb-2">DNA Summary</h3>
              <p className="text-neutral-400">{seed.dnaSummary}</p>
            </div>

            <div className="pb-6 border-b border-neutral-800/50">
              <h3 className="text-lg font-semibold text-white mb-2">Original Campaign</h3>
              <p className="text-sm text-neutral-500 mb-2 italic">Anchors the seed in its creative and cultural origin</p>
              <p className="text-neutral-400">{seed.originalCampaign}</p>
            </div>

            <div className="pb-6 border-b border-neutral-800/50">
              <h3 className="text-lg font-semibold text-white mb-2">Core Mechanism</h3>
              <p className="text-sm text-neutral-500 mb-2 italic">The "physics" of the idea — the underlying creative engine</p>
              <p className="text-neutral-400">{seed.coreMechanism}</p>
            </div>

            <div className="pb-6 border-b border-neutral-800/50">
              <h3 className="text-lg font-semibold text-white mb-2">Psychological Drivers</h3>
              <p className="text-sm text-neutral-500 mb-2 italic">Emotional or cognitive triggers activated in the audience</p>
              <p className="text-neutral-400">{seed.psychologicalDrivers}</p>
            </div>

            <div className="pb-6 border-b border-neutral-800/50">
              <h3 className="text-lg font-semibold text-white mb-2">Cultural Tension</h3>
              <p className="text-sm text-neutral-500 mb-2 italic">Social, cultural, or emotional tension and its resolution</p>
              <p className="text-neutral-400">{seed.culturalTension}</p>
            </div>

            <div className="pb-6 border-b border-neutral-800/50">
              <h3 className="text-lg font-semibold text-white mb-2">Archetype Alignment</h3>
              <p className="text-sm text-neutral-500 mb-2 italic">Which archetype(s) the idea embodies and how</p>
              <p className="text-neutral-400">{seed.archetypeAlignment}</p>
            </div>

            <div className="pb-6 border-b border-neutral-800/50">
              <h3 className="text-lg font-semibold text-white mb-2">Transferable Essence</h3>
              <p className="text-sm text-neutral-500 mb-2 italic">The most portable principle that can inspire new contexts</p>
              <p className="text-neutral-400">{seed.transferableEssence}</p>
            </div>

            <div className="pb-6 border-b border-neutral-800/50">
              <h3 className="text-lg font-semibold text-white mb-2">Context Dependencies</h3>
              <p className="text-sm text-neutral-500 mb-2 italic">Dependencies or constraints that made the idea work</p>
              <p className="text-neutral-400">{seed.contextDependencies}</p>
            </div>

            <div className="pb-6 border-b border-neutral-800/50">
              <h3 className="text-lg font-semibold text-white mb-2">Risks and Trade-offs</h3>
              <p className="text-sm text-neutral-500 mb-2 italic">Specific risks taken and what was gained in return</p>
              <p className="text-neutral-400">{seed.risksAndTradeoffs}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Format Agnosticism</h3>
              <p className="text-sm text-neutral-500 mb-2 italic">How the mechanism can express across different formats</p>
              <p className="text-neutral-400">{seed.formatAgnosticism}</p>
            </div>
          </div>
        </div>
      );
    };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-950 border border-neutral-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Sticky Top Bar */}
        <div className="sticky top-0 z-10 bg-neutral-900/50 backdrop-blur-sm border-b border-neutral-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {seed.name}
            </h2>
            <p className="text-sm text-neutral-400 capitalize">seed</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 border-neutral-600/70 text-neutral-300 hover:text-white hover:bg-neutral-700 hover:border-neutral-500/70 cursor-pointer"
                >
                  <Save className="size-4" />
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 border-neutral-600/70 text-neutral-400 hover:text-white hover:bg-neutral-700 hover:border-neutral-500/70 cursor-pointer"
                >
                  <X className="size-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 border-neutral-600/70 text-neutral-300 hover:text-white hover:bg-neutral-700 hover:border-neutral-500/70 cursor-pointer"
                >
                  <Edit className="size-4" />
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 border-neutral-600/70 text-neutral-400 hover:text-red-300 hover:bg-red-900/20 hover:border-red-500/70 cursor-pointer"
                >
                  <Trash2 className="size-4" />
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 border-neutral-600/70 text-neutral-400 hover:text-white hover:bg-neutral-700 hover:border-neutral-500/70 cursor-pointer"
                >
                  <X className="size-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

