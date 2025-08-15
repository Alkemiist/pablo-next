import { DEFAULT_COPY_SPECS, type CopyPlatformKey } from './specs';
import type { CopyPlan, LengthPlan } from './planner';
import OpenAI from 'openai';

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
  platform?: CopyPlatformKey;
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
function draftVariant(
  idea: string,
  tone: string,
  structure: string,
  cta: string,
  platform: CopyPlatformKey | 'generic',
  salt: number = 0,
): string {
  const toneLead: Record<string, string> = {
    playful: 'Fun idea:',
    inspirational: 'Imagine this:',
    authoritative: 'Here’s the truth:',
    witty: 'Hot take:',
    urgent: 'Don’t wait:',
  };

  const structureMap: Record<string, (i: string) => string> = {
    'question-led': (i) => `What if ${i.toLowerCase()}?`,
    'benefit-first': (i) => `${i}: here’s why it matters.`,
    'story-snippet': (i) => `Quick story: ${i}.`,
    'statistic-hook': (i) => `90% agree: ${i}.`,
    contrast: (i) => `Forget the old way. ${i}.`,
  };

  const lead = toneLead[tone] ?? '';
  let rephrased = rewriteIdeaLight(idea, salt);
  rephrased = sanitizeNoVerbatim(idea, rephrased, salt + 1);
  const body = structureMap[structure] ? structureMap[structure](rephrased) : rephrased;
  const closing = ` ${cta}`;
  return `${lead} ${body}${closing}`.replace(/\s+/g, ' ').trim();
}

// Lightweight paraphrase to avoid echoing user text verbatim
function rewriteIdeaLight(idea: string, salt: number = 0): string {
  const keywords = keywordsFromIdea(idea);
  const [k1, k2, k3] = [keywords[0] || 'results', keywords[1] || 'workflow', keywords[2] || 'time'];
  const templates = [
    `Make ${k1} effortless: cut the noise and move faster.`,
    `Turn ${k1} into momentum. ${capitalize(k2)} without the busywork.`,
    `Skip the grind. ${capitalize(k1)} in minutes, not hours.`,
    `From idea to ${k1}: streamlined, simple, done.`,
    `A smarter path to ${k1}: ${k2}, ${k3}, and zero friction.`,
    `Less clutter, more ${k1}. Build progress that sticks.`,
  ];
  const idx = Math.abs(hashString(idea + '|' + salt)) % templates.length;
  return templates[idx];
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h | 0;
}

function keywordsFromIdea(idea: string): string[] {
  const stop = new Set(['the','a','an','and','or','but','to','of','for','with','in','on','at','by','from','that','this','is','are','be','as','it','you','your','our']);
  const words = idea
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stop.has(w));
  const uniq: string[] = [];
  for (const w of words) if (!uniq.includes(w)) uniq.push(w);
  return uniq.slice(0, 5);
}

function containsThreePlusWordSequence(source: string, target: string): boolean {
  const s = normalize(source).split(' ');
  const t = normalize(target);
  for (let i = 0; i < s.length - 2; i++) {
    const seq = `${s[i]} ${s[i + 1]} ${s[i + 2]}`.trim();
    if (seq && t.includes(seq)) return true;
  }
  return false;
}

