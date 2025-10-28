'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Edit, Trash2, ArrowLeft, Save } from 'lucide-react';
import { Brand, Product, Persona, Trend, VariableType } from '@/lib/variables-types';
import { deleteVariable } from '@/lib/variables-storage';
import BrandForm from './brand-form';
import ProductForm from './product-form';
import PersonaForm from './persona-form';
import TrendForm from './trend-form';
import { generatePersonaName } from '@/lib/variables-storage';

interface VariableDetailModalProps {
  variable: Brand | Product | Persona | Trend;
  type: VariableType;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function VariableDetailModal({ 
  variable, 
  type, 
  onClose, 
  onEdit, 
  onDelete 
}: VariableDetailModalProps) {
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
    console.log('Form ref handleSave:', formRef.current?.handleSave);
    // Call the form's save function directly via ref
    if (formRef.current && formRef.current.handleSave) {
      console.log('Calling form handleSave');
      formRef.current.handleSave();
    } else {
      console.error('Form ref or handleSave not available');
    }
  };

  const handleSaveComplete = () => {
    // Called when form save is complete
    setIsEditing(false);
    onEdit(); // Refresh the data
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this variable? This action cannot be undone.')) {
      deleteVariable(variable.id, type);
      onDelete();
    }
  };

  const renderContent = () => {
    if (isEditing) {
      switch (type) {
        case 'brand':
          return (
            <BrandForm 
              ref={formRef}
              onComplete={handleEditComplete}
              onBack={() => setIsEditing(false)}
              initialData={variable as Brand}
              editingId={variable.id}
              onSaveComplete={handleSaveComplete}
            />
          );
        case 'product':
          return (
            <ProductForm 
              ref={formRef}
              onComplete={handleEditComplete}
              onBack={() => setIsEditing(false)}
              initialData={variable as Product}
              editingId={variable.id}
              onSaveComplete={handleSaveComplete}
            />
          );
        case 'persona':
          return (
            <PersonaForm 
              ref={formRef}
              onComplete={handleEditComplete}
              onBack={() => setIsEditing(false)}
              initialData={variable as Persona}
              editingId={variable.id}
              onSaveComplete={handleSaveComplete}
            />
          );
        case 'trend':
          return (
            <TrendForm 
              ref={formRef}
              onComplete={handleEditComplete}
              onBack={() => setIsEditing(false)}
              initialData={variable as Trend}
              editingId={variable.id}
              onSaveComplete={handleSaveComplete}
            />
          );
        default:
          return null;
      }
    }

    // View mode
    return (
      <div className="p-8">

        {/* Content */}
        <div className="space-y-6">
          {type === 'brand' && (
            <div className="space-y-6">
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Tagline</h3>
                <p className="text-neutral-400">{(variable as Brand).tagline}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Mission</h3>
                <p className="text-neutral-400">{(variable as Brand).mission}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Values</h3>
                <div className="flex flex-wrap gap-2">
                  {((variable as Brand).values || []).map((value, index) => (
                    <span key={index} className="px-3 py-1 bg-neutral-800/50 text-neutral-300 rounded-full text-sm">
                      {value}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Personality</h3>
                <div className="flex flex-wrap gap-2">
                  {((variable as Brand).personality || []).map((trait, index) => (
                    <span key={index} className="px-3 py-1 bg-neutral-800/50 text-neutral-300 rounded-full text-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Tone of Voice</h3>
                <p className="text-neutral-400">{(variable as Brand).toneOfVoice}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Competitors</h3>
                <div className="flex flex-wrap gap-2">
                  {((variable as Brand).competitors || []).map((competitor, index) => (
                    <span key={index} className="px-3 py-1 bg-neutral-800/50 text-neutral-300 rounded-full text-sm">
                      {competitor}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Visual Guidelines</h3>
                <p className="text-neutral-400">{(variable as Brand).visualGuidelines}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Dos and Don'ts</h3>
                <p className="text-neutral-400">{(variable as Brand).dosAndDonts}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Emotional Response</h3>
                <p className="text-neutral-400">{(variable as Brand).emotionalResponse}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Cultural Territories</h3>
                <p className="text-neutral-400">{(variable as Brand).culturalTerritories}</p>
              </div>
            </div>
          )}

          {type === 'product' && (
            <div className="space-y-6">
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Category</h3>
                <p className="text-neutral-400">{(variable as Product).category}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Problem Solved</h3>
                <p className="text-neutral-400">{(variable as Product).problemSolved}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Key Features</h3>
                <div className="flex flex-wrap gap-2">
                  {((variable as Product).keyFeatures || []).map((feature, index) => (
                    <span key={index} className="px-3 py-1 bg-neutral-800/50 text-neutral-300 rounded-full text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Emotional Benefit</h3>
                <p className="text-neutral-400">{(variable as Product).emotionalBenefit}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Differentiation</h3>
                <p className="text-neutral-400">{(variable as Product).differentiation}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Origin Story</h3>
                <p className="text-neutral-400">{(variable as Product).originStory}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">User Feeling</h3>
                <p className="text-neutral-400">{(variable as Product).userFeeling}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Proof Points</h3>
                <div className="flex flex-wrap gap-2">
                  {((variable as Product).proofPoints || []).map((proof, index) => (
                    <span key={index} className="px-3 py-1 bg-neutral-800/50 text-neutral-300 rounded-full text-sm">
                      {proof}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Positioning</h3>
                <p className="text-neutral-400">{(variable as Product).positioning}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Lifecycle</h3>
                <p className="text-neutral-400">{(variable as Product).lifecycle}</p>
              </div>
            </div>
          )}

          {type === 'persona' && (
            <div className="space-y-6">
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Demographics</h3>
                <p className="text-neutral-400">{(variable as Persona).demographics}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Psychographics</h3>
                <p className="text-neutral-400">{(variable as Persona).psychographics}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Emotional Drivers</h3>
                <p className="text-neutral-400">{(variable as Persona).emotionalDrivers}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Values & Aspirations</h3>
                <p className="text-neutral-400">{(variable as Persona).valuesAspirations}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Pain Points</h3>
                <p className="text-neutral-400">{(variable as Persona).painPoints}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Cultural Moments</h3>
                <p className="text-neutral-400">{(variable as Persona).culturalMoments}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Media Consumption</h3>
                <div className="flex flex-wrap gap-2">
                  {((variable as Persona).mediaConsumption || []).map((media, index) => (
                    <span key={index} className="px-3 py-1 bg-neutral-800/50 text-neutral-300 rounded-full text-sm">
                      {media}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Preferred Tone</h3>
                <p className="text-neutral-400">{(variable as Persona).preferredTone}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Emotional Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {((variable as Persona).emotionalKeywords || []).map((keyword, index) => (
                    <span key={index} className="px-3 py-1 bg-neutral-800/50 text-neutral-300 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Desired Transformation</h3>
                <p className="text-neutral-400">{(variable as Persona).desiredTransformation}</p>
              </div>
            </div>
          )}

          {type === 'trend' && (
            <div className="space-y-6">
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-neutral-400">{(variable as Trend).description}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Core Drivers</h3>
                <p className="text-neutral-400">{(variable as Trend).coreDrivers}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Key Behaviors & Signals</h3>
                <p className="text-neutral-400">{(variable as Trend).keyBehaviors}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Emotional & Cultural Meaning</h3>
                <p className="text-neutral-400">{(variable as Trend).emotionalCulturalMeaning}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Who's Leading It</h3>
                <p className="text-neutral-400">{(variable as Trend).whoIsLeading}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Who's Following It</h3>
                <p className="text-neutral-400">{(variable as Trend).whoIsFollowing}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Opportunity for Brands</h3>
                <p className="text-neutral-400">{(variable as Trend).opportunityForBrands}</p>
              </div>
              <div className="pb-6 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-white mb-2">Risks & Missteps</h3>
                <p className="text-neutral-400">{(variable as Trend).risksMissteps}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Example in Action</h3>
                <p className="text-neutral-400">{(variable as Trend).exampleInAction}</p>
              </div>
            </div>
          )}
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
                  {type === 'persona' ? generatePersonaName(variable as Persona) : variable.name}
                </h2>
                <p className="text-sm text-neutral-400 capitalize">{type}</p>
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
                      onClick={onClose}
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
