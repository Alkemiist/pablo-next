import { NextRequest, NextResponse } from 'next/server';
import { saveBrief, loadAllBriefs } from '@/lib/brief-storage';
import { MarketingBriefDocument } from '@/lib/streamlined-brief-types';

// GET /api/briefs - Load all briefs
export async function GET() {
  try {
    const briefs = await loadAllBriefs();
    return NextResponse.json({ briefs });
  } catch (error) {
    console.error('Error loading briefs:', error);
    return NextResponse.json(
      { error: 'Failed to load briefs' },
      { status: 500 }
    );
  }
}

// POST /api/briefs - Save a new brief
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { briefData, metadata } = body;
    
    if (!briefData || !metadata) {
      return NextResponse.json(
        { error: 'Missing briefData or metadata' },
        { status: 400 }
      );
    }
    
    const briefId = await saveBrief(briefData, metadata);
    
    return NextResponse.json({ 
      success: true, 
      id: briefId,
      message: 'Brief saved successfully' 
    });
  } catch (error) {
    console.error('Error saving brief:', error);
    return NextResponse.json(
      { error: 'Failed to save brief' },
      { status: 500 }
    );
  }
}
