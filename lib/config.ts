// Configuration for image generation models
export const IMAGE_GENERATION_CONFIG = {
  // Primary model to use for image generation
  PRIMARY_MODEL: "gpt-image-1" as const,
  
  // Fallback model if primary fails
  FALLBACK_MODEL: "dall-e-3" as const,
  
  // Model-specific parameters
  MODELS: {
    "gpt-image-1": {
      size: "1024x1024" as const,
      response_format: "b64_json" as const,
      // gpt-image-1 specific parameters
    },
    "dall-e-3": {
      size: "1792x1024" as const,
      quality: "hd" as const,
      style: "natural" as const,
      response_format: "b64_json" as const,
      // dall-e-3 specific parameters
    }
  }
} as const;

// Helper function to get model parameters
export function getModelParams(model: string) {
  return IMAGE_GENERATION_CONFIG.MODELS[model as keyof typeof IMAGE_GENERATION_CONFIG.MODELS] || IMAGE_GENERATION_CONFIG.MODELS["gpt-image-1"];
}

// Helper function to check if a model is available
export function isModelAvailable(model: string): boolean {
  return model in IMAGE_GENERATION_CONFIG.MODELS;
}
