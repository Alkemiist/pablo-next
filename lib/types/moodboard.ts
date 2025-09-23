export interface Moodboard {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  images: string[];
  mood: string;
  style: string;
  briefEssentials: {
    campaignGoal: string;
    targetAudience: string;
    keyMessage: string;
    brandPersonality: string;
    kpis: string[];
    channels: string[];
  };
  motionInteraction: {
    transitions: string[];
    pacing: string[];
    interactions: string[];
    aspectRatios: string[];
    platformVariations: string[];
  };
  accessibilityInclusivity: {
    contrastTargets: string[];
    legibilityRules: string[];
    inclusiveDesign: string[];
    altTextCues: string[];
    safeAreaChecks: string[];
  };
  productionNotes: {
    exportSpecs: string[];
    fileNaming: string[];
    deliveryRequirements: string[];
    handoffLinks: string[];
    licensing: string[];
    riskFlags: string[];
  };
}

export interface MoodboardRequest {
  name: string;
  description: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  images: string[];
  mood: string;
  style: string;
  briefEssentials: {
    campaignGoal: string;
    targetAudience: string;
    keyMessage: string;
    brandPersonality: string;
    kpis: string[];
    channels: string[];
  };
  motionInteraction: {
    transitions: string[];
    pacing: string[];
    interactions: string[];
    aspectRatios: string[];
    platformVariations: string[];
  };
  accessibilityInclusivity: {
    contrastTargets: string[];
    legibilityRules: string[];
    inclusiveDesign: string[];
    altTextCues: string[];
    safeAreaChecks: string[];
  };
  productionNotes: {
    exportSpecs: string[];
    fileNaming: string[];
    deliveryRequirements: string[];
    handoffLinks: string[];
    licensing: string[];
    riskFlags: string[];
  };
}
