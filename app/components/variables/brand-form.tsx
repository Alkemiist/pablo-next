'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Edit, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { BrandInput } from '@/lib/variables-types';
import { saveBrand, updateBrand } from '@/lib/variables-storage';

interface BrandFormProps {
  onComplete: () => void;
  onBack: () => void;
  initialData?: BrandInput;
  editingId?: string;
  onSaveComplete?: () => void;
}

export default forwardRef<any, BrandFormProps>(function BrandForm({ onComplete, onBack, initialData, editingId, onSaveComplete }, ref) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<BrandInput>({
    name: '',
    tagline: '',
    mission: '',
    values: [],
    personality: [],
    toneOfVoice: '',
    competitors: [],
    visualGuidelines: '',
    dosAndDonts: '',
    emotionalResponse: '',
    culturalTerritories: '',
  });

  const [tempValue, setTempValue] = useState('');
  const [tempPersonality, setTempPersonality] = useState('');
  const [tempCompetitor, setTempCompetitor] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsEditing(true);
    }
  }, [initialData]);

  const questions = [
    {
      id: 'name',
      question: 'What is the brand name and tagline?',
      example: '(e.g., "KIA — Movement that inspires.")',
      type: 'text',
      fields: ['name', 'tagline']
    },
    {
      id: 'mission',
      question: 'What is the brand\'s core mission or purpose?',
      example: '(Why does it exist beyond profit?)',
      type: 'textarea'
    },
    {
      id: 'values',
      question: 'What are the brand\'s key values or principles?',
      example: '(E.g., sustainability, innovation, inclusivity.)',
      type: 'list'
    },
    {
      id: 'personality',
      question: 'How would you describe the brand\'s personality in 3–5 adjectives?',
      example: '(E.g., bold, human, grounded, inventive.)',
      type: 'list'
    },
    {
      id: 'toneOfVoice',
      question: 'What is the tone of voice and communication style?',
      example: '(E.g., conversational, aspirational, data-driven.)',
      type: 'textarea'
    },
    {
      id: 'competitors',
      question: 'Who are the brand\'s main competitors or cultural references?',
      example: '(This helps AI position messaging contextually.)',
      type: 'list'
    },
    {
      id: 'visualGuidelines',
      question: 'What visual or verbal guidelines define the brand?',
      example: '(Logos, typography, color tone, writing style, etc.)',
      type: 'textarea'
    },
    {
      id: 'dosAndDonts',
      question: 'What are the brand\'s "dos and don\'ts"?',
      example: '(What should the brand never say or associate with?)',
      type: 'textarea'
    },
    {
      id: 'emotionalResponse',
      question: 'What emotional response should the brand evoke in people?',
      example: '(Trust, excitement, empowerment, calm, etc.)',
      type: 'textarea'
    },
    {
      id: 'culturalTerritories',
      question: 'What cultural, social, or innovation territories does the brand own or aspire to lead?',
      example: '(E.g., "future mobility," "eco-luxury," "creative technology.")',
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

  const handleListAdd = (field: 'values' | 'personality' | 'competitors', tempValue: string) => {
    if (tempValue.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], tempValue.trim()]
      }));
      if (field === 'values') setTempValue('');
      if (field === 'personality') setTempPersonality('');
      if (field === 'competitors') setTempCompetitor('');
    }
  };

  const handleListRemove = (field: 'values' | 'personality' | 'competitors', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    console.log('Brand form handleSave called');
    try {
      if (isEditing && editingId) {
        console.log('Updating existing brand with ID:', editingId);
        // Update existing brand
        await updateBrand(editingId, formData);
        console.log('Brand updated successfully');
        onSaveComplete?.(); // Call the callback to notify modal
      } else {
        // Create new brand
        console.log('Saving new brand...');
        await saveBrand(formData);
        console.log('Brand saved successfully');
        onComplete();
      }
    } catch (error) {
      console.error('Error saving brand:', error);
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
            <h2 className="text-2xl font-bold text-white">Brand Creation</h2>
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
            value={formData[currentQuestion.id as keyof BrandInput] as string}
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
              {(formData[currentQuestion.id as keyof BrandInput] as string[]).map((item, index) => (
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
            Save Brand
          </Button>
        )}
      </div>
    </div>
  );
});
