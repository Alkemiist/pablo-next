import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Interaction types
export interface BriefInteraction {
  id: string;
  briefId: string;
  userId: string; // In a real app, this would be from authentication
  action: 'save' | 'interested';
  timestamp: string;
}

// Storage configuration
const INTERACTIONS_STORAGE_DIR = path.join(process.cwd(), 'storage', 'interactions');

// Helper function to ensure interactions storage directory exists
async function ensureInteractionsStorageDir() {
  try {
    await fs.access(INTERACTIONS_STORAGE_DIR);
  } catch {
    await fs.mkdir(INTERACTIONS_STORAGE_DIR, { recursive: true });
  }
}

// POST /api/marketplace/interact - Save or mark as interested
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { briefId, action } = body;
    
    if (!briefId || !action || !['save', 'interested'].includes(action)) {
      return NextResponse.json(
        { error: 'Missing briefId or invalid action' },
        { status: 400 }
      );
    }

    await ensureInteractionsStorageDir();
    
    // For demo purposes, use a mock user ID
    const userId = 'demo-user';
    
    // Create interaction
    const interaction: BriefInteraction = {
      id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      briefId,
      userId,
      action,
      timestamp: new Date().toISOString()
    };
    
    // Save interaction
    const filePath = path.join(INTERACTIONS_STORAGE_DIR, `${interaction.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(interaction, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      interaction,
      message: `Brief ${action === 'save' ? 'saved' : 'marked as interested'} successfully` 
    });
  } catch (error) {
    console.error('Error creating interaction:', error);
    return NextResponse.json(
      { error: 'Failed to create interaction' },
      { status: 500 }
    );
  }
}

// GET /api/marketplace/interact?briefId=xxx - Get interactions for a brief
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const briefId = searchParams.get('briefId');
    
    if (!briefId) {
      return NextResponse.json(
        { error: 'Missing briefId parameter' },
        { status: 400 }
      );
    }

    await ensureInteractionsStorageDir();
    
    const files = await fs.readdir(INTERACTIONS_STORAGE_DIR);
    const interactionFiles = files.filter(file => file.endsWith('.json'));
    
    const interactions: BriefInteraction[] = [];
    
    for (const file of interactionFiles) {
      try {
        const filePath = path.join(INTERACTIONS_STORAGE_DIR, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const interaction: BriefInteraction = JSON.parse(fileContent);
        
        if (interaction.briefId === briefId) {
          interactions.push(interaction);
        }
      } catch (error) {
        console.error(`Error loading interaction file ${file}:`, error);
      }
    }
    
    // Count saves and interested
    const saves = interactions.filter(i => i.action === 'save').length;
    const interested = interactions.filter(i => i.action === 'interested').length;
    
    return NextResponse.json({ 
      interactions,
      counts: {
        saves,
        interested
      }
    });
  } catch (error) {
    console.error('Error loading interactions:', error);
    return NextResponse.json(
      { error: 'Failed to load interactions' },
      { status: 500 }
    );
  }
}
