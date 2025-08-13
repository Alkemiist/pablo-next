import { NextRequest, NextResponse } from 'next/server';
import { planCopyVariantsByLength } from '@/lib/copy-variants/planner';
import { generateFromLengthPlanLLM } from '@/lib/copy-variants/generator';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const idea: string = body?.idea;
    const brand = undefined; // brand removed per new requirements
    const maxChars = typeof body?.maxChars === 'number' ? body.maxChars : 150;
    const seed = typeof body?.seed === 'number' ? body.seed : undefined;
    const totalVariants = typeof body?.totalVariants === 'number' ? body.totalVariants : 20;

    if (!idea || typeof idea !== 'string') {
      return NextResponse.json({ error: 'idea (string) is required' }, { status: 400 });
    }

    const plan = planCopyVariantsByLength({ idea, brand, maxChars, seed, totalVariants });
    const output = await generateFromLengthPlanLLM(plan);
    return NextResponse.json({ planId: output.planId, generatedAt: new Date().toISOString(), variants: output.variants }, { status: 200 });
  } catch (error) {
    console.error('copy-variants error', error);
    return NextResponse.json({ error: 'Failed to generate copy variants' }, { status: 500 });
  }
}


