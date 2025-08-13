import { DEFAULT_PLATFORM_RULES } from './platform-specs';
import type { PlatformKey, Plan, PlanStep } from './types';

function seededRandom(seed: number) {
  let s = seed >>> 0;
  return function rng() {
    // xorshift32
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 0xffffffff;
  };
}

function pick<T>(arr: T[], rng: () => number) {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

const PLATFORM_DEFAULTS: PlatformKey[] = [
  'instagram_feed',
  'instagram_reels',
  'x_feed',
  'facebook_feed',
  'youtube_shorts',
  'commercial_ctv',
  'ooh',
];

export function createPlan(params: {
  brand: Plan['brand'];
  asset: Plan['asset'];
  platforms?: PlatformKey[];
  variantsPerPlatform: number;
  seed: number;
  featureFlags?: { enabledPlatforms?: PlatformKey[] };
}): Plan {
  const { brand, asset, variantsPerPlatform, seed } = params;
  const enabled = params.featureFlags?.enabledPlatforms ?? params.platforms ?? PLATFORM_DEFAULTS;
  const platforms = enabled.filter((p) => p in DEFAULT_PLATFORM_RULES);

  const rng = seededRandom(seed);
  const steps: PlanStep[] = [];

  for (const platform of platforms) {
    for (let i = 0; i < variantsPerPlatform; i++) {
      const leverSelections = buildLeverSelections(platform, asset.type, rng);
      const operations = buildOperations(platform, asset.type, leverSelections);
      steps.push({
        id: `${platform}-${i + 1}`,
        platform,
        leverSelections,
        operations,
      });
    }
  }

  const estimate = estimateCost({ assetType: asset.type, totalVariants: steps.length });

  return {
    id: `plan_${Date.now()}_${Math.floor(rng() * 1e6)}`,
    brand,
    asset,
    platforms,
    variantsPerPlatform,
    steps,
    estimate,
    seed,
  };
}

function buildLeverSelections(platform: PlatformKey, assetType: 'copy' | 'image' | 'video', rng: () => number) {
  const copyAngles = ['benefit-led', 'social-proof', 'urgency', 'curiosity', 'comparison'];
  const tones = ['direct', 'playful', 'premium', 'friendly', 'bold'];
  const ctas = ['Shop now', 'Learn more', 'Try free', 'Get started', 'See how'];
  const hashtags = [['#ad'], ['#new'], ['#sale'], ['#trending'], ['#musthave']];

  const layout = ['centered', 'rule-of-thirds', 'close-up', 'wide', 'diagonal'];
  const colorway = ['brand-core', 'high-contrast', 'mono', 'warm', 'cool'];
  const overlay = ['none', 'light', 'medium', 'strong'];

  const openingHook = ['fast-cut', 'hero-shot', 'problem-first', 'visual-surprise'];
  const endCard = ['logo-left', 'logo-right', 'center-lockup'];
  const captionStyle = ['burn-in', 'native'];

  const selection: Record<string, unknown> = {};

  if (assetType === 'copy') {
    selection.copyAngle = pick(copyAngles, rng);
    selection.tone = pick(tones, rng);
    selection.cta = pick(ctas, rng);
    selection.hashtags = pick(hashtags, rng);
  }
  if (assetType === 'image') {
    selection.layout = pick(layout, rng);
    selection.colorway = pick(colorway, rng);
    selection.overlay = pick(overlay, rng);
    selection.cta = pick(ctas, rng);
  }
  if (assetType === 'video') {
    selection.openingHook = pick(openingHook, rng);
    selection.endCard = pick(endCard, rng);
    selection.captionStyle = pick(captionStyle, rng);
  }

  // platform-specific constraints can adjust selections (simplified)
  if (platform === 'instagram_reels' || platform === 'youtube_shorts') {
    selection.aspect = '9:16';
  }
  if (platform === 'commercial_ctv') {
    selection.aspect = '16:9';
    selection.trim = pick([':06', ':15', ':30'], rng);
  }

  return selection;
}

function buildOperations(platform: PlatformKey, assetType: 'copy' | 'image' | 'video', leverSelections: Record<string, unknown>) {
  const ops: PlanStep['operations'] = [];
  if (assetType === 'copy') ops.push({ type: 'copy_variant', params: { platform, leverSelections } });
  if (assetType === 'image') ops.push({ type: 'image_variant', params: { platform, leverSelections } });
  if (assetType === 'video') ops.push({ type: 'video_variant', params: { platform, leverSelections } });
  ops.push({ type: 'compliance_check', params: { platform } });
  ops.push({ type: 'package_variant', params: { platform } });
  return ops;
}

function estimateCost(params: { assetType: 'copy' | 'image' | 'video'; totalVariants: number }) {
  const base = { copy: 0.001, image: 0.01, video: 0.05 } as const; // rough unit costs
  const costUsd = Math.round(params.totalVariants * base[params.assetType] * 100) / 100;
  return { costUsd };
}


