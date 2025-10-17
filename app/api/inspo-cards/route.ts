import { NextRequest, NextResponse } from 'next/server';
import { 
  saveInspoCard, 
  getAllInspoCards 
} from '@/lib/inspo-storage';
import { CreateInspoCardRequest } from '@/lib/types/inspo-card';

// GET /api/inspo-cards - Get all inspo cards
export async function GET() {
  try {
    console.log('📋 API Route: Getting all inspo cards');
    
    const cards = await getAllInspoCards();
    
    return NextResponse.json({
      success: true,
      cards,
      total: cards.length
    });
  } catch (error) {
    console.error('❌ Error getting inspo cards:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get inspo cards',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/inspo-cards - Create new inspo card
export async function POST(request: NextRequest) {
  try {
    console.log('💾 API Route: Creating new inspo card');
    
    const body: CreateInspoCardRequest = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.context || !body.tactics) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields: title, description, context, and tactics are required'
        },
        { status: 400 }
      );
    }
    
    const savedCard = await saveInspoCard(body);
    
    console.log('✅ API Route: Inspo card created successfully');
    return NextResponse.json({
      success: true,
      card: savedCard
    });
  } catch (error) {
    console.error('❌ Error creating inspo card:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create inspo card',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
