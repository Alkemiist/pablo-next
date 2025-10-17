'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart, Bookmark, Share2, Calendar, User, Target, DollarSign, Clock, Users, TrendingUp, Eye, MessageCircle, Building, Package, ChevronDown, ArrowRight, Zap, CheckCircle, Globe, BarChart3, PieChart, Activity, Lightbulb, Award } from 'lucide-react';
import { PublishedBrief } from '@/app/components/marketplace/brief-card';

export default function BriefPDP() {
  const router = useRouter();
  const params = useParams();
  const briefId = params.id as string;
  
  const [brief, setBrief] = useState<PublishedBrief | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Load brief data
  useEffect(() => {
    const loadBrief = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/marketplace/publish');
        if (response.ok) {
          const data = await response.json();
          const foundBrief = data.publishedBriefs.find((b: PublishedBrief) => b.id === briefId);
          if (foundBrief) {
            setBrief(foundBrief);
          } else {
            setError('Brief not found');
          }
        } else {
          setError('Failed to load brief');
        }
      } catch (err) {
        console.error('Error loading brief:', err);
        setError('Failed to load brief');
      } finally {
        setIsLoading(false);
      }
    };

    if (briefId) {
      loadBrief();
    }
  }, [briefId]);

  const handleBack = () => {
    router.push('/marketplace');
  };

  const handleSave = async () => {
    if (!brief || isLoadingAction) return;
    
    setIsLoadingAction(true);
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
      }
    } catch (error) {
      console.error('Error saving brief:', error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleInterested = async () => {
    if (!brief || isLoadingAction) return;
    
    setIsLoadingAction(true);
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
      }
    } catch (error) {
      console.error('Error marking as interested:', error);
    } finally {
      setIsLoadingAction(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading brief...</p>
        </div>
      </div>
    );
  }

  if (error || !brief) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Brief Not Found</h2>
          <p className="text-neutral-400 mb-6">{error || 'The requested brief could not be found.'}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">

      {/* Header */}
      <div className="border-b bg-neutral-950/80 backdrop-blur-xl border-neutral-800 sticky top-0 z-50 shadow-2xl shadow-black/40">
        <div className="mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/marketplace"
                className="p-2 rounded-lg border border-neutral-800 hover:border-neutral-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-400/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">{brief.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSave}
                disabled={isLoadingAction}
                className={`p-2 rounded-lg border border-neutral-800 hover:border-neutral-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-400/20 ${
                  isSaved ? 'bg-emerald-600/20 border-emerald-600/50' : ''
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current text-emerald-400' : ''}`} />
              </button>
              <button className="p-2 rounded-lg border border-neutral-800 hover:border-neutral-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-400/20">
                <Share2 className="h-4 w-4" />
              </button>
              <button 
                onClick={handleInterested}
                disabled={isLoadingAction}
                className={`px-8 cursor-pointer text-white font-semibold text-sm py-2 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:scale-105 ${
                  isInterested 
                    ? 'bg-emerald-600' 
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500'
                }`}
              >
                <Heart className={`h-4 w-4 ${isInterested ? 'fill-current' : ''}`} />
                {isInterested ? 'Interested!' : 'Express Interest'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="relative h-full w-full">
          {brief.visualPreview ? (
            <img 
              src={brief.visualPreview} 
              alt={brief.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-900/30 via-blue-900/20 to-purple-900/30 flex items-center justify-center">
              <div className="text-center">
                <Target className="w-24 h-24 text-emerald-400 mx-auto mb-4" />
                <p className="text-2xl font-bold text-white mb-2">{brief.brandName}</p>
                <p className="text-neutral-400">Marketing Brief</p>
              </div>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent"></div>
          
          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 bg-neutral-500/20 border border-neutral-500/30 rounded-full">
                  <span className="text-neutral-400 text-sm font-medium">{brief.brandName}</span>
                </div>
                <div className="px-3 py-1 bg-neutral-500/20 border border-neutral-500/30 rounded-full">
                  <span className="text-neutral-400 text-sm font-medium">{brief.projectName}</span>
                </div>
                <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                  <span className="text-emerald-400 text-sm font-medium">{brief.status}</span>
                </div>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-neutral-100 to-white bg-clip-text text-transparent">
                  {brief.title}
                </span>
              </h1>
              <p className="text-xl text-neutral-400 mb-8 leading-relaxed max-w-2xl">
                {brief.description}
              </p>
            </div>
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {/* Brief Overview Section */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
              Brief Overview
            </h2>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {/* Main Brief Details Container */}
            <div className="relative rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm p-8 lg:p-12 mb-8">
              <div className="absolute top-6 right-6 w-3 h-3 bg-neutral-400 rounded-full animate-pulse"></div>
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Strategic Goal:</h3>
                <p className="text-lg text-neutral-400 leading-relaxed">{brief.primaryGoal}</p>
              </div>
            </div>

            {/* Target Audience and Strategy - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Target Audience */}
              <div className="relative rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Target Audience:</h3>
                <p className="text-neutral-400 leading-relaxed">
                  {brief.targetAudience} - This audience represents a key segment that aligns perfectly with our brand values and market positioning.
                </p>
              </div>

              {/* Strategy Approach */}
              <div className="relative rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Strategic Approach:</h3>
                <p className="text-neutral-400 leading-relaxed">
                  Multi-channel campaign leveraging {brief.platforms} to achieve maximum impact within {brief.timeline}.
                </p>
              </div>
            </div>

            {/* 4 Component Bricks */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Brand Brick */}
              <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm hover:border-neutral-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(115,115,115,0.2)] hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-neutral-500/20 to-neutral-600/20 border border-neutral-500/30 flex items-center justify-center">
                    <Building className="h-8 w-8 text-neutral-400" />
                  </div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Brand</h3>
                  <p className="text-xl font-bold text-white">{brief.brandName}</p>
                </div>
              </div>
              
              {/* Project Brick */}
              <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm hover:border-neutral-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(115,115,115,0.2)] hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-neutral-500/20 to-neutral-600/20 border border-neutral-500/30 flex items-center justify-center">
                    <Package className="h-8 w-8 text-neutral-400" />
                  </div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Project</h3>
                  <p className="text-xl font-bold text-white">{brief.projectName}</p>
                </div>
              </div>

              {/* Timeline Brick */}
              <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm hover:border-neutral-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(115,115,115,0.2)] hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-neutral-500/20 to-neutral-600/20 border border-neutral-500/30 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-neutral-400" />
                  </div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Timeline</h3>
                  <p className="text-lg font-bold text-white">{brief.timeline}</p>
                </div>
              </div>

              {/* Budget Brick */}
              <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm hover:border-neutral-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(115,115,115,0.2)] hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-neutral-500/20 to-neutral-600/20 border border-neutral-500/30 flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-neutral-400" />
                  </div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Budget</h3>
                  <p className="text-xl font-bold text-white">{brief.budgetRange}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Engagement Section */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
              Community Interest
            </h2>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm p-8 lg:p-12">
              <div className="absolute top-6 right-6 w-3 h-3 bg-neutral-400 rounded-full animate-pulse"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Saves */}
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                    <Bookmark className="h-10 w-10 text-emerald-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{brief.saves}</h3>
                  <p className="text-neutral-400">Saved</p>
                </div>

                {/* Interested */}
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                    <Heart className="h-10 w-10 text-emerald-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{brief.interested}</h3>
                  <p className="text-neutral-400">Interested</p>
                </div>

                {/* Total Views */}
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                    <Eye className="h-10 w-10 text-emerald-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{brief.saves + brief.interested}</h3>
                  <p className="text-neutral-400">Total Views</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Final CTA Section - Full Width Footer */}
      <div className="w-full bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 py-20">
        <div className="relative w-full overflow-hidden">
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neutral-500/20 via-transparent to-neutral-600/20"></div>
          </div>
          
          {/* CTA Content */}
          <div className="relative p-8 lg:p-16 text-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

              {/* Success Indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-400" />
                  <span className="text-xs sm:text-sm text-neutral-400">Verified Brief</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-400" />
                  <span className="text-xs sm:text-sm text-neutral-400">Community Vetted</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-400" />
                  <span className="text-xs sm:text-sm text-neutral-400">Ready to Execute</span>
                </div>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-neutral-100 to-white bg-clip-text text-transparent">
                Ready to Collaborate on This Brief?
              </h2>
              
              <p className="text-xl text-neutral-400 mb-8 leading-relaxed max-w-2xl mx-auto">
                Join the community of creators and brands who are transforming marketing through strategic collaboration. 
                Express your interest and start building something amazing together.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <button 
                  onClick={handleInterested}
                  disabled={isLoadingAction}
                  className={`px-12 py-4 text-white font-semibold text-lg rounded-lg transition-all duration-300 flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:scale-105 ${
                    isInterested 
                      ? 'bg-emerald-600' 
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500'
                  }`}
                >
                  <Zap className="h-6 w-6" />
                  {isInterested ? 'Interested!' : 'Express Interest'}
                </button>
                <button className="px-8 py-4 border border-neutral-600 hover:border-neutral-400/50 rounded-lg transition-all duration-300 flex items-center gap-3 hover:bg-neutral-400/5">
                  <Share2 className="h-5 w-5" />
                  Share Brief
                </button>
              </div>
              
              {/* Social Proof */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-neutral-500 to-neutral-600 border-2 border-neutral-800"></div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-700 border-2 border-neutral-800"></div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 border-2 border-neutral-800"></div>
                  </div>
                  <span>100+ creators active</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-neutral-700"></div>
                <span>Published by {brief.publishedBy}</span>
                <div className="hidden sm:block w-px h-4 bg-neutral-700"></div>
                <span>{formatTimeAgo(brief.publishedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
