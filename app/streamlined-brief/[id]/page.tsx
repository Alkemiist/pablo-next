"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2, FileText, Calendar, User, Tag, Video, Save, Plus, Pencil, Share2, X, Trash2 } from "lucide-react";
import Link from "next/link";
import BriefDocument from "../../components/streamlined-brief/brief-document";
import { MarketingBriefDocument } from "@/lib/streamlined-brief-types";
import { BriefMetadata } from "@/lib/brief-storage";
import jsPDF from "jspdf";

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
  const [isPublishing, setIsPublishing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const downloadPDF = () => {
    console.log('Download PDF clicked!');
    console.log('Brief data:', brief);
    
    if (!brief) {
      console.log('No brief data available');
      alert('No brief data available. Please try refreshing the page.');
      return;
    }
    
    try {
      console.log('Starting PDF generation...');
      const doc = new jsPDF();
      
      // Simple test - just add the title
      doc.setFontSize(20);
      doc.text(brief.briefData.document_info.title, 20, 20);
      
      // Add some basic info
      doc.setFontSize(12);
      doc.text(`Project: ${brief.briefData.document_info.project_name}`, 20, 40);
      doc.text(`Brand: ${brief.briefData.document_info.brand_name}`, 20, 50);
      doc.text(`Generated: ${brief.briefData.document_info.generated_date}`, 20, 60);
      
      // Add executive summary
      doc.setFontSize(14);
      doc.text('Executive Summary', 20, 80);
      doc.setFontSize(10);
      doc.text('Challenge:', 20, 90);
      doc.text(brief.briefData.executive_summary.challenge, 20, 100);
      
      // Save the PDF
      const fileName = `marketing-brief-${brief.briefData.document_info.project_name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      doc.save(fileName);
      console.log('PDF saved successfully:', fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

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
    setIsEditMode(!isEditMode);
  };

  const handleBriefUpdate = (updatedBrief: MarketingBriefDocument) => {
    if (brief) {
      setBrief({
        ...brief,
        briefData: updatedBrief
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!brief) return;
    
    try {
      const response = await fetch(`/api/briefs/${briefId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          briefData: brief.briefData,
          metadata: brief.metadata
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save changes: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Changes saved successfully:', result);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      alert(`Failed to save changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDiscardChanges = () => {
    if (window.confirm('Are you sure you want to discard all changes? This action cannot be undone.')) {
      setIsEditMode(false);
      // Reload the brief to revert changes
      window.location.reload();
    }
  };

  const handleDiscard = () => {
    if (window.confirm('Are you sure you want to discard this brief? This action cannot be undone.')) {
      handleBack();
    }
  };

  const handlePublish = async () => {
    if (!brief) return;
    
    setIsPublishing(true);
    try {
      const response = await fetch('/api/marketplace/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          briefId: briefId,
          briefData: brief.briefData,
          metadata: brief.metadata
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish brief');
      }

      const result = await response.json();
      
      // Show success message and redirect to marketplace
      alert('Brief published successfully! Redirecting to marketplace...');
      router.push('/marketplace');
    } catch (error) {
      console.error('Error publishing brief:', error);
      alert('Failed to publish brief. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!brief) return;
    
    const confirmMessage = `Are you sure you want to delete "${brief.metadata.title}"? This action cannot be undone.`;
    if (!window.confirm(confirmMessage)) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/briefs/${briefId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete brief');
      }

      // Show success message and redirect to briefs list
      alert('Brief deleted successfully!');
      router.push('/streamlined-brief');
    } catch (error) {
      console.error('Error deleting brief:', error);
      alert('Failed to delete brief. Please try again.');
    } finally {
      setIsDeleting(false);
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
            className="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-md transition-colors cursor-pointer"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black overflow-hidden flex flex-col">
      {/* Header with brief metadata */}
      <div className="bg-neutral-950 border-b border-neutral-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-4 cursor-pointer" />
              Back
            </button>
            
            {/* Separator */}
            <div className="h-6 w-px bg-neutral-700" />
            
            
            <div className="flex items-center gap-2">
              {/* <FileText className="size-5 text-blue-400" /> */}
              <h1 className="text-xl font-semibold text-white">{brief.metadata.title}</h1>
            </div>
          </div>
          
          {/* Status */}
          {/* <div className="flex items-center gap-4">
            <span className={`px-3 py-1 text-sm rounded-full ${
              brief.metadata.status === 'Approved' ? 'bg-green-900/30 text-green-400 border border-green-800' :
              brief.metadata.status === 'In Review' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800' :
              'bg-gray-900/30 text-gray-400 border border-gray-800'
            }`}>
              {brief.metadata.status}
            </span>
          </div> */}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isEditMode ? (
              <>
                {/* Secondary Actions */}
                <div className="flex gap-2">
                  {/* Download PDF */}
                  <button
                    onClick={downloadPDF}
                    className="p-2.5 bg-neutral-800/50 border border-neutral-700/50 hover:bg-neutral-700/50 text-neutral-300 hover:text-white rounded-lg transition-all duration-200 cursor-pointer backdrop-blur-sm"
                    disabled={!brief}
                    title="Download PDF"
                  >
                    <Save className="w-4 h-4" />
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={handleEdit}
                    className="p-2.5 bg-neutral-800/50 border border-neutral-700/50 hover:bg-neutral-700/50 text-neutral-300 hover:text-white rounded-lg transition-all duration-200 cursor-pointer backdrop-blur-sm"
                    disabled={!brief}
                    title="Edit Brief"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={handleDelete}
                    disabled={!brief || isDeleting}
                    className="p-2.5 bg-neutral-800/50 border border-neutral-700/50 hover:bg-red-900/50 hover:border-red-800/50 text-neutral-300 hover:text-red-300 disabled:bg-neutral-600 rounded-lg transition-all duration-200 cursor-pointer backdrop-blur-sm"
                    title="Delete Brief"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Publish to Marketplace - Primary Action */}
                <button
                  onClick={handlePublish}
                  disabled={!brief || isPublishing}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-600 text-white rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-2 font-medium shadow-lg hover:shadow-emerald-500/25"
                  title="Publish to Marketplace"
                >
                  <Share2 className="w-4 h-4" />
                  {isPublishing ? 'Publishing...' : 'Publish'}
                </button>
                
              </>
            ) : (
              <>
                {/* Secondary Actions */}
                <div className="flex gap-2">
                  {/* Discard Changes */}
                  <button
                    onClick={handleDiscardChanges}
                    className="px-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 hover:bg-red-900/50 hover:border-red-800/50 text-neutral-300 hover:text-red-300 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-2 backdrop-blur-sm"
                    title="Discard Changes"
                  >
                    <X className="w-4 h-4" />
                    Discard
                  </button>

                  {/* Exit Edit Mode */}
                  <button
                    onClick={handleEdit}
                    className="p-2.5 bg-neutral-800/50 border border-neutral-700/50 hover:bg-neutral-700/50 text-neutral-300 hover:text-white rounded-lg transition-all duration-200 cursor-pointer backdrop-blur-sm"
                    title="Exit Edit Mode"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>

                {/* Save Changes - Primary Action */}
                <button
                  onClick={handleSaveChanges}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-2 font-medium shadow-lg hover:shadow-emerald-500/25"
                  title="Save Changes"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </>
            )}
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
      <div className="flex-1 overflow-y-auto">
        <BriefDocument 
          brief={brief.briefData} 
          onBack={handleBack} 
          onDiscard={handleDiscard}
          onSave={() => {}} // Disable save in viewer mode
          onBriefUpdate={handleBriefUpdate}
          isViewOnly={!isEditMode} // Enable edit mode when not in view-only
        />
      </div>
    </div>
  );
}