function sanitizeNoVerbatim(idea: string, text: string, salt: number): string {
  if (!containsThreePlusWordSequence(idea, text) && !normalize(text).includes(normalize(idea))) return text;
  // Rebuild using a different template until it no longer resembles the source
  for (let i = 0; i < 5; i++) {
    const alt = rewriteIdeaLight(idea, salt + i + 1);
    if (!containsThreePlusWordSequence(idea, alt) && !normalize(alt).includes(normalize(idea))) return alt;
  }
  // As a last resort, strip quoted source
  return text.replace(new RegExp(escapeRegExp(idea), 'ig'), '').trim() || rewriteIdeaLight(idea, salt + 99);
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
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

// LLM-backed generator with strict JSON output; falls back to heuristic on failure
export async function generateCopyFromPlanLLM(plan: CopyPlan, options?: { model?: string; temperature?: number }): Promise<GenerateCopyResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    // Fallback to heuristic if no key
    return generateCopyFromPlan(plan);
  }

  const openai = new OpenAI({ apiKey });
  const model = options?.model ?? 'gpt-4o-mini';
  const temperature = options?.temperature ?? 0.4;

  const variantSpecs = plan.variants.map((v) => {
    const spec = DEFAULT_COPY_SPECS[v.platform];
    return {
      id: v.id,
      platform: v.platform,
      tone: v.tone,
      structure: v.structure,
      cta: v.cta,
      maxChars: spec.maxChars,
      notes: spec.notes ?? '',
    };
  });

  const system = `You are a senior copywriter. Generate short-form marketing copy that strictly obeys per-platform character limits and style.
Rules:
- Obey maxChars for each variant. Keep within 0–3 chars of the limit only when necessary.
- Match the requested tone, structure, and call-to-action.
- Respect brand voice and avoid forbidden phrases.
- Output ONLY compact JSON, no extra prose.`;

  const user = {
    idea: plan.idea,
    brand: plan.brand ?? {},
    variants: variantSpecs,
    output_schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          text: { type: 'string' },
        },
        required: ['id', 'text'],
        additionalProperties: false,
      },
    },
    instructions: 'Return JSON array of {id, text} in the same order as provided variants.',
  };

  try {
    const completion = await openai.chat.completions.create({
      model,
      temperature,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: JSON.stringify(user) },
      ],
    });

    const content = completion.choices[0]?.message?.content?.trim() ?? '[]';
    // Extract JSON array safely
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const jsonText = jsonMatch ? jsonMatch[0] : content;
    const arr = JSON.parse(jsonText) as Array<{ id: string; text: string }>;

    // Map back to plan variants order and enforce constraints again
    const byId = new Map(arr.map((x) => [x.id, x.text] as const));
    const variants: CopyVariant[] = plan.variants.map((v) => {
      const spec = DEFAULT_COPY_SPECS[v.platform];
      const raw = byId.get(v.id) ?? draftVariant(plan.idea, v.tone, v.structure, v.cta, v.platform);
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
  } catch (err) {
    // Fallback to heuristic on any LLM/parsing error
    return generateCopyFromPlan(plan);
  }
}

// Length-plan generators (no platforms)
export function generateFromLengthPlan(plan: LengthPlan): GenerateCopyResponse {
  const variants = plan.variants.map((v) => {
    const idx = parseVariantIndex(v.id);
    const raw = draftVariant(plan.idea, v.tone, v.structure, v.cta, 'generic', idx);
    const lenAdjusted = fitToTargetCohesive(raw, v.targetLength ?? v.maxChars, v.cta, idx);
    const enforced = enforceConstraints(lenAdjusted, v.maxChars, plan.brand?.forbidden);
    return {
      id: v.id,
      text: enforced.text,
      tone: v.tone,
      structure: v.structure,
      cta: v.cta,
      charCount: enforced.text.length,
      maxChars: v.maxChars,
      warnings: enforced.warnings,
    };
  });
  return { planId: plan.id, variants };
}

