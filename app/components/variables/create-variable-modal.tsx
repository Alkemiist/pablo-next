'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Component, Barcode, Brain } from 'lucide-react';
import BrandForm from './brand-form';
import ProductForm from './product-form';
import PersonaForm from './persona-form';
import { BrandInput, ProductInput, PersonaInput } from '@/lib/variables-types';

type ModalState = 'select' | 'brand' | 'product' | 'persona';

interface CreateVariableModalProps {
  onClose: () => void;
}

export default function CreateVariableModal({ onClose }: CreateVariableModalProps) {
  const [modalState, setModalState] = useState<ModalState>('select');
  const [editingData, setEditingData] = useState<BrandInput | ProductInput | PersonaInput | null>(null);

  const handleTypeSelect = (type: 'brand' | 'product' | 'persona') => {
    setModalState(type);
  };

  const handleBack = () => {
    setModalState('select');
    setEditingData(null);
  };

  const handleFormComplete = () => {
    onClose();
  };

  const renderContent = () => {
    switch (modalState) {
      case 'brand':
        return (
          <BrandForm 
            onComplete={handleFormComplete}
            onBack={handleBack}
            initialData={editingData as BrandInput}
          />
        );
      case 'product':
        return (
          <ProductForm 
            onComplete={handleFormComplete}
            onBack={handleBack}
            initialData={editingData as ProductInput}
          />
        );
      case 'persona':
        return (
          <PersonaForm 
            onComplete={handleFormComplete}
            onBack={handleBack}
            initialData={editingData as PersonaInput}
          />
        );
      default:
        return (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Create Variable</h2>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-neutral-400 hover:text-white"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <p className="text-neutral-400 mb-6">
                Choose the type of variable you want to create. Each type has specific questions tailored to capture the right context.
              </p>

              {/* Brand Option */}
              <div 
                onClick={() => handleTypeSelect('brand')}
                className="p-6 bg-neutral-900 border border-neutral-700 rounded-lg hover:border-blue-600 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-900/30 rounded-lg group-hover:bg-blue-800/50 transition-colors">
                    <Component className="size-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">Brand</h3>
                    <p className="text-sm text-neutral-400 mb-2">
                      Capture the essence, voice, and boundaries of your brand
                    </p>
                    <p className="text-xs text-neutral-500">
                      Who are we? Brand identity, values, personality, and positioning
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Option */}
              <div 
                onClick={() => handleTypeSelect('product')}
                className="p-6 bg-neutral-900 border border-neutral-700 rounded-lg hover:border-green-600 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-900/30 rounded-lg group-hover:bg-green-800/50 transition-colors">
                    <Barcode className="size-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">Product</h3>
                    <p className="text-sm text-neutral-400 mb-2">
                      Build semantic and emotional intelligence around your product
                    </p>
                    <p className="text-xs text-neutral-500">
                      What are we offering? Features, benefits, differentiation, and positioning
                    </p>
                  </div>
                </div>
              </div>

              {/* Persona Option */}
              <div 
                onClick={() => handleTypeSelect('persona')}
                className="p-6 bg-neutral-900 border border-neutral-700 rounded-lg hover:border-purple-600 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-900/30 rounded-lg group-hover:bg-purple-800/50 transition-colors">
                    <Brain className="size-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">Target Persona</h3>
                    <p className="text-sm text-neutral-400 mb-2">
                      Enable hyper-contextual, emotionally intelligent messaging
                    </p>
                    <p className="text-xs text-neutral-500">
                      Who are we talking to? Demographics, psychographics, and motivations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-950 border border-neutral-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}