'use client';

import { Moodboard } from '@/lib/types/moodboard';
import { Palette, Type, Image as ImageIcon, Play, FileText, Users, Shield, Settings } from 'lucide-react';

interface MoodboardDisplayProps {
  moodboard: Moodboard;
}

export default function MoodboardDisplay({ moodboard }: MoodboardDisplayProps) {

  const toArray = (value: unknown): string[] => {
    if (Array.isArray(value)) return value.filter(Boolean).map(String);
    if (typeof value === 'string' && value.trim().length > 0) return [value];
    if (value == null) return [];
    try { return [String(value)]; } catch { return []; }
  };

  const renderList = (itemsInput: unknown, className = '') => {
    const items = toArray(itemsInput);
    if (!items.length) return <p className="text-slate-500">No data</p>;
    return (
      <ul className={`space-y-1 ${className}`}>
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="text-blue-400 mr-2">•</span>
            <span className="text-slate-300">{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  const renderColorPalette = (paletteInput: any) => {
    const name = paletteInput?.name ?? 'Palette';
    const colors = toArray(paletteInput?.colors);
    const usage = paletteInput?.usage ?? '';
    return (
      <div key={name} className="bg-slate-800 p-4 rounded-lg">
        <h4 className="font-semibold text-white mb-2">{name}</h4>
        <div className="flex gap-2 mb-2">
          {colors.map((color, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full border border-green-800/30"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
          {!colors.length && <span className="text-slate-500">No swatches</span>}
        </div>
        {usage && <p className="text-sm text-slate-400">{usage}</p>}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-green-800/30 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold text-white">Marketing Campaign Moodboard</h1>
        <p className="text-slate-300 mt-2">{moodboard.briefEssentials.campaignGoal}</p>
      </div>

      {/* Brief Essentials */}
      <div className="bg-slate-900 border border-green-800/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 neon-icon" />
          <h2 className="text-xl font-semibold text-white">Brief Essentials</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Campaign Goal</h3>
              <p className="text-slate-300">{moodboard.briefEssentials.campaignGoal}</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Target Audience</h3>
              <p className="text-slate-300">{moodboard.briefEssentials.targetAudience}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Key Message</h3>
            <p className="text-slate-300">{moodboard.briefEssentials.keyMessage}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">KPIs</h3>
              {renderList(moodboard.briefEssentials.kpis)}
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Channels</h3>
              {renderList(moodboard.briefEssentials.channels)}
            </div>
          </div>
        </div>
      </div>

      {/* Brand Guardrails */}
      <div className="bg-slate-900 border border-green-800/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 neon-icon" />
          <h2 className="text-xl font-semibold text-white">Brand Guardrails</h2>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Logo Usage</h3>
              {renderList((moodboard as any).brandGuardrails?.logoUse)}
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Voice & Tone</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-green-400 font-medium">Adjectives:</span>
                  <p className="text-slate-300">{toArray((moodboard as any).brandGuardrails?.voiceTone?.adjectives ?? (moodboard as any).brandGuardrails?.voiceTone).join(', ') || '—'}</p>
                </div>
                <div>
                  <span className="text-green-400 font-medium">Examples:</span>
                  {renderList((moodboard as any).brandGuardrails?.voiceTone?.examples, 'mt-2')}
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Do's & Don'ts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-green-400 font-medium mb-2">✓ Do</h4>
                {renderList((moodboard as any).brandGuardrails?.doDont?.do ?? (moodboard as any).brandGuardrails?.doDontGuidelines)}
              </div>
              <div>
                <h4 className="text-red-400 font-medium mb-2">✗ Don't</h4>
                {renderList((moodboard as any).brandGuardrails?.doDont?.dont)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Creative Directions */}
      <div className="bg-slate-900 border border-green-800/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-5 h-5 neon-icon" />
          <h2 className="text-xl font-semibold text-white">Creative Directions</h2>
        </div>
        <div className="space-y-6">
          {Array.isArray((moodboard as any).creativeDirections) && (moodboard as any).creativeDirections.map((direction: any, index: number) => (
            <div key={index} className="bg-slate-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">{direction.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-300 mb-2">Hypothesis</h4>
                  <p className="text-slate-300">{direction.hypothesis}</p>
                </div>
                <div>
                  <h4 className="font-medium text-blue-300 mb-2">Visual Style</h4>
                  <p className="text-slate-300">{direction.visualStyle}</p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium text-blue-300 mb-2">Adjectives</h4>
                <div className="flex flex-wrap gap-2">
                  {toArray(direction.adjectives).map((adj, adjIndex) => (
                    <span key={adjIndex} className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm">
                      {adj}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium text-blue-300 mb-2">Sample Comps</h4>
                {renderList(direction.sampleComps)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual System */}
      <div className="bg-slate-900 border border-green-800/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Type className="w-5 h-5 neon-icon" />
          <h2 className="text-xl font-semibold text-white">Visual System</h2>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-white mb-3">Color Palettes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray((moodboard as any).visualSystem?.colorPalettes) 
                ? (moodboard as any).visualSystem.colorPalettes.map(renderColorPalette)
                : renderList((moodboard as any).visualSystem?.colorPalettes)}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Typography</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-orange-400 font-medium">Headings:</span>
                  <p className="text-slate-300">{(moodboard as any).visualSystem?.typeStacks?.heading ?? '—'}</p>
                </div>
                <div>
                  <span className="text-orange-400 font-medium">Body:</span>
                  <p className="text-slate-300">{(moodboard as any).visualSystem?.typeStacks?.body ?? '—'}</p>
                </div>
                <div>
                  <span className="text-orange-400 font-medium">Caption:</span>
                  <p className="text-slate-300">{(moodboard as any).visualSystem?.typeStacks?.caption ?? '—'}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Grid & Layout</h3>
              {renderList((moodboard as any).visualSystem?.gridLayout)}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Iconography & Shapes</h3>
              {renderList([...(toArray((moodboard as any).visualSystem?.iconography)), ...(toArray((moodboard as any).visualSystem?.shapes))])}
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Textures & Lighting</h3>
              {renderList([...(toArray((moodboard as any).visualSystem?.textures)), ...(toArray((moodboard as any).visualSystem?.lighting))])}
            </div>
          </div>
        </div>
      </div>

      {/* Imagery */}
      <div className="bg-slate-900 border border-green-800/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <ImageIcon className="w-5 h-5 neon-icon" />
          <h2 className="text-xl font-semibold text-white">Imagery</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Photography References</h3>
              {renderList((moodboard as any).imagery?.photographyRefs)}
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Illustration Styles</h3>
              {renderList((moodboard as any).imagery?.illustrationStyles)}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Stock & UGC Notes</h3>
              {renderList((moodboard as any).imagery?.stockUgcNotes)}
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Diversity & Representation</h3>
              {renderList((moodboard as any).imagery?.diversityRepresentation)}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Usage Rights</h3>
            {renderList((moodboard as any).imagery?.usageRights)}
          </div>
        </div>
      </div>

      {/* Motion & Interaction */}
      <div className="bg-slate-900 border border-green-800/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Play className="w-5 h-5 neon-icon" />
          <h2 className="text-xl font-semibold text-white">Motion & Interaction</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Transitions</h3>
              {renderList(moodboard.motionInteraction.transitions)}
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Pacing</h3>
              <p className="text-slate-300">{moodboard.motionInteraction.pacing}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Micro-interactions</h3>
              {renderList(moodboard.motionInteraction.interactions)}
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">AR/3D Notes</h3>
              {renderList(moodboard.motionInteraction.interactions)}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Aspect Ratios</h3>
              {renderList(moodboard.motionInteraction.aspectRatios)}
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Platform Variations</h3>
              {renderList(moodboard.motionInteraction.platformVariations)}
            </div>
          </div>
        </div>
      </div>

      {/* Copy Cues */}
      <div className="bg-slate-900 border border-green-800/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 neon-icon" />
          <h2 className="text-xl font-semibold text-white">Copy Cues</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Headlines</h3>
              {renderList((moodboard as any).copyCues?.headlines)}
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Taglines</h3>
              {renderList((moodboard as any).copyCues?.taglines)}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">CTA Patterns</h3>
              {renderList((moodboard as any).copyCues?.ctaPatterns)}
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Voice Examples</h3>
              {renderList((moodboard as any).copyCues?.voiceExamples)}
            </div>
          </div>
        </div>
      </div>

      {/* References & Competitors */}
      <div className="bg-slate-900 border border-green-800/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-5 h-5 neon-icon" />
          <h2 className="text-xl font-semibold text-white">References & Competitors</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Inspiration Links</h3>
              {renderList((moodboard as any).referencesCompetitors?.inspirationLinks)}
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Competitor Analysis</h3>
              <p className="text-slate-300">{(moodboard as any).referencesCompetitors?.competitorAnalysis ?? '—'}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Differentiation Notes</h3>
            <p className="text-slate-300">{(moodboard as any).referencesCompetitors?.differentiationNotes ?? '—'}</p>
          </div>
        </div>
      </div>

      {/* Accessibility & Inclusivity */}
      <div className="bg-slate-900 border border-green-800/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 neon-icon" />
          <h2 className="text-xl font-semibold text-white">Accessibility & Inclusivity</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Contrast Targets</h3>
              {renderList(moodboard.accessibilityInclusivity.contrastTargets)}
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Legibility Rules</h3>
              {renderList(moodboard.accessibilityInclusivity.legibilityRules)}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Alt-Text Cues</h3>
              {renderList(moodboard.accessibilityInclusivity.altTextCues)}
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Safe Area Checks</h3>
              {renderList(moodboard.accessibilityInclusivity.safeAreaChecks)}
            </div>
          </div>
        </div>
      </div>

      {/* Production Notes */}
      <div className="bg-slate-900 border border-green-800/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-5 h-5 neon-icon" />
          <h2 className="text-xl font-semibold text-white">Production Notes</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Export Specs</h3>
              {renderList(moodboard.productionNotes.exportSpecs)}
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">File Naming</h3>
              {renderList(moodboard.productionNotes.fileNaming)}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Handoff Links</h3>
              {renderList(moodboard.productionNotes.handoffLinks)}
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Licensing</h3>
              {renderList(moodboard.productionNotes.licensing)}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Risk Flags</h3>
            {renderList(moodboard.productionNotes.riskFlags)}
          </div>
        </div>
      </div>
      
      {/* Governance */}
      <div className="bg-slate-900 border border-green-800/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-5 h-5 neon-icon" />
          <h2 className="text-xl font-semibold text-white">Governance</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold text-white mb-2">Version</h3>
              <p className="text-slate-300">{(moodboard as any).governance?.version ?? 'v1.0'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Status</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                ((moodboard as any).governance?.status ?? 'draft') === 'approved' ? 'bg-green-900/30 text-green-300' :
                ((moodboard as any).governance?.status ?? 'draft') === 'review' ? 'bg-yellow-900/30 text-yellow-300' :
                'bg-slate-700 text-slate-300'
              }`}>
                {(moodboard as any).governance?.status ?? 'draft'}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Last Updated</h3>
              <p className="text-slate-300">{new Date((moodboard as any).governance?.lastUpdated ?? new Date().toISOString()).toLocaleDateString()}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Approvers</h3>
            {renderList((moodboard as any).governance?.approvers)}
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Decision Log</h3>
            {renderList((moodboard as any).governance?.decisionLog)}
          </div>
        </div>
      </div>
    </div>
  );
}
