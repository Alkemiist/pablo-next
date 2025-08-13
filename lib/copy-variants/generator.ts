import { DEFAULT_COPY_SPECS, type CopyPlatformKey } from './specs';
import type { CopyPlan } from './planner';

export type GenerateCopyRequest = {
  idea: string;
  brand?: {
    voice?: string;
    forbidden?: string[];
    notes?: string[];
  };
  platforms?: CopyPlatformKey[];
  seed?: number;
};

export type CopyVariant = {
  id: string;
  platform: CopyPlatformKey;
  text: string;
  tone: string;
  structure: string;
  cta: string;
  charCount: number;
  maxChars: number;
  warnings?: string[];
};

export type GenerateCopyResponse = {
  planId: string;
  variants: CopyVariant[];
};

function enforceConstraints(text: string, specMax: number, forbidden?: string[]): { text: string; warnings: string[] } {
  const warnings: string[] = [];
  let out = text.trim();
  if (out.length > specMax) {
    out = out.slice(0, specMax - 1) + '…';
    warnings.push(`Truncated to max ${specMax} chars`);
  }
  if (forbidden && forbidden.length) {
    for (const f of forbidden) {
      const re = new RegExp(`\\b${escapeRegExp(f)}\\b`, 'i');
      if (re.test(out)) warnings.push(`Contains forbidden phrase: "${f}"`);
    }
  }
  if (specMax - out.length <= 3) warnings.push('Within 3 chars of limit');
  return { text: out, warnings };
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
}

// For MVP, generate copy heuristically without external API
function draftVariant(idea: string, tone: string, structure: string, cta: string, platform: CopyPlatformKey): string {
  const toneLead: Record<string, string> = {
    playful: 'Fun idea:',
    inspirational: 'Imagine this:',
    authoritative: 'Here’s the truth:',
    witty: 'Hot take:',
    urgent: 'Don’t wait:',
  };

  const structureMap: Record<string, (i: string) => string> = {
    'question-led': (i) => `What if ${i.toLowerCase()}?`,
    'benefit-first': (i) => `${i} — here’s why it matters.`,
    'story-snippet': (i) => `Quick story: ${i}.`,
    'statistic-hook': (i) => `90% agree: ${i}.`,
    contrast: (i) => `Forget the old way. ${i}.`,
  };

  const lead = toneLead[tone] ?? '';
  const body = structureMap[structure] ? structureMap[structure](idea) : idea;
  const closing = platform === 'x_post' ? ` ${cta}` : ` ${cta} →`;
  return `${lead} ${body}${closing}`.replace(/\s+/g, ' ').trim();
}

export function generateCopyFromPlan(plan: CopyPlan): GenerateCopyResponse {
  const variants = plan.variants.map((v) => {
    const spec = DEFAULT_COPY_SPECS[v.platform];
    const raw = draftVariant(plan.idea, v.tone, v.structure, v.cta, v.platform);
    const enforced = enforceConstraints(raw, spec.maxChars, plan.brand?.forbidden);
    return {
      id: v.id,
      platform: v.platform,
      text: enforced.text,
      tone: v.tone,
      structure: v.structure,
      cta: v.cta,
      charCount: enforced.text.length,
      maxChars: spec.maxChars,
      warnings: enforced.warnings,
    };
  });
  return { planId: plan.id, variants };
}


