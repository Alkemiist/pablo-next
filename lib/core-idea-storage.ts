import { CoreIdea, CoreIdeaMetadata, SavedCoreIdea, CreateCoreIdeaRequest } from './types/core-idea';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_DIR = path.join(process.cwd(), 'storage', 'core-ideas');

// Ensure storage directory exists
async function ensureStorageDir() {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating storage directory:', error);
    throw new Error('Failed to create storage directory');
  }
}

// Generate metadata from core idea data
function generateMetadata(idea: CoreIdea): CoreIdeaMetadata {
  return {
    id: idea.id,
    title: idea.title,
    description: idea.description,
    status: idea.status,
    author: idea.author,
    createdAt: idea.createdAt,
    updatedAt: idea.updatedAt,
    tags: idea.tags,
    brand: idea.context.brand,
    product: idea.context.product,
    persona: idea.context.persona,
    trend: idea.context.trend,
  };
}

// Save a new core idea
export async function saveCoreIdea(request: CreateCoreIdeaRequest): Promise<SavedCoreIdea> {
  await ensureStorageDir();
  
  const now = new Date().toISOString();
  const id = uuidv4();
  
  const coreIdea: CoreIdea = {
    id,
    title: request.title,
    description: request.description,
    createdAt: now,
    updatedAt: now,
    context: request.context,
    ideaDetails: request.ideaDetails,
    tags: request.tags || [],
    status: 'saved',
    author: 'User', // TODO: Get from auth context
    personaFit: request.personaFit,
    marketIntelligence: request.marketIntelligence,
  };
  
  const metadata = generateMetadata(coreIdea);
  const savedIdea: SavedCoreIdea = {
    metadata,
    data: coreIdea,
  };
  
  const filePath = path.join(STORAGE_DIR, `core_idea_${id}.json`);
  
  try {
    await fs.writeFile(filePath, JSON.stringify(savedIdea, null, 2));
    console.log(`✅ Core idea saved: ${filePath}`);
    return savedIdea;
  } catch (error) {
    console.error('Error saving core idea:', error);
    throw new Error('Failed to save core idea');
  }
}

// Get all core idea metadata
export async function getAllCoreIdeas(): Promise<CoreIdeaMetadata[]> {
  await ensureStorageDir();
  
  try {
    const files = await fs.readdir(STORAGE_DIR);
    const ideaFiles = files.filter(file => file.startsWith('core_idea_') && file.endsWith('.json'));
    
    const ideas: CoreIdeaMetadata[] = [];
    
    for (const file of ideaFiles) {
      try {
        const filePath = path.join(STORAGE_DIR, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const savedIdea: SavedCoreIdea = JSON.parse(fileContent);
        ideas.push(savedIdea.metadata);
      } catch (error: unknown) {
        console.error(`Error reading core idea file ${file}:`, error);
        // Continue with other files
      }
    }
    
    // Sort by creation date (newest first)
    return ideas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error: unknown) {
    console.error('Error reading core ideas:', error);
    throw new Error('Failed to read core ideas');
  }
}

// Get a specific core idea by ID
export async function getCoreIdea(id: string): Promise<SavedCoreIdea | null> {
  await ensureStorageDir();
  
  const filePath = path.join(STORAGE_DIR, `core_idea_${id}.json`);
  
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const savedIdea: SavedCoreIdea = JSON.parse(fileContent);
    return savedIdea;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return null; // File not found
    }
    console.error(`Error reading core idea ${id}:`, error);
    throw new Error('Failed to read core idea');
  }
}

// Update a core idea
export async function updateCoreIdea(id: string, updates: Partial<CoreIdea>): Promise<SavedCoreIdea | null> {
  const existingIdea = await getCoreIdea(id);
  if (!existingIdea) {
    return null;
  }
  
  const updatedIdea: CoreIdea = {
    ...existingIdea.data,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  const metadata = generateMetadata(updatedIdea);
  const savedIdea: SavedCoreIdea = {
    metadata,
    data: updatedIdea,
  };
  
  const filePath = path.join(STORAGE_DIR, `core_idea_${id}.json`);
  
  try {
    await fs.writeFile(filePath, JSON.stringify(savedIdea, null, 2));
    console.log(`✅ Core idea updated: ${filePath}`);
    return savedIdea;
  } catch (error) {
    console.error('Error updating core idea:', error);
    throw new Error('Failed to update core idea');
  }
}

// Delete a core idea
export async function deleteCoreIdea(id: string): Promise<boolean> {
  const filePath = path.join(STORAGE_DIR, `core_idea_${id}.json`);
  
  try {
    await fs.unlink(filePath);
    console.log(`✅ Core idea deleted: ${filePath}`);
    return true;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return false; // File not found
    }
    console.error('Error deleting core idea:', error);
    throw new Error('Failed to delete core idea');
  }
}

