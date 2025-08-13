import type { PlatformKey } from './types';

type Dimension = { width: number; height: number };

export type PlatformRule = {
  kind: 'image' | 'video' | 'copy';
  dimensions?: Dimension | Dimension[];
  aspectRatio?: string | string[];
  durationSecMax?: number;
  captionCharsMax?: number;
  captionPrimaryCharsMax?: number; // facebook primary
  hashtagsMax?: number;
  altTextRequired?: boolean;
  safeAreas?: Array<{ topPct?: number; bottomPct?: number; leftPct?: number; rightPct?: number }>;
  notes?: string; // for debug overlays only
};

// Default, tenant-overridable platform rules
export const DEFAULT_PLATFORM_RULES: Record<PlatformKey, PlatformRule[]> = {
  instagram_feed: [
    {
      kind: 'image',
      dimensions: { width: 1080, height: 1350 },
      aspectRatio: '4:5',
      altTextRequired: true,
      captionCharsMax: 2200,
      notes: 'Hard focus first 125 chars',
    },
  ],
  instagram_reels: [
    {
      kind: 'video',
      aspectRatio: '9:16',
      durationSecMax: 30,
      notes: 'Burned-in captions if speech',
      safeAreas: [{ topPct: 0.1, bottomPct: 0.1 }],
    },
  ],
  x_feed: [
    {
      kind: 'image',
      dimensions: { width: 1200, height: 675 },
      aspectRatio: '16:9',
    },
    { kind: 'copy', captionCharsMax: 280, hashtagsMax: 2 },
  ],
  facebook_feed: [
    {
      kind: 'image',
      dimensions: [
        { width: 1200, height: 628 },
        { width: 1080, height: 1080 },
      ],
      aspectRatio: ['1:1', '1.91:1'],
    },
    { kind: 'copy', captionPrimaryCharsMax: 125 },
  ],
  youtube_shorts: [
    {
      kind: 'video',
      aspectRatio: '9:16',
      durationSecMax: 60,
      safeAreas: [{ topPct: 0.12, bottomPct: 0.12 }],
    },
  ],
  commercial_ctv: [
    {
      kind: 'video',
      dimensions: { width: 1920, height: 1080 },
      aspectRatio: '16:9',
      durationSecMax: 30,
      notes: ':06/:15/:30 trims; end-card required',
    },
  ],
  ooh: [
    {
      kind: 'image',
      dimensions: { width: 1920, height: 1080 },
      aspectRatio: '16:9',
      notes: 'Max 6 words, extreme contrast, logo >=2% width',
    },
  ],
};


