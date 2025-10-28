import { NextRequest, NextResponse } from 'next/server';
import { getCoreIdea, updateCoreIdea, deleteCoreIdea } from '@/lib/core-idea-storage';
import { UpdateCoreIdeaRequest } from '@/lib/types/core-idea';

// GET - Retrieve a specific core idea by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const idea = await getCoreIdea(id);
    
    if (!idea) {
      return NextResponse.json(
        { success: false, error: 'Core idea not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      idea,
    });
  } catch (error) {
    console.error('Error fetching core idea:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch core idea' },
      { status: 500 }
    );
  }
}

// PUT - Update a specific core idea
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: UpdateCoreIdeaRequest = await request.json();
    
    const updatedIdea = await updateCoreIdea(id, body);
    
    if (!updatedIdea) {
      return NextResponse.json(
        { success: false, error: 'Core idea not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      idea: updatedIdea,
    });
  } catch (error) {
    console.error('Error updating core idea:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update core idea' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific core idea
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const deleted = await deleteCoreIdea(id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Core idea not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Core idea deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting core idea:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete core idea' },
      { status: 500 }
    );
  }
}

