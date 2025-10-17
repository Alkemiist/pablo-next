import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { loadBrief } from '@/lib/brief-storage';

// Media storage configuration
const MEDIA_STORAGE_DIR = path.join(process.cwd(), 'storage', 'media');

// Helper function to ensure media storage directory exists
async function ensureMediaStorageDir(briefId: string) {
  const briefMediaDir = path.join(MEDIA_STORAGE_DIR, briefId);
  try {
    await fs.access(briefMediaDir);
  } catch {
    await fs.mkdir(briefMediaDir, { recursive: true });
  }
  return briefMediaDir;
}

// POST - Upload media files for a brief
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const briefId = params.id;
    
    // Verify brief exists
    const brief = await loadBrief(briefId);
    if (!brief) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 });
    }

    // Parse form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Ensure media directory exists
    const briefMediaDir = await ensureMediaStorageDir(briefId);
    
    const uploadedAssets = [];
    
    for (const file of files) {
      // Validate file type
      const fileType = file.type.startsWith('image/') ? 'image' : 
                     file.type.startsWith('video/') ? 'video' : null;
      
      if (!fileType) {
        continue; // Skip unsupported file types
      }
      
      // Generate unique filename
      const fileExtension = path.extname(file.name);
      const uniqueFilename = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(briefMediaDir, uniqueFilename);
      
      // Save file to disk
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      
      // Create asset metadata
      const asset = {
        id: uuidv4(),
        filename: uniqueFilename,
        originalName: file.name,
        type: fileType as 'image' | 'video',
        size: file.size,
        uploadedAt: new Date().toISOString(),
        url: `/api/media/${briefId}/${uniqueFilename}`
      };
      
      uploadedAssets.push(asset);
    }
    
    // Update brief with new visual direction
    const currentVisualDirection = brief.briefData.visual_direction || {
      images: [],
      videos: [],
      description: ''
    };
    
    // Add new assets to existing ones
    const updatedVisualDirection = {
      ...currentVisualDirection,
      images: [...currentVisualDirection.images, ...uploadedAssets.filter(a => a.type === 'image')],
      videos: [...(currentVisualDirection.videos || []), ...uploadedAssets.filter(a => a.type === 'video')]
    };
    
    // Update brief data
    brief.briefData.visual_direction = updatedVisualDirection;
    
    // Save updated brief
    const briefFilePath = path.join(process.cwd(), 'storage', 'briefs', `${briefId}.json`);
    await fs.writeFile(briefFilePath, JSON.stringify(brief, null, 2));
    
    return NextResponse.json({
      success: true,
      assets: uploadedAssets,
      visualDirection: updatedVisualDirection
    });
    
  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json(
      { error: 'Failed to upload media files' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a specific media file
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const briefId = params.id;
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('assetId');
    
    if (!assetId) {
      return NextResponse.json({ error: 'Asset ID required' }, { status: 400 });
    }
    
    // Load brief
    const brief = await loadBrief(briefId);
    if (!brief) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 });
    }
    
    const visualDirection = brief.briefData.visual_direction;
    if (!visualDirection) {
      return NextResponse.json({ error: 'No visual direction found' }, { status: 404 });
    }
    
    // Find and remove asset
    let assetToRemove = null;
    let updatedImages = visualDirection.images;
    let updatedVideos = visualDirection.videos;
    
    // Check images
    const imageIndex = visualDirection.images.findIndex(img => img.id === assetId);
    if (imageIndex !== -1) {
      assetToRemove = visualDirection.images[imageIndex];
      updatedImages = visualDirection.images.filter(img => img.id !== assetId);
    }
    
    // Check videos
    const videoIndex = visualDirection.videos?.findIndex(vid => vid.id === assetId) ?? -1;
    if (videoIndex !== -1 && visualDirection.videos) {
      assetToRemove = visualDirection.videos[videoIndex];
      updatedVideos = visualDirection.videos.filter(vid => vid.id !== assetId);
    }
    
    if (!assetToRemove) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }
    
    // Delete file from disk
    const filePath = path.join(MEDIA_STORAGE_DIR, briefId, assetToRemove.filename);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.warn('Could not delete file from disk:', error);
    }
    
    // Update brief
    brief.briefData.visual_direction = {
      ...visualDirection,
      images: updatedImages,
      videos: updatedVideos
    };
    
    // Save updated brief
    const briefFilePath = path.join(process.cwd(), 'storage', 'briefs', `${briefId}.json`);
    await fs.writeFile(briefFilePath, JSON.stringify(brief, null, 2));
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { error: 'Failed to delete media file' },
      { status: 500 }
    );
  }
}
