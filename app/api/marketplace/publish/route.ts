import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MarketingBriefDocument } from '@/lib/streamlined-brief-types';
import { BriefMetadata } from '@/lib/brief-storage';

// Published brief interface for marketplace
export interface PublishedBrief {
  id: string;
  briefId: string; // Reference to original brief
  title: string;
  description: string;
  brandName: string;
  projectName: string;
  targetAudience: string;
  primaryGoal: string;
  budgetRange: string;
  platforms: string;
  timeline: string;
  visualPreview?: string;
  publishedAt: string;
  publishedBy: string;
  status: 'active' | 'archived';
  saves: number;
  interested: number;
}

// Storage configuration
const MARKETPLACE_STORAGE_DIR = path.join(process.cwd(), 'storage', 'marketplace');

// Helper function to ensure marketplace storage directory exists
async function ensureMarketplaceStorageDir() {
  try {
    await fs.access(MARKETPLACE_STORAGE_DIR);
  } catch {
    await fs.mkdir(MARKETPLACE_STORAGE_DIR, { recursive: true });
  }
}

// POST /api/marketplace/publish - Publish a brief to marketplace
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { briefId, briefData, metadata } = body;
    
    if (!briefId || !briefData || !metadata) {
      return NextResponse.json(
        { error: 'Missing briefId, briefData, or metadata' },
        { status: 400 }
      );
    }

    await ensureMarketplaceStorageDir();
    
    // Create published brief entry
    const publishedBrief: PublishedBrief = {
      id: `published_${uuidv4()}`,
      briefId: briefId,
      title: metadata.title,
      description: metadata.description,
      brandName: briefData.document_info.brand_name,
      projectName: briefData.document_info.project_name,
      targetAudience: briefData.strategic_foundation.target_audience.persona_name,
      primaryGoal: briefData.executive_summary.strategy,
      budgetRange: 'Not specified', // This would come from the original intake
      platforms: briefData.channel_strategy.primary_channels.map((c: any) => c.channel).join(', '),
      timeline: briefData.implementation.timeline,
      visualPreview: metadata.visualPreview,
      publishedAt: new Date().toISOString(),
      publishedBy: metadata.author,
      status: 'active',
      saves: 0,
      interested: 0
    };
    
    // Save to marketplace storage
    const filePath = path.join(MARKETPLACE_STORAGE_DIR, `${publishedBrief.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(publishedBrief, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      publishedBrief,
      message: 'Brief published to marketplace successfully' 
    });
  } catch (error) {
    console.error('Error publishing brief:', error);
    return NextResponse.json(
      { error: 'Failed to publish brief to marketplace' },
      { status: 500 }
    );
  }
}

// GET /api/marketplace/publish - Get all published briefs
export async function GET() {
  try {
    await ensureMarketplaceStorageDir();
    
    const files = await fs.readdir(MARKETPLACE_STORAGE_DIR);
    const publishedFiles = files.filter(file => file.endsWith('.json'));
    
    const publishedBriefs: PublishedBrief[] = [];
    
    for (const file of publishedFiles) {
      try {
        const filePath = path.join(MARKETPLACE_STORAGE_DIR, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const publishedBrief: PublishedBrief = JSON.parse(fileContent);
        publishedBriefs.push(publishedBrief);
      } catch (error) {
        console.error(`Error loading published brief file ${file}:`, error);
      }
    }
    
    // Sort by published date (newest first)
    publishedBriefs.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    return NextResponse.json({ publishedBriefs });
  } catch (error) {
    console.error('Error loading published briefs:', error);
    return NextResponse.json(
      { error: 'Failed to load published briefs' },
      { status: 500 }
    );
  }
}
