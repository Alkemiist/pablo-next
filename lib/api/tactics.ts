// Simple tactics types
interface GenerateTacticsRequest {
  brand: string;
  product: string;
  persona: string;
  goal: string;
  visualGuide: string;
}

interface GenerateTacticsResponse {
  tactics: any[];
}

interface ErrorResponse {
  error: string;
}

/**
 * Generate creative tactics using OpenAI based on the provided context
 */
export async function generateTactics(context: GenerateTacticsRequest): Promise<GenerateTacticsResponse> {
  try {
    const response = await fetch('/api/generate-tactics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(context),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.error || 'Failed to generate tactics');
    }

    const data: GenerateTacticsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating tactics:', error);
    throw error;
  }
}

/**
 * Validate that all required context fields are present
 */
export function validateContext(context: GenerateTacticsRequest): boolean {
  return !!(context.brand && context.product && context.persona && context.goal && context.visualGuide);
} 