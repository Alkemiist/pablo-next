export type PlatformKey =
  | 'instagram_feed'
  | 'instagram_reels'
  | 'x_feed'
  | 'facebook_feed'
  | 'youtube_shorts'
  | 'commercial_ctv'
  | 'ooh';

export interface CreateJobRequest {
  brand: {
    id?: string;
    name: string;
    rules?: Record<string, unknown>;
  };
  asset: {
    type: 'copy' | 'image' | 'video';
    url?: string; // for image/video
    text?: string; // for copy
    durationSec?: number; // for video
  };
  platforms?: PlatformKey[];
  variantsPerPlatform?: number;
  seed?: number;
  featureFlags?: Partial<FeatureFlags>;
  dry_run?: boolean;
  webhook_url?: string;
}

export interface CreateJobResponse {
  dryRun?: boolean;
  plan?: Plan;
  estimatedCostUsd?: number;
  id?: string;
}

export interface FeatureFlags {
  enableDebugOverlays: boolean;
  enabledPlatforms: PlatformKey[];
}

export interface PlanEstimate {
  costUsd: number;
  tokens?: number;
  computeSec?: number;
}

export interface Plan {
  id: string;
  brand: CreateJobRequest['brand'];
  asset: CreateJobRequest['asset'];
  platforms: PlatformKey[];
  variantsPerPlatform: number;
  steps: PlanStep[];
  estimate: PlanEstimate;
  seed: number;
}

export interface PlanStep {
  id: string;
  platform: PlatformKey;
  leverSelections: Record<string, unknown>;
  operations: Operation[];
}

export type OperationType =
  | 'copy_variant'
  | 'image_variant'
  | 'video_variant'
  | 'compliance_check'
  | 'package_variant';

export interface Operation {
  type: OperationType;
  params: Record<string, unknown>;
}

export type JobStatus = 'queued' | 'running' | 'succeeded' | 'failed';

export interface JobRecord {
  id: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  plan: Plan;
  progress: Array<{
    stepId: string;
    message: string;
    at: string;
  }>;
  artifacts: Array<{
    platform: PlatformKey;
    variantIndex: number;
    type: 'copy' | 'image' | 'video' | 'manifest';
    url?: string;
    data?: unknown;
  }>;
  receipt?: {
    manifestUrl?: string;
    json?: unknown;
  };
}

export interface ValidationResult {
  valid: boolean;
  issues?: Array<{ code: string; message: string; path?: string[] }>;
}


