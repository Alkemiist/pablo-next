'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SeedInput } from '@/lib/seed-ideas-types';
import { saveSeed, updateSeed } from '@/lib/seed-ideas-storage';

interface SeedFormProps {
  onComplete: () => void;
  onBack: () => void;
  initialData?: SeedInput;
  editingId?: string;
  onSaveComplete?: () => void;
}

export default forwardRef<any, SeedFormProps>(function SeedForm({ onComplete, onBack, initialData, editingId, onSaveComplete }, ref) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<SeedInput>({
    name: '',
    dnaSummary: '',
    originalCampaign: '',
    coreMechanism: '',
    psychologicalDrivers: '',
    culturalTension: '',
    archetypeAlignment: '',
    transferableEssence: '',
    contextDependencies: '',
    risksAndTradeoffs: '',
    formatAgnosticism: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsEditing(true);
    }
  }, [initialData]);

  const questions = [
    {
      id: 'originalCampaign',
      question: 'What is the original campaign or concept this seed comes from, and what was it trying to achieve at the time?',
      purpose: 'Anchors the seed in its creative and cultural origin, so the model understands intent, not just surface tactics.',
      example: '(Ex: "Nike\'s \'Dream Crazy\' used moral courage to re-energize brand purpose during a time of cultural polarization.")',
      type: 'textarea'
    },
    {
      id: 'coreMechanism',
      question: 'What is the central mechanism that made this campaign work — the underlying creative engine driving its power?',
      purpose: 'This is the "physics" of the idea — e.g., reframing, inversion, participation, cultural co-signing, moral defiance, vulnerability, etc.',
      example: '(Ex: "It worked by framing moral defiance as heroism, making protest feel aspirational.")',
      type: 'textarea'
    },
    {
      id: 'psychologicalDrivers',
      question: 'Which emotional or cognitive triggers did this idea activate in its audience?',
      purpose: 'Lets your system reuse the human effect of the idea even in new categories.',
      example: '(Ex: "Aspired belonging, identity affirmation, righteous defiance, cultural empathy.")',
      type: 'textarea'
    },
    {
      id: 'culturalTension',
      question: 'What social, cultural, or emotional tension did this idea tap into — and how did it resolve it?',
      purpose: 'Great ideas live in tension. By logging this, your system can look for analogous tensions in new personas/trends.',
      example: '(Ex: "Tension: athletes silenced for activism. Resolution: brand celebrates that defiance as noble.")',
      type: 'textarea'
    },
    {
      id: 'archetypeAlignment',
      question: 'Which archetype(s) does this idea embody — and how?',
      purpose: 'Archetypes make transferability easier. A seed that expresses "The Rebel" can morph into "The Visionary" or "The Protector" for different personas.',
      example: '(Ex: "Hero → Rebel → Martyr; embodies courage through sacrifice.")',
      type: 'textarea'
    },
    {
      id: 'transferableEssence',
      question: 'What is the most portable principle of this idea that can inspire new contexts — without copying the execution?',
      purpose: 'Distills the "creative algorithm" from the campaign, not the artifacts.',
      example: '(Ex: "Championing the overlooked underdog to redefine cultural value.")',
      type: 'textarea'
    },
    {
      id: 'contextDependencies',
      question: 'What dependencies or constraints made the idea work (timing, culture, platform, audience mood)?',
      purpose: 'Helps the model avoid literal reuse where the mechanism would fail (e.g., controversy without credibility).',
      example: '(Ex: "Worked because Nike had authenticity in athlete activism; would fail for a brand with no social credibility.")',
      type: 'textarea'
    },
    {
      id: 'risksAndTradeoffs',
      question: 'What specific risks or trade-offs did this idea make, and what did it gain in return?',
      purpose: 'Teaches the system the risk logic of creativity — every bold move costs something.',
      example: '(Ex: "Risked alienation of conservatives; gained moral authority among youth culture.")',
      type: 'textarea'
    },
    {
      id: 'formatAgnosticism',
      question: 'How can this idea\'s mechanism express itself across different formats (social, experiential, OOH, etc.)?',
      purpose: 'Encourages tactic-agnostic reasoning, helping the AI scale ideas flexibly.',
      example: '(Ex: "Hero narrative can live as docu-film, manifesto copy, influencer storytelling, or experiential installation.")',
      type: 'textarea'
    },
    {
      id: 'nameAndDna',
      question: 'Give this seed idea a name and summarize its DNA in one sharp sentence.',
      purpose: 'Gives the system a handle — something to latch onto and reason with symbolically.',
      example: '(Ex: "Seed Name: The Courage Engine — reframing moral defiance as mainstream heroism.")',
      type: 'nameAndDna'
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
    console.log('Seed form handleSave called');
    try {
      if (isEditing && editingId) {
        console.log('Updating existing seed with ID:', editingId);
        await updateSeed(editingId, formData);
        console.log('Seed updated successfully');
        onSaveComplete?.();
      } else {
        console.log('Saving new seed...');
        await saveSeed(formData);
        console.log('Seed saved successfully');
        onComplete();
      }
    } catch (error) {
      console.error('Error saving seed:', error);
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
            <h2 className="text-2xl font-bold text-white">Seed Idea Creation</h2>
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
        <p className="text-sm text-neutral-500 mb-2 italic">
          {currentQuestion.purpose}
        </p>
        <p className="text-sm text-neutral-400 mb-6">
          {currentQuestion.example}
        </p>

        {/* Render appropriate input based on question type */}
        {currentQuestion.type === 'textarea' && (
          <textarea
            value={formData[currentQuestion.id as keyof SeedInput] as string}
            onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-600 h-32 resize-none"
            placeholder="Enter your answer..."
          />
        )}

        {currentQuestion.type === 'nameAndDna' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Seed Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter seed name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                DNA Summary
              </label>
              <textarea
                value={formData.dnaSummary}
                onChange={(e) => handleInputChange('dnaSummary', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-600 h-32 resize-none"
                placeholder="Summarize the seed's DNA in one sharp sentence..."
              />
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
            Save
          </Button>
        )}
      </div>
    </div>
  );
});

