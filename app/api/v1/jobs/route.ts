import { NextRequest, NextResponse } from 'next/server';
import { createPlan } from '@/lib/variant-engine/planner';
import { validatePlan } from '@/lib/variant-engine/validator';
import { persistNewJob } from '@/lib/variant-engine/storage';
import { executeJob } from '@/lib/variant-engine/executor';
import type { CreateJobRequest, CreateJobResponse } from '@/lib/variant-engine/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateJobRequest;

    if (!body || !body.asset || !body.brand) {
      return NextResponse.json({ error: 'Missing required fields: brand and asset' }, { status: 400 });
    }

    const seed = body.seed ?? 42;
    const plan = createPlan({
      brand: body.brand,
      asset: body.asset,
      platforms: body.platforms,
      variantsPerPlatform: body.variantsPerPlatform ?? 10,
      seed,
      featureFlags: body.featureFlags,
    });

    const validation = validatePlan(plan);
    if (!validation.valid) {
      return NextResponse.json({ error: 'Plan validation failed', issues: validation.issues }, { status: 422 });
    }

    if (body.dry_run) {
      const estimatedCostUsd = plan.estimate.costUsd;
      const response: CreateJobResponse = {
        dryRun: true,
        plan,
        estimatedCostUsd,
      };
      return NextResponse.json(response, { status: 200 });
    }

    const job = await persistNewJob({
      plan,
      request: body,
      webhookUrl: body.webhook_url,
    });

    // Kick off async execution; do not await
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    executeJob(job).catch(() => {});

    return NextResponse.json({ id: job.id, status: job.status, createdAt: job.createdAt }, { status: 202 });
  } catch (error) {
    console.error('Failed to create job', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}


