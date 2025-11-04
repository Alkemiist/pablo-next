'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Edit, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { TrendInput } from '@/lib/variables-types';
import { saveTrend, updateTrend } from '@/lib/variables-storage';

interface TrendFormProps {
  onComplete: () => void;
  onBack: () => void;
  initialData?: TrendInput;
  editingId?: string;
  onSaveComplete?: () => void;
}

export default forwardRef<any, TrendFormProps>(function TrendForm({ onComplete, onBack, initialData, editingId, onSaveComplete }, ref) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<TrendInput>({
    name: '',
    description: '',
    coreDrivers: '',
    keyBehaviors: '',
    emotionalCulturalMeaning: '',
    whoIsLeading: '',
    whoIsFollowing: '',
    opportunityForBrands: '',
    risksMissteps: '',
    exampleInAction: '',
  });


  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsEditing(true);
    }
  }, [initialData]);

  const questions = [
    {
      id: 'name',
      question: 'What is the name or shorthand for this trend?',
      example: '(E.g., "Quiet Luxury," "Data-Driven Confidence," "Performance Minimalism," "Golf as Lifestyle.")',
      type: 'textarea'
    },
    {
      id: 'description',
      question: 'Describe the essence of the trend in 2–3 sentences.',
      example: '(What\'s happening, and what does it represent behaviorally or culturally?)',
      type: 'textarea'
    },
    {
      id: 'coreDrivers',
      question: 'What\'s fueling this trend?',
      example: '(E.g., technology shifts, cultural events, generational attitudes, economic changes, new media platforms, etc.)',
      type: 'textarea'
    },
    {
      id: 'keyBehaviors',
      question: 'What visible behaviors or signals indicate this trend is real?',
      example: '(Social content types, purchase patterns, community growth, aesthetic shifts, etc.)',
      type: 'textarea'
    },
    {
      id: 'emotionalCulturalMeaning',
      question: 'What emotion or deeper cultural desire does this trend express?',
      example: '(Belonging? Control? Rebellion? Aspiration? Simplicity?)',
      type: 'textarea'
    },
    {
      id: 'whoIsLeading',
      question: 'Which personas, creators, or brands are driving or embodying this trend?',
      example: '(Can include niche or mainstream references.)',
      type: 'textarea'
    },
    {
      id: 'whoIsFollowing',
      question: 'Which audience segments are most adopting it?',
      example: '(By age, mindset, or lifestyle — useful for matching personas.)',
      type: 'textarea'
    },
    {
      id: 'opportunityForBrands',
      question: 'How can brands tap into this trend authentically?',
      example: '(Strategic insight: how it can shape tone, storytelling, or product positioning.)',
      type: 'textarea'
    },
    {
      id: 'risksMissteps',
      question: 'What are the potential pitfalls or tone-deaf moves when referencing this trend?',
      example: '(Ensures AI-generated briefs avoid shallow or inauthentic takes.)',
      type: 'textarea'
    },
    {
      id: 'exampleInAction',
      question: 'Describe a real or hypothetical activation, ad, or content moment that reflects this trend.',
      example: '(This gives the AI a creative anchor for understanding context.)',
      type: 'textarea'
    }
  ];


  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleSave = async () => {
    console.log('Trend form handleSave called');
    try {
      if (isEditing && editingId) {
        console.log('Updating existing trend with ID:', editingId);
        // Update existing trend
        await updateTrend(editingId, formData);
        console.log('Trend updated successfully');
        onSaveComplete?.(); // Call the callback to notify modal
      } else {
        // Create new trend
        console.log('Saving new trend...');
        await saveTrend(formData);
        console.log('Trend saved successfully');
        onComplete();
      }
    } catch (error) {
      console.error('Error saving trend:', error);
    }
  };

  // Expose handleSave function to parent component
  useImperativeHandle(ref, () => ({
    handleSave
  }));

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  return (
    <div className="p-8">
      {/* Header - Only show when creating (not editing) */}
      {!editingId && (
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0 border-neutral-600/70 text-neutral-400 hover:text-white hover:bg-neutral-700 hover:border-neutral-500/70 cursor-pointer"
          >
            <ArrowLeft className="size-4" />
          </Button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Trend Creation</h2>
            <p className="text-sm text-neutral-400">
              Step {currentStep + 1} of {questions.length}
            </p>
          </div>
          
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0 border-neutral-600/70 text-neutral-400 hover:text-white hover:bg-neutral-700 hover:border-neutral-500/70 cursor-pointer"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-neutral-800 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-2">
          {currentQuestion.question}
        </h3>
        <p className="text-sm text-neutral-400 mb-6">
          {currentQuestion.example}
        </p>

        {/* Render appropriate input based on question type */}
        {currentQuestion.type === 'text' && currentQuestion.fields?.length === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter brand name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter tagline"
              />
            </div>
          </div>
        )}

        {currentQuestion.type === 'textarea' && (
          <textarea
            value={formData[currentQuestion.id as keyof TrendInput] as string}
            onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-600 h-32 resize-none"
            placeholder="Enter your answer..."
          />
        )}

        {currentQuestion.type === 'list' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={
                  currentQuestion.id === 'values' ? tempValue :
                  currentQuestion.id === 'personality' ? tempPersonality :
                  tempCompetitor
                }
                onChange={(e) => {
                  if (currentQuestion.id === 'values') setTempValue(e.target.value);
                  if (currentQuestion.id === 'personality') setTempPersonality(e.target.value);
                  if (currentQuestion.id === 'competitors') setTempCompetitor(e.target.value);
                }}
                className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Add item..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleListAdd(currentQuestion.id as 'values' | 'personality' | 'competitors', 
                      currentQuestion.id === 'values' ? tempValue :
                      currentQuestion.id === 'personality' ? tempPersonality :
                      tempCompetitor
                    );
                  }
                }}
              />
              <Button
                onClick={() => handleListAdd(currentQuestion.id as 'values' | 'personality' | 'competitors', 
                  currentQuestion.id === 'values' ? tempValue :
                  currentQuestion.id === 'personality' ? tempPersonality :
                  tempCompetitor
                )}
                className="px-6 bg-green-800 hover:bg-green-700"
              >
                Add
              </Button>
            </div>
            
            {/* Display list items as chips */}
            <div className="flex flex-wrap gap-2">
              {(formData[currentQuestion.id as keyof TrendInput] as string[]).map((item, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-1 bg-neutral-800 rounded-full">
                  <span className="text-white text-sm">{item}</span>
                  <button
                    onClick={() => handleListRemove(currentQuestion.id as 'values' | 'personality' | 'competitors', index)}
                    className="text-red-400 hover:text-red-300 text-sm font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          variant="outline"
          className="gap-2 w-32"
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>

        {!isLastStep ? (
          <Button
            onClick={handleNext}
            className="gap-2 bg-green-800 hover:bg-green-700 w-32"
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSave}
            className="gap-2 bg-green-800 hover:bg-green-700 w-32"
            data-form-save
          >
            <Save className="size-4" />
            Save Trend
          </Button>
        )}
      </div>
    </div>
  );
});
