import { addArtifact, appendProgress, updateJob } from './storage';
import type { JobRecord, PlanStep } from './types';

async function simulateLatency(ms: number) {
  await new Promise((res) => setTimeout(res, ms));
}

async function runOperation(job: JobRecord, step: PlanStep, opIndex: number) {
  const op = step.operations[opIndex];
  appendProgress(job.id, step.id, `Starting ${op.type}`);

  // Simulate different latencies by content type
  if (op.type === 'copy_variant') await simulateLatency(300);
  if (op.type === 'image_variant') await simulateLatency(800);
  if (op.type === 'video_variant') await simulateLatency(1500);
  if (op.type === 'compliance_check') await simulateLatency(200);
  if (op.type === 'package_variant') await simulateLatency(100);

  // Produce a simple artifact stub
  if (op.type.endsWith('_variant')) {
    const variantIndex = Number(step.id.split('-').pop()) - 1;
    addArtifact(job.id, {
      platform: step.platform,
      variantIndex,
      type: op.type.startsWith('copy') ? 'copy' : op.type.startsWith('image') ? 'image' : 'video',
      data: {
        leverSelections: step.leverSelections,
        params: op.params,
      },
    });
  }

  appendProgress(job.id, step.id, `Finished ${op.type}`);
}

export async function executeJob(job: JobRecord) {
  await updateJob(job.id, { status: 'running' });

  try {
    const firstResultDelayMs = job.plan.asset.type === 'copy' ? 1000 : job.plan.asset.type === 'image' ? 2000 : 3000;
    let firstEmitted = false;

    for (const step of job.plan.steps) {
      for (let i = 0; i < step.operations.length; i++) {
        await runOperation(job, step, i);
        if (!firstEmitted) {
          await simulateLatency(firstResultDelayMs);
          firstEmitted = true;
        }
      }
    }

    await updateJob(job.id, {
      status: 'succeeded',
      receipt: {
        json: {
          id: job.id,
          planId: job.plan.id,
          artifacts: job.artifacts.length,
        },
      },
    });

    // Attach machine-readable manifest artifact at completion
    addArtifact(job.id, {
      platform: job.plan.platforms[0],
      variantIndex: 0,
      type: 'manifest',
      data: {
        jobId: job.id,
        planId: job.plan.id,
        platforms: job.plan.platforms,
        variantsPerPlatform: job.plan.variantsPerPlatform,
        artifacts: job.artifacts,
      },
    });
  } catch (err) {
    await updateJob(job.id, { status: 'failed' });
  }
}


