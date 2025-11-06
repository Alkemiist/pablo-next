/**
 * Sora API Client
 * Handles video generation using the Sora API
 */

interface SoraVideoRequest {
  prompt: string;
  model?: string;
  duration?: number;
  aspect_ratio?: string;
}

interface SoraVideoResponse {
  video_url?: string;
  video_urls?: string[];
  id?: string;
  status?: string;
  error?: {
    message: string;
    code?: string;
  };
}

/**
 * Generate a video using Sora API
 */
export async function generateSoraVideo(
  prompt: string,
  options?: {
    model?: string;
    duration?: number;
    aspect_ratio?: string;
  }
): Promise<string> {
  console.log('[Sora] ==========================================');
  console.log('[Sora] Starting video generation');
  console.log('[Sora] Checking environment variables...');
  
  const apiKey = process.env.SORA_API_KEY;
  
  if (!apiKey) {
    console.error('[Sora] ❌ SORA_API_KEY is not set in environment variables');
    console.error('[Sora] Available env vars:', Object.keys(process.env).filter(k => k.includes('SORA') || k.includes('API')));
    throw new Error('SORA_API_KEY is not set in environment variables');
  }

  console.log('[Sora] ✅ SORA_API_KEY found (length:', apiKey.length, 'chars)');
  console.log('[Sora] Prompt length:', prompt.length);
  console.log('[Sora] ==========================================');

  // OpenAI Sora API endpoint (as of current docs)
  // Note: Sora might be accessible via OpenAI's API
  const endpoint = 'https://api.openai.com/v1/videos/generations';

  // Try different request formats based on potential API structures
  const requestFormats = [
    // Format 1: OpenAI-style (similar to images API)
    {
      model: options?.model || 'sora-1.5-turbo',
      prompt: prompt,
      duration: options?.duration || 10,
      aspect_ratio: options?.aspect_ratio || '16:9',
    },
    // Format 2: Simpler format
    {
      prompt: prompt,
      duration: options?.duration || 10,
      aspect_ratio: options?.aspect_ratio || '16:9',
    },
    // Format 3: Just prompt
    {
      prompt: prompt,
    },
  ];

  let lastError: Error | null = null;

  for (let i = 0; i < requestFormats.length; i++) {
    const requestBody = requestFormats[i];
    
    try {
      console.log(`[Sora] Attempting request format ${i + 1} to ${endpoint}`);
      console.log('[Sora] Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text();
      console.log(`[Sora] Response status: ${response.status}`);
      console.log(`[Sora] Response body:`, responseText.substring(0, 500));

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { error: responseText || `HTTP ${response.status}` };
        }
        
        const errorMessage = errorData.error?.message || errorData.error?.code || errorData.error || `HTTP ${response.status}: ${responseText.substring(0, 200)}`;
        lastError = new Error(`Sora API error: ${errorMessage}`);
        
        console.error(`[Sora] Request format ${i + 1} failed:`, errorMessage);
        
        // If it's a 401/403, likely wrong auth or endpoint
        if (response.status === 401 || response.status === 403) {
          throw lastError;
        }
        
        // If it's a 404, the endpoint might not exist
        if (response.status === 404) {
          console.error('[Sora] Endpoint not found. Sora API might not be available yet or use a different endpoint.');
          throw lastError;
        }
        
        // Continue to next format
        continue;
      }

      let data: SoraVideoResponse;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('[Sora] Failed to parse response as JSON:', responseText);
        throw new Error('Invalid JSON response from Sora API');
      }

      console.log('[Sora] Parsed response:', JSON.stringify(data, null, 2));
      
      // Handle different response formats
      if (data.video_url) {
        console.log('[Sora] Video URL found:', data.video_url);
        return data.video_url;
      }
      
      if (data.video_urls && data.video_urls.length > 0) {
        console.log('[Sora] Video URLs found:', data.video_urls[0]);
        return data.video_urls[0];
      }
      
      // Check for data.data[0].url (like DALL-E response format)
      if ((data as any).data && Array.isArray((data as any).data) && (data as any).data[0]?.url) {
        console.log('[Sora] Video URL found in data array:', (data as any).data[0].url);
        return (data as any).data[0].url;
      }
      
      // If response has an ID, we might need to poll for the video
      if (data.id) {
        console.log('[Sora] Received job ID, polling for video...');
        // For now, we'll implement simple polling
        return await pollForVideo(data.id, apiKey);
      }
      
      console.error('[Sora] Unexpected response format:', data);
      throw new Error(`Unexpected response format from Sora API: ${JSON.stringify(data)}`);
    } catch (error) {
      if (error instanceof Error) {
        // If it's an async/polling error, don't try other formats
        if (error.message.includes('polling') || error.message.includes('async')) {
          throw error;
        }
        lastError = error;
        console.error(`[Sora] Request format ${i + 1} error:`, error.message);
      } else {
        lastError = new Error('Unknown error');
      }
    }
  }

  // If all formats failed, throw the last error
  console.error('[Sora] All request formats failed');
  throw lastError || new Error('Failed to generate video from Sora API - all request formats failed');
}

/**
 * Poll for video URL when API returns a job ID
 */
async function pollForVideo(jobId: string, apiKey: string, maxAttempts: number = 30): Promise<string> {
  const pollEndpoint = `https://api.openai.com/v1/videos/${jobId}`;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      console.log(`[Sora] Polling attempt ${attempt + 1}/${maxAttempts} for job ${jobId}`);
      
      const response = await fetch(pollEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Polling failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.video_url) {
        console.log('[Sora] Video URL received from polling');
        return data.video_url;
      }
      
      if (data.status === 'completed' && data.video_url) {
        return data.video_url;
      }
      
      if (data.status === 'failed') {
        throw new Error(`Video generation failed: ${data.error?.message || 'Unknown error'}`);
      }
      
      // Wait before next poll (exponential backoff)
      const waitTime = Math.min(1000 * Math.pow(2, attempt), 10000);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    } catch (error) {
      if (attempt === maxAttempts - 1) {
        throw error;
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  throw new Error('Video generation timed out - polling exceeded max attempts');
}

/**
 * Check if Sora API is configured
 */
export function isSoraConfigured(): boolean {
  return !!process.env.SORA_API_KEY;
}

