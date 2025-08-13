import { NextRequest, NextResponse } from 'next/server';
import { planCopyVariants } from '@/lib/copy-variants/planner';
import { generateCopyFromPlan } from '@/lib/copy-variants/generator';
import { DEFAULT_COPY_SPECS, type CopyPlatformKey } from '@/lib/copy-variants/specs';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const idea: string = body?.idea;
    const brand = body?.brand as { voice?: string; forbidden?: string[]; notes?: string[] } | undefined;
    const platforms = body?.platforms as CopyPlatformKey[] | undefined;
    const seed = typeof body?.seed === 'number' ? body.seed : undefined;
    const totalVariants = 10;

    if (!idea || typeof idea !== 'string') {
      return NextResponse.json({ error: 'idea (string) is required' }, { status: 400 });
    }

    const plan = planCopyVariants({ idea, brand, platforms, seed, totalVariants });
    const output = generateCopyFromPlan(plan);

    const manifest = {
      planId: output.planId,
      generatedAt: new Date().toISOString(),
      platforms: plan.platforms,
      specs: plan.platforms.map((p) => DEFAULT_COPY_SPECS[p]),
      variants: output.variants,
    };

    return NextResponse.json(manifest, { status: 200 });
  } catch (error) {
    console.error('copy-variants error', error);
    return NextResponse.json({ error: 'Failed to generate copy variants' }, { status: 500 });
  }
}