export async function generateFromLengthPlanLLM(plan: LengthPlan, options?: { model?: string; temperature?: number }): Promise<GenerateCopyResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    return generateFromLengthPlan(plan);
  }
  const openai = new OpenAI({ apiKey });
  const model = options?.model ?? 'gpt-4o-mini';
  const temperature = options?.temperature ?? 0.7;

  const variantSpecs = plan.variants.map((v) => ({ id: v.id, tone: v.tone, structure: v.structure, cta: v.cta, maxChars: v.maxChars, targetChars: v.targetLength ?? v.maxChars }));
  const system = `You are an award-winning copywriter. Write organic, crafted short-form copy.
Rules:
- Paraphrase the user's idea. Never copy phrases (no 3+ word sequences) from it.
- Each variant MUST feel different: distinct openings, rhythm, syntax, and imagery.
- Vary rhetorical devices (question, contrast, imperative, metaphor, specificity). Avoid clichés.
- Fit within maxChars. Aim near targetChars if provided.
- No emojis or hashtags. Plain text.
- Output ONLY compact JSON. No commentary.`;
  const user = {
    idea: plan.idea,
    brand: plan.brand ?? {},
    variants: variantSpecs,
    schema: { type: 'array', items: { type: 'object', required: ['id', 'text'] } },
    instructions: 'Return array of {id, text} in same order.',
  };

  try {
    const completion = await openai.chat.completions.create({
      model,
      temperature,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: JSON.stringify(user) },
      ],
    });
    const content = completion.choices[0]?.message?.content?.trim() ?? '[]';
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const jsonText = jsonMatch ? jsonMatch[0] : content;
    const arr = JSON.parse(jsonText) as Array<{ id: string; text: string }>;
    const byId = new Map(arr.map((x) => [x.id, sanitizeNoVerbatim(plan.idea, x.text, parseVariantIndex(x.id))] as const));
    let variants: CopyVariant[] = plan.variants.map((v) => {
      const idx = parseVariantIndex(v.id);
      const raw0 = byId.get(v.id) ?? draftVariant(plan.idea, v.tone, v.structure, v.cta, 'generic', idx);
      const lenAdjusted = fitToTargetCohesive(raw0, v.targetLength ?? v.maxChars, v.cta, idx);
      const enforced = enforceConstraints(lenAdjusted, v.maxChars, plan.brand?.forbidden);
      return {
        id: v.id,
        text: enforced.text,
        tone: v.tone,
        structure: v.structure,
        cta: v.cta,
        charCount: enforced.text.length,
        maxChars: v.maxChars,
        warnings: enforced.warnings,
      };
    });
    // Diversity pass: adjust overly similar openings or high overlap
    variants = diversifyVariants(variants, plan.idea);
    return { planId: plan.id, variants };
  } catch (err) {
    return generateFromLengthPlan(plan);
  }
}

