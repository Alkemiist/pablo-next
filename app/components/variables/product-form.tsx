'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Edit, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ProductInput } from '@/lib/variables-types';
import { saveProduct, updateProduct } from '@/lib/variables-storage';

interface ProductFormProps {
  onComplete: () => void;
  onBack: () => void;
  initialData?: ProductInput;
  editingId?: string;
  onSaveComplete?: () => void;
}

export default forwardRef<any, ProductFormProps>(function ProductForm({ onComplete, onBack, initialData, editingId, onSaveComplete }, ref) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProductInput>({
    name: '',
    category: '',
    problemSolved: '',
    keyFeatures: [],
    emotionalBenefit: '',
    differentiation: '',
    originStory: '',
    userFeeling: '',
    proofPoints: [],
    positioning: '',
    lifecycle: '',
  });

  const [tempFeature, setTempFeature] = useState('');
  const [tempProofPoint, setTempProofPoint] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsEditing(true);
    }
  }, [initialData]);

  const questions = [
    {
      id: 'name',
      question: 'What is the product name and category?',
      example: '(E.g., KIA Telluride — midsize SUV.)',
      type: 'text',
      fields: ['name', 'category']
    },
    {
      id: 'problemSolved',
      question: 'What problem does this product solve for the user?',
      example: '(Functional or emotional problem it addresses.)',
      type: 'textarea'
    },
    {
      id: 'keyFeatures',
      question: 'What are the top 3–5 key features or innovations?',
      example: '(E.g., AWD, luxury interior, advanced safety tech.)',
      type: 'list'
    },
    {
      id: 'emotionalBenefit',
      question: 'What is the product\'s main emotional benefit?',
      example: '(E.g., confidence, freedom, peace of mind.)',
      type: 'textarea'
    },
    {
      id: 'differentiation',
      question: 'What differentiates this product from competitors?',
      example: '(E.g., design-led thinking, technology, pricing, sustainability.)',
      type: 'textarea'
    },
    {
      id: 'originStory',
      question: 'What is the product\'s origin story or inspiration?',
      example: '(Gives creative context for brand storytelling.)',
      type: 'textarea'
    },
    {
      id: 'userFeeling',
      question: 'How should people feel when using this product?',
      example: '(E.g., capable, calm, connected, proud.)',
      type: 'textarea'
    },
    {
      id: 'proofPoints',
      question: 'What proof points or credibility signals support its quality?',
      example: '(E.g., awards, expert reviews, certifications, partnerships.)',
      type: 'list'
    },
    {
      id: 'positioning',
      question: 'What is the current positioning or tagline for the product?',
      example: '(Optional: how does this evolve from the brand\'s tagline?)',
      type: 'textarea'
    },
    {
      id: 'lifecycle',
      question: 'What is the product\'s lifecycle or cultural moment?',
      example: '(Launch, refresh, legacy product, innovation leader, etc.)',
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

  const handleListAdd = (field: 'keyFeatures' | 'proofPoints', tempValue: string) => {
    if (tempValue.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], tempValue.trim()]
      }));
      if (field === 'keyFeatures') setTempFeature('');
      if (field === 'proofPoints') setTempProofPoint('');
    }
  };

  const handleListRemove = (field: 'keyFeatures' | 'proofPoints', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    console.log('Product form handleSave called');
    try {
      if (isEditing && editingId) {
        console.log('Updating existing product with ID:', editingId);
        // Update existing product
        await updateProduct(editingId, formData);
        console.log('Product updated successfully');
        onSaveComplete?.(); // Call the callback to notify modal
      } else {
        // Create new product
        saveProduct(formData);
        onComplete();
      }
    } catch (error) {
      console.error('Error saving product:', error);
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
            <h2 className="text-2xl font-bold text-white">Product Creation</h2>
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
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter product category"
              />
            </div>
          </div>
        )}

        {currentQuestion.type === 'textarea' && (
          <textarea
            value={formData[currentQuestion.id as keyof ProductInput] as string}
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
                  currentQuestion.id === 'keyFeatures' ? tempFeature : tempProofPoint
                }
                onChange={(e) => {
                  if (currentQuestion.id === 'keyFeatures') setTempFeature(e.target.value);
                  if (currentQuestion.id === 'proofPoints') setTempProofPoint(e.target.value);
                }}
                className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Add item..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleListAdd(currentQuestion.id as 'keyFeatures' | 'proofPoints', 
                      currentQuestion.id === 'keyFeatures' ? tempFeature : tempProofPoint
                    );
                  }
                }}
              />
              <Button
                onClick={() => handleListAdd(currentQuestion.id as 'keyFeatures' | 'proofPoints', 
                  currentQuestion.id === 'keyFeatures' ? tempFeature : tempProofPoint
                )}
                className="px-6 bg-green-800 hover:bg-green-700"
              >
                Add
              </Button>
            </div>
            
            {/* Display list items as chips */}
            <div className="flex flex-wrap gap-2">
              {(formData[currentQuestion.id as keyof ProductInput] as string[]).map((item, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-1 bg-neutral-800 rounded-full">
                  <span className="text-white text-sm">{item}</span>
                  <button
                    onClick={() => handleListRemove(currentQuestion.id as 'keyFeatures' | 'proofPoints', index)}
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
            Save Product
          </Button>
        )}
      </div>
    </div>
  );
});
