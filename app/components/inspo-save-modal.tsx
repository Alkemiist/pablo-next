'use client'

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, X, Tag } from "lucide-react";
import { CreateInspoCardRequest } from "@/lib/types/inspo-card";
import { Tactic } from "@/lib/types/tactics";

interface InspoSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (request: CreateInspoCardRequest) => Promise<void>;
  context: {
    brand: string;
    product: string;
    persona: string;
    goal: string;
    visualGuide: string;
  };
  tactics: Tactic[];
  generatedContent: {
    [tacticId: string]: {
      audienceJourney?: any;
      socialPost?: any;
      captionPack?: any;
      blogOutline?: any;
      emailCampaign?: any;
      influencerBrief?: any;
      evergreenPlan?: any;
      script?: any;
      agentChat?: any;
    };
  };
  visualAssets?: {
    uploadedImage?: string;
    generatedImages?: string[];
  };
  isIndividualTactic?: boolean;
}

export default function InspoSaveModal({
  isOpen,
  onClose,
  onSave,
  context,
  tactics,
  generatedContent,
  visualAssets,
  isIndividualTactic = false
}: InspoSaveModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Don't render anything until mounted
  if (!mounted || !isOpen) return null;

  // Generate default title and description
  const generateDefaults = () => {
    if (!title) {
      if (isIndividualTactic && tactics.length === 1) {
        const tactic = tactics[0];
        setTitle(`${tactic.title} - ${context.brand}`);
      } else {
        setTitle(`${context.brand} - ${context.product} Campaign`);
      }
    }
    if (!description) {
      if (isIndividualTactic && tactics.length === 1) {
        const tactic = tactics[0];
        setDescription(`${tactic.title}: ${tactic.oneLinerSummary} - A ${tactic.platform} strategy for ${context.brand} targeting ${context.persona}. ${tactic.coreMessage}`);
      } else {
        setDescription(`Creative inspiration for ${context.brand} targeting ${context.persona} with ${tactics.length} tactics generated.`);
      }
    }
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle save
  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const request: CreateInspoCardRequest = {
        title: title.trim(),
        description: description.trim(),
        context,
        tactics,
        generatedContent,
        visualAssets,
        tags
      };

      await onSave(request);
      
      // Reset form
      setTitle('');
      setDescription('');
      setTags([]);
      setNewTag('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save inspo card');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle key press for adding tags
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Save className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Save Inspo Card</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white font-medium">
              Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your inspo card"
              className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-400"
              onFocus={generateDefaults}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white font-medium">
              Description *
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this inspo card contains"
              rows={3}
              className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-400"
              onFocus={generateDefaults}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-white font-medium">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-900/30 text-blue-300 text-sm rounded-md border border-blue-700/50"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-blue-300 hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-400"
                onKeyPress={handleKeyPress}
              />
              <Button
                onClick={addTag}
                disabled={!newTag.trim()}
                className="bg-blue-800 hover:bg-blue-700"
              >
                <Tag className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Context Preview */}
          <div className="space-y-2">
            <Label className="text-white font-medium">Context Preview</Label>
            <div className="bg-neutral-800 rounded-lg p-4 space-y-2 text-sm">
              <div><span className="text-neutral-400">Brand:</span> <span className="text-white">{context.brand}</span></div>
              <div><span className="text-neutral-400">Product:</span> <span className="text-white">{context.product}</span></div>
              <div><span className="text-neutral-400">Persona:</span> <span className="text-white">{context.persona}</span></div>
              {isIndividualTactic && tactics.length === 1 ? (
                <>
                  <div><span className="text-neutral-400">Tactic:</span> <span className="text-white">{tactics[0].title}</span></div>
                  <div><span className="text-neutral-400">Platform:</span> <span className="text-white">{tactics[0].platform}</span></div>
                </>
              ) : (
                <div><span className="text-neutral-400">Tactics:</span> <span className="text-white">{tactics.length} generated</span></div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-700">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-neutral-600 text-neutral-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !title.trim() || !description.trim()}
              className="bg-blue-800 hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Card
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
