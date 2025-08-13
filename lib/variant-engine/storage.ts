import type { CreateJobRequest, JobRecord, Plan } from './types';

// In-memory store for MVP. Replace with Postgres + S3 in production.
const JOBS = new Map<string, JobRecord>();

function nowIso() {
  return new Date().toISOString();
}

export async function persistNewJob(params: {
  plan: Plan;
  request: CreateJobRequest;
  webhookUrl?: string;
}): Promise<JobRecord> {
  const id = `job_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
  const job: JobRecord = {
    id,
    status: 'queued',
    createdAt: nowIso(),
    updatedAt: nowIso(),
    plan: params.plan,
    progress: [],
    artifacts: [],
    receipt: {},
  };
  JOBS.set(id, job);
  return job;
}

export async function getJobById(id: string): Promise<JobRecord | undefined> {
  return JOBS.get(id);
}

export async function updateJob(id: string, patch: Partial<JobRecord>): Promise<JobRecord | undefined> {
  const existing = JOBS.get(id);
  if (!existing) return undefined;
  const updated: JobRecord = { ...existing, ...patch, updatedAt: nowIso() };
  JOBS.set(id, updated);
  return updated;
}

export function appendProgress(id: string, stepId: string, message: string) {
  const job = JOBS.get(id);
  if (!job) return;
  job.progress.push({ stepId, message, at: nowIso() });
  job.updatedAt = nowIso();
}

export function addArtifact(id: string, artifact: JobRecord['artifacts'][number]) {
  const job = JOBS.get(id);
  if (!job) return;
  job.artifacts.push(artifact);
  job.updatedAt = nowIso();
}