function parseVariantIndex(id: string): number {
  const m = id.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

// Heuristic length fitter that expands or trims to target using synonyms and filler micro-phrases
function fitToTarget(text: string, target: number): string {
  if (text.length === target) return text;
  if (text.length > target) return text.slice(0, Math.max(0, target - 1)) + '…';
  // expand
  const fillers = [
    '— fast',
    '— with ease',
    ' — no hassle',
    ' — built for speed',
    ' — get more done',
    ' — clearer, quicker',
  ];
  let out = text;
  let i = 0;
  while (out.length + 2 < target && i < 20) {
    out += (i % 2 === 0 ? ' ' : '') + fillers[i % fillers.length];
    i++;
  }
  return out.slice(0, Math.min(out.length, target));
}

// Expand or trim without tacking words after the CTA; keep variants cohesive
function fitToTargetCohesive(text: string, target: number, cta?: string, salt: number = 0): string {
  if (target <= 0) return '';
  if (text.length === target) return text;

  // Identify CTA suffix (with optional trailing arrow)
  const arrowRe = /\s*→\s*$/;
  let suffix = '';
  let prefix = text;
  if (cta) {
    const ctaRe = new RegExp(`\\s${escapeRegExp(cta)}(?:\\s*→)?\\s*$`, 'i');
    const m = text.match(ctaRe);
    if (m && m.index !== undefined) {
      prefix = text.slice(0, m.index);
      suffix = text.slice(m.index).replace(/\s+$/, '');
    }
  }

  // If trimming, preserve CTA at the end when possible
  if (text.length > target) {
    if (suffix && suffix.length < target - 3) {
      const roomForPrefix = target - suffix.length - 1; // space before suffix
      const trimmedPrefix = prefix.trim().slice(0, Math.max(0, roomForPrefix - 1)) + '…';
      return `${trimmedPrefix} ${suffix}`.slice(0, target);
    }
    return text.slice(0, Math.max(0, target - 1)) + '…';
  }

  // Expand by enriching the body BEFORE the CTA using short cohesive clauses
  // Each phrase includes its own leading joiner/punctuation to avoid awkward combinations
  const enrichers = [
    ', without the busywork',
    ', with clarity from the start',
    ', built to keep teams moving',
    ' so nothing slows you down',
    ', designed to cut the noise',
    ', for momentum that sticks',
    ', with less friction and more flow',
    ', built for real speed',
    ', focused where it matters',
  ];

  let outPrefix = prefix.trim();
  let composed = suffix ? `${outPrefix} ${suffix}` : outPrefix;
  let attempts = 0;
  const used: number[] = [];
  function canAppend(pfx: string, phrase: string): boolean {
    const lastWord = pfx.trim().split(/\s+/).pop()?.toLowerCase() || '';
    const firstWord = phrase.trim().split(/\s+/)[0]?.toLowerCase() || '';
    if (lastWord && firstWord && lastWord === firstWord) return false; // avoid duplicate junctions like "for for"
    if (lastWord === 'that' && /^so\b/.test(phrase.trim())) return false; // avoid "that so"
    return true;
  }
  while (composed.length + 8 <= target && attempts < 2) { // add up to 2 short clauses
    const idx = (salt + attempts) % enrichers.length;
    if (!used.includes(idx)) {
      const phrase = enrichers[idx];
      if (canAppend(outPrefix, phrase)) {
        const candidatePrefix = `${outPrefix}${phrase}`;
        const candidateFull = suffix ? `${candidatePrefix} ${suffix}` : candidatePrefix;
        if (candidateFull.length <= target) {
          outPrefix = candidatePrefix;
          composed = candidateFull;
          used.push(idx);
          attempts++;
          continue;
        }
      }
    }
    break;
  }
  // Tidy up duplicates and spacing
  composed = composed.replace(/\s{2,}/g, ' ');
  composed = composed.replace(/\s+,/g, ',');
  composed = composed.replace(/,,+/g, ',');
  // Remove immediate duplicate word runs (e.g., "for for")
  composed = composed.replace(/\b(\w+)(\s+\1\b)+/gi, '$1');
  // Avoid ending with dangling joiners
  composed = composed.replace(/\s+(and|to|for|so|that)[\.,]*\s*$/i, '');
  return composed.length <= target ? composed : composed.slice(0, target);
}

function diversifyVariants(list: CopyVariant[], idea: string): CopyVariant[] {
  const seenStarts = new Set<string>();
  return list.map((v, i) => {
    const start = v.text.split(/\s+/).slice(0, 2).join(' ').toLowerCase();
    let text = v.text;
    if (seenStarts.has(start) || containsThreePlusWordSequence(idea, text)) {
      text = organicRewrite(text, i + 1);
      text = sanitizeNoVerbatim(idea, text, i + 7);
    }
    seenStarts.add(start);
    const fitted = fitToTargetCohesive(text, v.maxChars, v.cta, i + 3);
    const enforced = enforceConstraints(fitted, v.maxChars);
    return { ...v, text: enforced.text, charCount: enforced.text.length, warnings: enforced.warnings };
  });
}

function organicRewrite(text: string, salt: number): string {
  // Simple lexical variation and cadence tweaks
  const swaps: Array<[RegExp, string]> = [
    [/fast/gi, 'swift'],
    [/quick/gi, 'rapid'],
    [/easy/gi, 'effortless'],
    [/simple/gi, 'straightforward'],
    [/smart/gi, 'savvy'],
    [/build/gi, 'craft'],
    [/create/gi, 'shape'],
    [/workflow/gi, 'flow'],
    [/results/gi, 'outcomes'],
  ];
  let out = text;
  swaps.forEach(([re, repl], idx) => {
    if ((idx + salt) % 2 === 0) out = out.replace(re, repl);
  });
  const riffs = [
    (s: string) => `Let’s be honest: ${s}`,
    (s: string) => `Here’s the shift: ${s}`,
    (s: string) => `Keep it sharp. ${s}`,
    (s: string) => `Make it matter: ${s}`,
    (s: string) => `No fluff. ${s}`,
  ];
  const r = riffs[salt % riffs.length];
  return r(out);
}


