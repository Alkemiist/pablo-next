import { InspoCard, CreateInspoCardRequest, InspoCardMetadata, SavedInspoCard } from './types/inspo-card';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Using InspoCardMetadata from types file

// Using SavedInspoCard from types file

const STORAGE_DIR = path.join(process.cwd(), 'storage', 'inspo-cards');

// Ensure storage directory exists
async function ensureStorageDir() {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating storage directory:', error);
    throw new Error('Failed to create storage directory');
  }
}

// Generate metadata from inspo card data
function generateMetadata(card: InspoCard): InspoCardMetadata {
  // Get the first tactic's image or the first generated image
  const imageUrl = card.tactics?.[0]?.image || card.visualAssets?.generatedImages?.[0];
  
  return {
    id: card.id,
    title: card.title,
    description: card.description,
    status: card.status,
    author: card.author,
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
    tags: card.tags,
    tacticCount: card.tactics.length,
    brand: card.context.brand,
    product: card.context.product,
    imageUrl: imageUrl,
  };
}

// Save a new inspo card
export async function saveInspoCard(request: CreateInspoCardRequest): Promise<SavedInspoCard> {
  await ensureStorageDir();
  
  const now = new Date().toISOString();
  const id = uuidv4();
  
  const inspoCard: InspoCard = {
    id,
    title: request.title,
    description: request.description,
    createdAt: now,
    updatedAt: now,
    context: request.context,
    tactics: request.tactics,
    generatedContent: request.generatedContent,
    visualAssets: request.visualAssets,
    tags: request.tags || [],
    status: 'saved',
    author: 'User', // TODO: Get from auth context
  };
  
  const metadata = generateMetadata(inspoCard);
  const savedCard: SavedInspoCard = {
    metadata,
    data: inspoCard,
  };
  
  const filePath = path.join(STORAGE_DIR, `inspo_${id}.json`);
  
  try {
    await fs.writeFile(filePath, JSON.stringify(savedCard, null, 2));
    console.log(`✅ Inspo card saved: ${filePath}`);
    return savedCard;
  } catch (error) {
    console.error('Error saving inspo card:', error);
    throw new Error('Failed to save inspo card');
  }
}

// Get all inspo card metadata
export async function getAllInspoCards(): Promise<InspoCardMetadata[]> {
  await ensureStorageDir();
  
  try {
    const files = await fs.readdir(STORAGE_DIR);
    const inspoFiles = files.filter(file => file.startsWith('inspo_') && file.endsWith('.json'));
    
    const cards: InspoCardMetadata[] = [];
    
    for (const file of inspoFiles) {
      try {
        const filePath = path.join(STORAGE_DIR, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const savedCard: SavedInspoCard = JSON.parse(fileContent);
        cards.push(savedCard.metadata);
        } catch (error: unknown) {
            console.error(`Error reading inspo card file ${file}:`, error);
            // Continue with other files
        }
    }
    
    // Sort by creation date (newest first)
    return cards.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error: unknown) {
    console.error('Error reading inspo cards:', error);
    throw new Error('Failed to read inspo cards');
  }
}

// Get a specific inspo card by ID
export async function getInspoCard(id: string): Promise<SavedInspoCard | null> {
  await ensureStorageDir();
  
  const filePath = path.join(STORAGE_DIR, `inspo_${id}.json`);
  
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const savedCard: SavedInspoCard = JSON.parse(fileContent);
    return savedCard;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return null; // File not found
    }
    console.error(`Error reading inspo card ${id}:`, error);
    throw new Error('Failed to read inspo card');
  }
}

// Update an inspo card
export async function updateInspoCard(id: string, updates: Partial<InspoCard>): Promise<SavedInspoCard | null> {
  const existingCard = await getInspoCard(id);
  if (!existingCard) {
    return null;
  }
  
  const updatedCard: InspoCard = {
    ...existingCard.data,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  const metadata = generateMetadata(updatedCard);
  const savedCard: SavedInspoCard = {
    metadata,
    data: updatedCard,
  };
  
  const filePath = path.join(STORAGE_DIR, `inspo_${id}.json`);
  
  try {
    await fs.writeFile(filePath, JSON.stringify(savedCard, null, 2));
    console.log(`✅ Inspo card updated: ${filePath}`);
    return savedCard;
  } catch (error) {
    console.error('Error updating inspo card:', error);
    throw new Error('Failed to update inspo card');
  }
}

// Delete an inspo card
export async function deleteInspoCard(id: string): Promise<boolean> {
  const filePath = path.join(STORAGE_DIR, `inspo_${id}.json`);
  
  try {
    await fs.unlink(filePath);
    console.log(`✅ Inspo card deleted: ${filePath}`);
    return true;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return false; // File not found
    }
    console.error('Error deleting inspo card:', error);
    throw new Error('Failed to delete inspo card');
  }
}
