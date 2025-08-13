export type CopyPlatformKey =
  | 'instagram_caption'
  | 'x_post'
  | 'youtube_shorts_desc'
  | 'medium_intro';

export type CopyPlatformSpec = {
  key: CopyPlatformKey;
  maxChars: number;
  notes?: string;
  hashtagsMax?: number;
  focusChars?: number; // for front-loading impact (e.g., IG first 125)
};

export const DEFAULT_COPY_SPECS: Record<CopyPlatformKey, CopyPlatformSpec> = {
  instagram_caption: {
    key: 'instagram_caption',
    maxChars: 2200,
    focusChars: 125,
    notes: 'Front-load first 125 chars for impact',
  },
  x_post: {
    key: 'x_post',
    maxChars: 280,
    hashtagsMax: 2,
    notes: 'Use hashtags sparingly',
  },
  youtube_shorts_desc: {
    key: 'youtube_shorts_desc',
    maxChars: 150,
    notes: 'Concise, keyword-rich description',
  },
  medium_intro: {
    key: 'medium_intro',
    maxChars: 600,
    notes: 'Narrative tone; can be longer intro copy',
  },
};

export const TONES = ['playful', 'inspirational', 'authoritative', 'witty', 'urgent'] as const;
export const STRUCTURES = ['question-led', 'benefit-first', 'story-snippet', 'statistic-hook', 'contrast'] as const;
export const CTAS = ['Shop now', 'Learn more', 'Subscribe', 'Join us', 'Discover more'] as const;


