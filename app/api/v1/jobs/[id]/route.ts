import { NextRequest, NextResponse } from 'next/server';
import { getJobById } from '@/lib/variant-engine/storage';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const job = await getJobById(id);
    if (!job) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(job, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch job', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}


