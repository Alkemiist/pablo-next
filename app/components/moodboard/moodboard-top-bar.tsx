'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import { Plus, Check, Loader2, Tag, Package, Users, Target } from 'lucide-react';

interface MoodboardTopBarProps {
  brand: string;
  product: string;
  targetAudience: string;
  campaignGoal: string;
  onUpdateBrand: (value: string) => void;
  onUpdateProduct: (value: string) => void;
  onUpdateAudience: (value: string) => void;
  onUpdateGoal: (value: string) => void;
  onGenerate: () => void;
  isLoading?: boolean;
}

export default function MoodboardTopBar({
  brand,
  product,
  targetAudience,
  campaignGoal,
  onUpdateBrand,
  onUpdateProduct,
  onUpdateAudience,
  onUpdateGoal,
  onGenerate,
  isLoading = false,
}: MoodboardTopBarProps) {
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isAudienceOpen, setIsAudienceOpen] = useState(false);
  const [isGoalOpen, setIsGoalOpen] = useState(false);

  const [tempBrand, setTempBrand] = useState(brand);
  const [tempProduct, setTempProduct] = useState(product);
  const [tempAudience, setTempAudience] = useState(targetAudience);
  const [tempGoalIntent, setTempGoalIntent] = useState('');
  const [tempGoalMessage, setTempGoalMessage] = useState('');

  const isCompleted = (value: string) => value.trim().length > 0;

  const saveBrand = () => { onUpdateBrand(tempBrand); setIsBrandOpen(false); };
  const saveProduct = () => { onUpdateProduct(tempProduct); setIsProductOpen(false); };
  const saveAudience = () => { onUpdateAudience(tempAudience); setIsAudienceOpen(false); };
  const saveGoal = () => {
    const goalText = `Intent: ${tempGoalIntent}\nKey Message: ${tempGoalMessage}`.trim();
    onUpdateGoal(goalText);
    setIsGoalOpen(false);
  };

  return (
    <div className=" sticky top-0 z-10 flex items-center px-12 py-3 pt-8 pb-4 bg-slate-950 shadow-lg gap-3">
      {/* Context chips styled like inspo */}
      <button
        className={`flex items-center gap-2 bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors duration-300 cursor-pointer ${isCompleted(brand) ? 'opacity-100' : 'opacity-90'}`}
        onClick={() => { setTempBrand(brand); setIsBrandOpen(true); }}
      >
        <Tag className="w-4 h-4 text-slate-400" />
        {isCompleted(brand) ? brand : 'Set Brand'}
      </button>
      <button
        className={`flex items-center gap-2 bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors duration-300 cursor-pointer ${isCompleted(product) ? 'opacity-100' : 'opacity-90'}`}
        onClick={() => { setTempProduct(product); setIsProductOpen(true); }}
      >
        <Package className="w-4 h-4 text-slate-400" />
        {isCompleted(product) ? product : 'Set Product'}
      </button>
      <button
        className={`flex items-center gap-2 bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors duration-300 cursor-pointer ${isCompleted(targetAudience) ? 'opacity-100' : 'opacity-90'}`}
        onClick={() => { setTempAudience(targetAudience); setIsAudienceOpen(true); }}
      >
        <Users className="w-4 h-4 text-slate-400" />
        {isCompleted(targetAudience) ? 'Audience set' : 'Set Audience'}
      </button>
      <button
        className={`flex items-center gap-2 bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors duration-300 cursor-pointer ${isCompleted(campaignGoal) ? 'opacity-100' : 'opacity-90'}`}
        onClick={() => { setTempGoalIntent(''); setTempGoalMessage(''); setIsGoalOpen(true); }}
      >
        <Target className="w-4 h-4 text-slate-400" />
        {isCompleted(campaignGoal) ? 'Goal set' : 'Set Goal'}
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Generate */}
      <button 
        className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-700 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 cursor-pointer disabled:opacity-50"
        onClick={onGenerate}
        disabled={isLoading || !brand || !product || !targetAudience}
      >
        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Plus className="w-4 h-4" />Generate</>}
      </button>

      {/* Brand Modal */}
      <Modal isOpen={isBrandOpen} onClose={() => setIsBrandOpen(false)} title="Set Brand">
        <div className="space-y-3">
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" value={tempBrand} onChange={(e) => setTempBrand(e.target.value)} placeholder="e.g., Nike, Apple" />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setIsBrandOpen(false)}>Cancel</Button>
            <Button onClick={saveBrand}><Check className="mr-2 h-4 w-4" /> Save</Button>
          </div>
        </div>
      </Modal>

      {/* Product Modal */}
      <Modal isOpen={isProductOpen} onClose={() => setIsProductOpen(false)} title="Set Product/Service">
        <div className="space-y-3">
          <Label htmlFor="product">Product/Service</Label>
          <Input id="product" value={tempProduct} onChange={(e) => setTempProduct(e.target.value)} placeholder="e.g., Air Max sneakers" />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setIsProductOpen(false)}>Cancel</Button>
            <Button onClick={saveProduct}><Check className="mr-2 h-4 w-4" /> Save</Button>
          </div>
        </div>
      </Modal>

      {/* Audience Modal */}
      <Modal isOpen={isAudienceOpen} onClose={() => setIsAudienceOpen(false)} title="Set Target Audience">
        <div className="space-y-3">
          <Label htmlFor="audience">Target Audience</Label>
          <Textarea id="audience" value={tempAudience} onChange={(e) => setTempAudience(e.target.value)} placeholder="Describe your target audience (demographics, psychographics, behaviors)" rows={5} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setIsAudienceOpen(false)}>Cancel</Button>
            <Button onClick={saveAudience}><Check className="mr-2 h-4 w-4" /> Save</Button>
          </div>
        </div>
      </Modal>

      {/* Goal Modal */}
      <Modal isOpen={isGoalOpen} onClose={() => setIsGoalOpen(false)} title="Set Campaign Goal">
        <div className="space-y-3">
          <Label htmlFor="intent">Intent</Label>
          <Input id="intent" value={tempGoalIntent} onChange={(e) => setTempGoalIntent(e.target.value)} placeholder="e.g., Brand awareness, Conversion" />
          <Label htmlFor="keymsg">Key Message</Label>
          <Textarea id="keymsg" value={tempGoalMessage} onChange={(e) => setTempGoalMessage(e.target.value)} placeholder="What is the main message?" rows={4} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setIsGoalOpen(false)}>Cancel</Button>
            <Button onClick={saveGoal}><Check className="mr-2 h-4 w-4" /> Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


