import { NextRequest, NextResponse } from 'next/server';
import { loadBrief, updateBriefMetadata, deleteBrief } from '@/lib/brief-storage';

// GET /api/briefs/[id] - Load a specific brief
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const brief = await loadBrief(params.id);
    
    if (!brief) {
      return NextResponse.json(
        { error: 'Brief not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ brief });
  } catch (error) {
    console.error('Error loading brief:', error);
    return NextResponse.json(
      { error: 'Failed to load brief' },
      { status: 500 }
    );
  }
}

// PUT /api/briefs/[id] - Update brief metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { metadata } = body;
    
    if (!metadata) {
      return NextResponse.json(
        { error: 'Missing metadata' },
        { status: 400 }
      );
    }
    
    const success = await updateBriefMetadata(params.id, metadata);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Brief not found or update failed' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Brief updated successfully' 
    });
  } catch (error) {
    console.error('Error updating brief:', error);
    return NextResponse.json(
      { error: 'Failed to update brief' },
      { status: 500 }
    );
  }
}

// DELETE /api/briefs/[id] - Delete a brief
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteBrief(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Brief not found or delete failed' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Brief deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting brief:', error);
    return NextResponse.json(
      { error: 'Failed to delete brief' },
      { status: 500 }
    );
  }
}
