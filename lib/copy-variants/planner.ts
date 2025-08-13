import { CTAS, DEFAULT_COPY_SPECS, STRUCTURES, TONES, type CopyPlatformKey } from './specs';

export type CopyPlan = {
  id: string;
  idea: string;
  brand?: {
    voice?: string;
    forbidden?: string[];
    notes?: string[];
  };
  platforms: CopyPlatformKey[];
  variants: Array<{
    id: string;
    platform: CopyPlatformKey;
    tone: typeof TONES[number];
    structure: typeof STRUCTURES[number];
    cta: string;
    maxChars: number;
  }>;
};

function seededRandom(seed: number) {
  let s = seed >>> 0;
  return function rng() {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 0xffffffff;
  };
}

function pick<T>(arr: readonly T[], rng: () => number) {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

export function planCopyVariants(params: {
  idea: string;
  brand?: CopyPlan['brand'];
  platforms?: CopyPlatformKey[];
  seed?: number;
  totalVariants?: number; // default 10
}): CopyPlan {
  const seed = params.seed ?? 42;
  const rng = seededRandom(seed);
  const platforms = params.platforms ?? (Object.keys(DEFAULT_COPY_SPECS) as CopyPlatformKey[]);
  const totalVariants = params.totalVariants ?? 10;

  // Round-robin platforms to hit totalVariants; ensure diverse tone/structure
  const variants: CopyPlan['variants'] = [];
  let i = 0;
  while (variants.length < totalVariants) {
    const platform = platforms[i % platforms.length];
    const spec = DEFAULT_COPY_SPECS[platform];
    const tone = pick(TONES, rng);
    const structure = pick(STRUCTURES, rng);
    const cta = pick(CTAS, rng);
    variants.push({
      id: `${platform}-${variants.length + 1}`,
      platform,
      tone,
      structure,
      cta,
      maxChars: spec.maxChars,
    });
    i++;
  }

  return {
    id: `copy_plan_${Date.now()}`,
    idea: params.idea,
    brand: params.brand,
    platforms,
    variants,
  };
}

// Length-based planner (no platforms) — selects 10 diverse tone/structure/CTA combos
export type LengthPlan = {
  id: string;
  idea: string;
  brand?: CopyPlan['brand'];
  maxChars: number;
  variants: Array<{
    id: string;
    tone: typeof TONES[number];
    structure: typeof STRUCTURES[number];
    cta: string;
    maxChars: number;
    targetLength: number;
  }>;
};

export function planCopyVariantsByLength(params: {
  idea: string;
  brand?: CopyPlan['brand'];
  maxChars: number;
  seed?: number;
  totalVariants?: number;
}): LengthPlan {
  const seed = params.seed ?? 42;
  const rng = seededRandom(seed);
  const totalVariants = params.totalVariants ?? 40;
  const variants: LengthPlan['variants'] = [];
  for (let i = 0; i < totalVariants; i++) {
    const offset = sampleLengthOffsetTight(rng); // around 1–2, within ~0–5
    const targetLength = Math.max(0, params.maxChars - offset);
    variants.push({
      id: `len-${i + 1}`,
      tone: pick(TONES, rng),
      structure: pick(STRUCTURES, rng),
      cta: pick(CTAS, rng),
      maxChars: params.maxChars,
      targetLength,
    });
  }
  return {
    id: `copy_len_plan_${Date.now()}`,
    idea: params.idea,
    brand: params.brand,
    maxChars: params.maxChars,
    variants,
  };
}

// Tighter offsets near the max to push variants close to limit (0..5, mean ~2)
function sampleLengthOffsetTight(rng: () => number): number {
  const u = (rng() + rng() + rng()) / 3; // bell-shaped in [0,1]
  const offset = Math.round(u * 5); // 0..5
  return offset;
}


