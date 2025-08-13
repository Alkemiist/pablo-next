// Moodboard interfaces for professional marketing campaigns

export interface MoodboardRequest {
  brand: string;
  product: string;
  targetAudience: string;
  campaignGoal?: string;
  industry?: string;
}

export interface BriefEssentials {
  campaignGoal: string;
  audience: string;
  keyMessage: string;
  kpis: string[];
  channels: string[];
}

export interface BrandGuardrails {
  logoUse: string[];
  colors: {
    primary: string[];
    secondary: string[];
    accent: string[];
  };
  typography: {
    headings: string[];
    body: string[];
    display: string[];
  };
  voiceTone: {
    adjectives: string[];
    examples: string[];
  };
  doDont: {
    do: string[];
    dont: string[];
  };
}

export interface CreativeDirection {
  name: string;
  hypothesis: string;
  adjectives: string[];
  sampleComps: string[];
  visualStyle: string;
}

export interface VisualSystem {
  colorPalettes: {
    name: string;
    colors: string[];
    usage: string;
  }[];
  typeStacks: {
    heading: string;
    body: string;
    caption: string;
  };
  gridLayout: string[];
  iconography: string[];
  shapes: string[];
  textures: string[];
  lighting: string[];
  compositionRules: string[];
}

export interface Imagery {
  photographyRefs: string[];
  illustrationStyles: string[];
  stockUgcNotes: string[];
  diversityRepresentation: string[];
  usageRights: string[];
}

export interface MotionInteraction {
  transitions: string[];
  pacing: string;
  microInteractions: string[];
  ar3dNotes: string[];
  aspectRatios: string[];
  platformVariations: string[];
}

export interface CopyCues {
  headlines: string[];
  taglines: string[];
  ctaPatterns: string[];
  voiceExamples: string[];
}

export interface ReferencesCompetitors {
  inspirationLinks: string[];
  competitorScreenshots: string[];
  differentiationNotes: string[];
}

export interface AccessibilityInclusivity {
  contrastTargets: string[];
  legibilityRules: string[];
  altTextCues: string[];
  safeAreaChecks: string[];
}

export interface ProductionNotes {
  exportSpecs: string[];
  fileNaming: string[];
  handoffLinks: string[];
  licensing: string[];
  riskFlags: string[];
}

export interface Governance {
  version: string;
  status: 'draft' | 'review' | 'approved' | 'final';
  approvers: string[];
  decisionLog: string[];
  lastUpdated: string;
}

export interface Moodboard {
  id: string;
  briefEssentials: BriefEssentials;
  brandGuardrails: BrandGuardrails;
  creativeDirections: CreativeDirection[];
  visualSystem: VisualSystem;
  imagery: Imagery;
  motionInteraction: MotionInteraction;
  copyCues: CopyCues;
  referencesCompetitors: ReferencesCompetitors;
  accessibilityInclusivity: AccessibilityInclusivity;
  productionNotes: ProductionNotes;
  governance: Governance;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateMoodboardResponse {
  success: boolean;
  moodboard: Moodboard;
  error?: string;
}
