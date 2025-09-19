"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";

interface BriefSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (metadata: { title: string; description: string; author: string; status: string }) => Promise<void>;
  isLoading?: boolean;
}

export default function BriefSaveModal({ isOpen, onClose, onSave, isLoading = false }: BriefSaveModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("Draft");

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !author.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        author: author.trim(),
        status
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setAuthor("");
      setStatus("Draft");
    } catch (error) {
      console.error("Error saving brief:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-700">
          <h2 className="text-xl font-semibold text-white">Save Brief</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter brief title"
              className="bg-neutral-800 border-neutral-600 text-white"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Description *
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              className="bg-neutral-800 border-neutral-600 text-white"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Author *
            </label>
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
              className="bg-neutral-800 border-neutral-600 text-white"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Status
            </label>
            <Select value={status} onValueChange={setStatus} disabled={isLoading}>
              <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-700">
                <SelectItem value="Draft" className="hover:bg-neutral-800">Draft</SelectItem>
                <SelectItem value="In Review" className="hover:bg-neutral-800">In Review</SelectItem>
                <SelectItem value="Approved" className="hover:bg-neutral-800">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-700">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="gap-2 bg-blue-800 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Save Brief
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
