"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2, FileText, Calendar, User, Tag } from "lucide-react";
import BriefDocument from "../../brief-builder/components/brief-document";
import { MarketingBriefDocument } from "@/lib/streamlined-brief-types";
import { BriefMetadata } from "@/lib/brief-storage";

interface SavedBrief {
  metadata: BriefMetadata;
  briefData: MarketingBriefDocument;
}

export default function BriefViewerPage() {
  const router = useRouter();
  const params = useParams();
  const briefId = params.id as string;
  
  const [brief, setBrief] = useState<SavedBrief | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBrief = async () => {
      if (!briefId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/briefs/${briefId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Brief not found');
          }
          throw new Error('Failed to load brief');
        }
        
        const data = await response.json();
        setBrief(data.brief);
      } catch (err) {
        console.error('Error loading brief:', err);
        setError(err instanceof Error ? err.message : 'Failed to load brief');
      } finally {
        setIsLoading(false);
      }
    };

    loadBrief();
  }, [briefId]);

  const handleBack = () => {
    router.push('/streamlined-brief');
  };

  const handleEdit = () => {
    // For now, just go back to create page
    // In the future, this could pre-populate the wizard with existing data
    router.push('/streamlined-brief/create');
  };

  const handleDiscard = () => {
    if (window.confirm('Are you sure you want to discard this brief? This action cannot be undone.')) {
      handleBack();
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="size-8 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-neutral-400">Loading brief...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <FileText className="size-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Brief</h2>
          <p className="text-neutral-400 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Back to Briefs
          </button>
        </div>
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <FileText className="size-16 text-neutral-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Brief Not Found</h2>
          <p className="text-neutral-400 mb-6">The requested brief could not be found.</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black overflow-hidden">
      {/* Header with brief metadata */}
      <div className="bg-neutral-950 border-b border-neutral-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
            
            <div className="h-6 w-px bg-neutral-700" />
            
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-blue-400" />
              <h1 className="text-xl font-semibold text-white">{brief.metadata.title}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 text-sm rounded-full ${
              brief.metadata.status === 'Approved' ? 'bg-green-900/30 text-green-400 border border-green-800' :
              brief.metadata.status === 'In Review' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800' :
              'bg-gray-900/30 text-gray-400 border border-gray-800'
            }`}>
              {brief.metadata.status}
            </span>
          </div>
        </div>
        
        {/* Brief metadata details */}
        {/* <div className="mt-4 flex items-center gap-6 text-sm text-neutral-400">
          <div className="flex items-center gap-2">
            <User className="size-4" />
            <span>{brief.metadata.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="size-4" />
            <span>Created {new Date(brief.metadata.createdAt).toLocaleDateString()}</span>
          </div>
          {brief.metadata.tags && brief.metadata.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="size-4" />
              <div className="flex gap-1">
                {brief.metadata.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-neutral-800 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div> */}
        
        {/* {brief.metadata.description && (
          <p className="mt-3 text-neutral-300 text-sm max-w-2xl">
            {brief.metadata.description}
          </p>
        )} */}
      </div>

      {/* Brief document content */}
      <div className="h-[calc(100vh-140px)] overflow-hidden">
        <BriefDocument 
          brief={brief.briefData} 
          onBack={handleBack} 
          onDiscard={handleDiscard}
          onSave={() => {}} // Disable save in viewer mode
          isViewOnly={true} // Add this prop to indicate view-only mode
        />
      </div>
    </div>
  );
}
