# Image Generation Model Setup

This document explains how to configure and use different image generation models in your Next.js application.

## Current Configuration

The application is configured to use **`gpt-image-1`** as the primary image generation model, with **`dall-e-3`** as a fallback.

## Configuration File

The image generation models are configured in `lib/config.ts`:

```typescript
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
    },
    "dall-e-3": {
      size: "1792x1024" as const,
      quality: "hd" as const,
      style: "natural" as const,
      response_format: "b64_json" as const,
    }
  }
} as const;
```

## How It Works

1. **Primary Model**: The application first attempts to use `gpt-image-1`
2. **Fallback**: If `gpt-image-1` fails, it automatically falls back to `dall-e-3`
3. **Error Handling**: Comprehensive logging shows which model was used and why fallbacks occurred

## API Routes

### `/api/generate-tactics`
- Generates marketing tactics with images
- Uses `gpt-image-1` by default
- Falls back to `dall-e-3` if needed

### `/api/generate`
- General content generation endpoint
- Accepts a `model` parameter to specify which model to use
- Defaults to `gpt-image-1` if no model specified

## Troubleshooting

### If `gpt-image-1` is not working:

1. **Check API Access**: Ensure your OpenAI API key has access to `gpt-image-1`
2. **Check Console Logs**: Look for error messages in the browser console and server logs
3. **Model Availability**: `gpt-image-1` might not be available in all API tiers

### Common Error Messages:

- **"model_not_found"**: The model is not available with your current API access
- **"rate_limit_exceeded"**: You've hit your API rate limits
- **"quota_exceeded"**: You've exceeded your API usage quota

### Fallback Behavior:

The application automatically falls back to `dall-e-3` when:
- `gpt-image-1` is not available
- `gpt-image-1` encounters an error
- API calls to `gpt-image-1` fail

## Changing Models

To change the primary model, edit `lib/config.ts`:

```typescript
export const IMAGE_GENERATION_CONFIG = {
  PRIMARY_MODEL: "dall-e-3" as const, // Change this line
  // ... rest of config
}
```

## Environment Variables

Ensure you have the following environment variable set:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

## Testing

To test the image generation:

1. Navigate to the inspiration creation page
2. Fill in all required fields (brand, product, persona, goal, visual guide)
3. Click "Imagine" to generate tactics
4. Check the browser console and server logs for model usage information

## Logging

The application provides detailed logging for debugging:

- 🚀 Model selection and usage
- ✅ Successful generations
- ❌ Failed attempts
- 🔄 Fallback behavior
- 📊 Generation summaries

Check both browser console and server logs for complete debugging information.
