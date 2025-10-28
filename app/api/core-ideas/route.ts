import { NextRequest, NextResponse } from 'next/server';
import { getAllCoreIdeas, saveCoreIdea } from '@/lib/core-idea-storage';
import { CreateCoreIdeaRequest } from '@/lib/types/core-idea';

// GET - Retrieve all core ideas
export async function GET() {
  try {
    const ideas = await getAllCoreIdeas();
    
    return NextResponse.json({
      success: true,
      ideas,
      total: ideas.length,
    });
  } catch (error) {
    console.error('Error fetching core ideas:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch core ideas' },
      { status: 500 }
    );
  }
}

// POST - Create a new core idea
export async function POST(request: NextRequest) {
  try {
    const body: CreateCoreIdeaRequest = await request.json();
    
    const savedIdea = await saveCoreIdea(body);
    
    return NextResponse.json({
      success: true,
      idea: savedIdea,
    });
  } catch (error) {
    console.error('Error creating core idea:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create core idea' },
      { status: 500 }
    );
  }
}

