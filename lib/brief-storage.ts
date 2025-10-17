import { MarketingBriefDocument } from './streamlined-brief-types';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Brief metadata structure
export interface BriefMetadata {
  id: string;
  title: string;
  description: string;
  status: 'Draft' | 'In Review' | 'Approved';
  author: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  visualPreview?: string; // URL to first image/video for card display
}

// Complete brief with metadata and data
export interface SavedBrief {
  metadata: BriefMetadata;
  briefData: MarketingBriefDocument;
}

// Storage configuration
const STORAGE_DIR = path.join(process.cwd(), 'storage', 'briefs');

// Helper function to ensure storage directory exists
async function ensureStorageDir() {
  try {
    await fs.access(STORAGE_DIR);
  } catch {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  }
}

// Generate unique brief ID
export function generateBriefId(): string {
  return `brief_${uuidv4()}`;
}

// Save a brief to file (overloaded function)
export async function saveBrief(briefData: MarketingBriefDocument, metadata: Omit<BriefMetadata, 'id' | 'createdAt' | 'updatedAt' | 'visualPreview'>): Promise<string>;
export async function saveBrief(savedBrief: SavedBrief): Promise<boolean>;
export async function saveBrief(
  briefDataOrSavedBrief: MarketingBriefDocument | SavedBrief, 
  metadata?: Omit<BriefMetadata, 'id' | 'createdAt' | 'updatedAt' | 'visualPreview'>
): Promise<string | boolean> {
  await ensureStorageDir();
  
  // Check if this is a SavedBrief object (for updates) or separate briefData/metadata (for new briefs)
  if (metadata === undefined) {
    // This is a SavedBrief object for updating
    const savedBrief = briefDataOrSavedBrief as SavedBrief;
    const filePath = path.join(STORAGE_DIR, `${savedBrief.metadata.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(savedBrief, null, 2));
    return true;
  } else {
    // This is a new brief with separate briefData and metadata
    const briefData = briefDataOrSavedBrief as MarketingBriefDocument;
    const id = generateBriefId();
    const now = new Date().toISOString();
    
    // Extract visual preview from visual direction
    let visualPreview: string | undefined;
    if (briefData.visual_direction) {
      if (briefData.visual_direction.images.length > 0) {
        visualPreview = briefData.visual_direction.images[0].url;
      } else if (briefData.visual_direction.videos && briefData.visual_direction.videos.length > 0) {
        visualPreview = briefData.visual_direction.videos[0].url;
      }
    }
    
    const savedBrief: SavedBrief = {
      metadata: {
        id,
        ...metadata,
        visualPreview,
        createdAt: now,
        updatedAt: now,
      },
      briefData
    };
    
    const filePath = path.join(STORAGE_DIR, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(savedBrief, null, 2));
    
    return id;
  }
}

// Load a specific brief by ID
export async function loadBrief(id: string): Promise<SavedBrief | null> {
  try {
    const filePath = path.join(STORAGE_DIR, `${id}.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch {
    return null;
  }
}

// Load all briefs (metadata only for listing)
export async function loadAllBriefs(): Promise<BriefMetadata[]> {
  await ensureStorageDir();
  
  try {
    const files = await fs.readdir(STORAGE_DIR);
    const briefFiles = files.filter(file => file.endsWith('.json'));
    
    const briefs: BriefMetadata[] = [];
    
    for (const file of briefFiles) {
      try {
        const filePath = path.join(STORAGE_DIR, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const savedBrief: SavedBrief = JSON.parse(fileContent);
        briefs.push(savedBrief.metadata);
      } catch (error) {
        console.error(`Error loading brief file ${file}:`, error);
      }
    }
    
    return briefs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

// Update brief metadata
export async function updateBriefMetadata(id: string, updates: Partial<Omit<BriefMetadata, 'id' | 'createdAt'>>): Promise<boolean> {
  try {
    const savedBrief = await loadBrief(id);
    if (!savedBrief) return false;
    
    savedBrief.metadata = {
      ...savedBrief.metadata,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    const filePath = path.join(STORAGE_DIR, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(savedBrief, null, 2));
    
    return true;
  } catch {
    return false;
  }
}

// Delete a brief
export async function deleteBrief(id: string): Promise<boolean> {
  try {
    const filePath = path.join(STORAGE_DIR, `${id}.json`);
    
    // Check if file exists first
    try {
      await fs.access(filePath);
    } catch (error) {
      console.error(`File does not exist: ${filePath}`);
      return false;
    }
    
    await fs.unlink(filePath);
    console.log(`Successfully deleted brief: ${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting brief ${id}:`, error);
    return false;
  }
}
