'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Bookmark, Eye, Calendar, User, Target, DollarSign } from 'lucide-react';

export interface PublishedBrief {
  id: string;
  briefId: string;
  title: string;
  description: string;
  brandName: string;
  projectName: string;
  targetAudience: string;
  primaryGoal: string;
  budgetRange: string;
  platforms: string;
  timeline: string;
  visualPreview?: string;
  publishedAt: string;
  publishedBy: string;
  status: 'active' | 'archived';
  saves: number;
  interested: number;
}

interface BriefCardProps {
  brief: PublishedBrief;
  onSave?: (briefId: string) => void;
  onInterested?: (briefId: string) => void;
}

export default function BriefCard({ brief, onSave, onInterested }: BriefCardProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCardClick = () => {
    router.push(`/marketplace/brief/${brief.id}`);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/marketplace/interact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          briefId: brief.id,
          action: 'save'
        }),
      });

      if (response.ok) {
        setIsSaved(!isSaved);
        onSave?.(brief.id);
      }
    } catch (error) {
      console.error('Error saving brief:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterested = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/marketplace/interact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          briefId: brief.id,
          action: 'interested'
        }),
      });

      if (response.ok) {
        setIsInterested(!isInterested);
        onInterested?.(brief.id);
      }
    } catch (error) {
      console.error('Error marking as interested:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (isoDate: string): string => {
    const then = new Date(isoDate).getTime();
    const now = Date.now();
    const diffSeconds = Math.max(0, Math.floor((now - then) / 1000));
    const minutes = Math.floor(diffSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days >= 7) return new Date(isoDate).toLocaleDateString();
    if (days >= 1) return `${days}d ago`;
    if (hours >= 1) return `${hours}h ago`;
    if (minutes >= 1) return `${minutes}m ago`;
    return `just now`;
  };

  return (
    <div 
      onClick={handleCardClick}
      className="shrink-0 w-[320px] bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl shadow-black/40 transition-all duration-300 ease-out hover:border-emerald-400 hover:ring-1 hover:ring-emerald-400/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] cursor-pointer group"
    >
      {/* Visual Preview */}
      <div className="h-48 w-full overflow-hidden relative">
        {brief.visualPreview ? (
          <img 
            src={brief.visualPreview} 
            alt={brief.title} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-emerald-900/20 to-blue-900/20 flex items-center justify-center">
            <div className="text-center">
              <Target className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-neutral-400 font-medium">{brief.brandName}</p>
            </div>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            brief.status === 'active' 
              ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/50' 
              : 'bg-neutral-800/80 text-neutral-400 border border-neutral-600/50'
          }`}>
            {brief.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <User className="w-3 h-3" />
            <span>{brief.publishedBy}</span>
            <span>•</span>
            <Calendar className="w-3 h-3" />
            <span>{formatTimeAgo(brief.publishedAt)}</span>
          </div>
          
          <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">
            {brief.title}
          </h3>
          
          <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
            {brief.description}
          </p>
        </div>

        {/* Key Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Target className="w-3 h-3" />
            <span className="line-clamp-1">{brief.targetAudience}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <DollarSign className="w-3 h-3" />
            <span>{brief.budgetRange}</span>
            <span>•</span>
            <span>{brief.timeline}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isSaved 
                ? 'bg-emerald-600 text-white' 
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white'
            }`}
            title="Save brief"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={handleInterested}
            disabled={isLoading}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1 ${
              isInterested 
                ? 'bg-emerald-600 text-white' 
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white'
            }`}
          >
            <Heart className={`w-3 h-3 ${isInterested ? 'fill-current' : ''}`} />
            Interested
          </button>
        </div>
      </div>
    </div>
  );
}
