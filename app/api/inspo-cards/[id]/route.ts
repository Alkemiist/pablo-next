import { NextRequest, NextResponse } from 'next/server';
import { 
  getInspoCard, 
  updateInspoCard, 
  deleteInspoCard 
} from '@/lib/inspo-storage';
import { UpdateInspoCardRequest } from '@/lib/types/inspo-card';

// GET /api/inspo-cards/[id] - Get specific inspo card
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log(`📋 API Route: Getting inspo card ${id}`);
    
    const card = await getInspoCard(id);
    
    if (!card) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Inspo card not found'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      card
    });
  } catch (error) {
    console.error('❌ Error getting inspo card:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get inspo card',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT /api/inspo-cards/[id] - Update inspo card
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log(`✏️ API Route: Updating inspo card ${id}`);
    
    const body: UpdateInspoCardRequest = await request.json();
    
    const updatedCard = await updateInspoCard(id, body);
    
    if (!updatedCard) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Inspo card not found'
        },
        { status: 404 }
      );
    }
    
    console.log('✅ API Route: Inspo card updated successfully');
    return NextResponse.json({
      success: true,
      card: updatedCard
    });
  } catch (error) {
    console.error('❌ Error updating inspo card:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update inspo card',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/inspo-cards/[id] - Delete inspo card
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log(`🗑️ API Route: Deleting inspo card ${id}`);
    
    const deleted = await deleteInspoCard(id);
    
    if (!deleted) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Inspo card not found'
        },
        { status: 404 }
      );
    }
    
    console.log('✅ API Route: Inspo card deleted successfully');
    return NextResponse.json({
      success: true,
      message: 'Inspo card deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting inspo card:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete inspo card',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
