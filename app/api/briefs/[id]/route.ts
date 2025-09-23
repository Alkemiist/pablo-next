import { NextRequest, NextResponse } from 'next/server';
import { loadBrief, updateBriefMetadata, deleteBrief } from '@/lib/brief-storage';

// GET /api/briefs/[id] - Load a specific brief
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const brief = await loadBrief(id);
    
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { metadata } = body;
    
    if (!metadata) {
      return NextResponse.json(
        { error: 'Missing metadata' },
        { status: 400 }
      );
    }
    
    const success = await updateBriefMetadata(id, metadata);
    
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(`Attempting to delete brief with ID: ${id}`);
    
    const success = await deleteBrief(id);
    
    if (!success) {
      console.error(`Failed to delete brief: ${id}`);
      return NextResponse.json(
        { error: 'Brief not found or delete failed' },
        { status: 404 }
      );
    }
    
    console.log(`Successfully deleted brief: ${id}`);
    return NextResponse.json({ 
      success: true,
      message: 'Brief deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting brief:', error);
    return NextResponse.json(
      { error: 'Failed to delete brief', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
