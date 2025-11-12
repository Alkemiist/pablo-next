import { NextRequest, NextResponse } from 'next/server';
import { loadSeedsFromFiles, getSeedFromFile, writeSeed, deleteSeedFile } from '@/lib/seed-ideas-file-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Handle individual seed request
    if (id) {
      const seed = getSeedFromFile(id);
      if (seed) {
        return NextResponse.json({ 
          success: true, 
          seed 
        });
      } else {
        return NextResponse.json(
          { success: false, message: 'Seed not found' },
          { status: 404 }
        );
      }
    }
    
    // Return all seeds
    const seeds = loadSeedsFromFiles();
    return NextResponse.json({ 
      success: true, 
      seeds 
    });
  } catch (error) {
    console.error('Error getting seeds from files:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get seeds' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;
    
    if (type !== 'seed') {
      return NextResponse.json(
        { success: false, message: 'Invalid type' },
        { status: 400 }
      );
    }
    
    const success = writeSeed(data);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Seed saved successfully' 
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to save seed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error saving seed to file:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save seed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Seed ID is required' },
        { status: 400 }
      );
    }
    
    const success = deleteSeedFile(id);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Seed deleted successfully' 
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Seed not found or failed to delete' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error deleting seed file:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete seed' },
      { status: 500 }
    );
  }
}

