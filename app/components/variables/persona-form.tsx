'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Edit, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PersonaInput } from '@/lib/variables-types';
import { savePersona, updatePersona } from '@/lib/variables-storage';

interface PersonaFormProps {
  onComplete: () => void;
  onBack: () => void;
  initialData?: PersonaInput;
  editingId?: string;
  onSaveComplete?: () => void;
}

export default forwardRef<any, PersonaFormProps>(function PersonaForm({ onComplete, onBack, initialData, editingId, onSaveComplete }, ref) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PersonaInput>({
    demographics: '',
    psychographics: '',
    emotionalDrivers: '',
    valuesAspirations: '',
    painPoints: '',
    culturalMoments: '',
    mediaConsumption: [],
    preferredTone: '',
    emotionalKeywords: [],
    desiredTransformation: '',
  });

  const [tempMedia, setTempMedia] = useState('');
  const [tempKeyword, setTempKeyword] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsEditing(true);
    }
  }, [initialData]);

  const questions = [
    {
      id: 'demographics',
      question: 'Who is the target persona (age, occupation, location, demographics)?',
      example: '(Helps anchor storytelling tone and setting.)',
      type: 'textarea'
    },
    {
      id: 'psychographics',
      question: 'What are their key psychographics and lifestyle indicators?',
      example: '(Income, lifestyle, interests, attitudes.)',
      type: 'textarea'
    },
    {
      id: 'emotionalDrivers',
      question: 'What drives them emotionally and functionally when choosing a brand like this?',
      example: '(E.g., safety, innovation, recognition, belonging.)',
      type: 'textarea'
    },
    {
      id: 'valuesAspirations',
      question: 'What are their values and aspirations in life?',
      example: '(E.g., adventure, balance, sustainability, success.)',
      type: 'textarea'
    },
    {
      id: 'painPoints',
      question: 'What challenges or pain points do they face that this brand/product helps with?',
      example: '(Day-to-day frustrations or unmet needs.)',
      type: 'textarea'
    },
    {
      id: 'culturalMoments',
      question: 'What moments in their life or culture connect most with the brand\'s offering?',
      example: '(E.g., weekend getaways, parenting, creative freedom, hustle culture.)',
      type: 'textarea'
    },
    {
      id: 'mediaConsumption',
      question: 'What media, platforms, or cultural spaces do they inhabit?',
      example: '(E.g., Instagram, podcasts, outdoor gear blogs.)',
      type: 'list'
    },
    {
      id: 'preferredTone',
      question: 'What kind of tone, visuals, or storytelling resonates most with them?',
      example: '(E.g., cinematic realism, humor, minimalism, empowerment.)',
      type: 'textarea'
    },
    {
      id: 'emotionalKeywords',
      question: 'What are the "emotional keywords" that describe their worldview?',
      example: '(E.g., purposeful, curious, grounded, ambitious.)',
      type: 'list'
    },
    {
      id: 'desiredTransformation',
      question: 'What transformation do they seek — who do they want to become?',
      example: '(This is where storytelling finds its core tension.)',
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

  const handleListAdd = (field: 'mediaConsumption' | 'emotionalKeywords', tempValue: string) => {
    if (tempValue.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], tempValue.trim()]
      }));
      if (field === 'mediaConsumption') setTempMedia('');
      if (field === 'emotionalKeywords') setTempKeyword('');
    }
  };

  const handleListRemove = (field: 'mediaConsumption' | 'emotionalKeywords', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    console.log('Persona form handleSave called');
    try {
      if (isEditing && editingId) {
        console.log('Updating existing persona with ID:', editingId);
        // Update existing persona
        await updatePersona(editingId, formData);
        console.log('Persona updated successfully');
        onSaveComplete?.(); // Call the callback to notify modal
      } else {
        // Create new persona
        savePersona(formData);
        onComplete();
      }
    } catch (error) {
      console.error('Error saving persona:', error);
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
            <h2 className="text-2xl font-bold text-white">Persona Creation</h2>
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
        {currentQuestion.type === 'textarea' && (
          <textarea
            value={formData[currentQuestion.id as keyof PersonaInput] as string}
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
                  currentQuestion.id === 'mediaConsumption' ? tempMedia : tempKeyword
                }
                onChange={(e) => {
                  if (currentQuestion.id === 'mediaConsumption') setTempMedia(e.target.value);
                  if (currentQuestion.id === 'emotionalKeywords') setTempKeyword(e.target.value);
                }}
                className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Add item..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleListAdd(currentQuestion.id as 'mediaConsumption' | 'emotionalKeywords', 
                      currentQuestion.id === 'mediaConsumption' ? tempMedia : tempKeyword
                    );
                  }
                }}
              />
              <Button
                onClick={() => handleListAdd(currentQuestion.id as 'mediaConsumption' | 'emotionalKeywords', 
                  currentQuestion.id === 'mediaConsumption' ? tempMedia : tempKeyword
                )}
                className="px-6 bg-green-800 hover:bg-green-700"
              >
                Add
              </Button>
            </div>
            
            {/* Display list items as chips */}
            <div className="flex flex-wrap gap-2">
              {(formData[currentQuestion.id as keyof PersonaInput] as string[]).map((item, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-1 bg-neutral-800 rounded-full">
                  <span className="text-white text-sm">{item}</span>
                  <button
                    onClick={() => handleListRemove(currentQuestion.id as 'mediaConsumption' | 'emotionalKeywords', index)}
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
            Save Persona
          </Button>
        )}
      </div>
    </div>
  );
});
