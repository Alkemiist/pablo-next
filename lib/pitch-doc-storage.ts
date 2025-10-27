// Pitch Doc Storage Utilities
import { GeneratedPitchDoc, PitchDocMetadata } from './pitch-doc-types';

const PITCH_DOCS_STORAGE_KEY = 'pitch_docs';
const PITCH_DOC_METADATA_KEY = 'pitch_doc_metadata';

// Save a generated pitch doc
export function savePitchDoc(pitchDocId: string, pitchDoc: GeneratedPitchDoc): void {
  try {
    const existingDocs = getStoredPitchDocs();
    existingDocs[pitchDocId] = pitchDoc;
    localStorage.setItem(PITCH_DOCS_STORAGE_KEY, JSON.stringify(existingDocs));
  } catch (error) {
    console.error('Error saving pitch doc:', error);
  }
}

// Get a specific pitch doc by ID
export function getPitchDoc(pitchDocId: string): GeneratedPitchDoc | null {
  try {
    const docs = getStoredPitchDocs();
    return docs[pitchDocId] || null;
  } catch (error) {
    console.error('Error getting pitch doc:', error);
    return null;
  }
}

// Get all stored pitch docs
export function getStoredPitchDocs(): Record<string, GeneratedPitchDoc> {
  try {
    const stored = localStorage.getItem(PITCH_DOCS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error getting stored pitch docs:', error);
    return {};
  }
}

// Save pitch doc metadata
export function savePitchDocMetadata(metadata: PitchDocMetadata): void {
  try {
    const existingMetadata = getStoredPitchDocMetadata();
    existingMetadata[metadata.id] = metadata;
    localStorage.setItem(PITCH_DOC_METADATA_KEY, JSON.stringify(existingMetadata));
  } catch (error) {
    console.error('Error saving pitch doc metadata:', error);
  }
}

// Get pitch doc metadata
export function getPitchDocMetadata(pitchDocId: string): PitchDocMetadata | null {
  try {
    const metadata = getStoredPitchDocMetadata();
    return metadata[pitchDocId] || null;
  } catch (error) {
    console.error('Error getting pitch doc metadata:', error);
    return null;
  }
}

// Get all stored pitch doc metadata
export function getStoredPitchDocMetadata(): Record<string, PitchDocMetadata> {
  try {
    const stored = localStorage.getItem(PITCH_DOC_METADATA_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error getting stored pitch doc metadata:', error);
    return {};
  }
}

// Get all pitch doc metadata as array
export function getAllPitchDocMetadata(): PitchDocMetadata[] {
  try {
    const metadata = getStoredPitchDocMetadata();
    return Object.values(metadata).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error getting all pitch doc metadata:', error);
    return [];
  }
}

// Delete a pitch doc
export function deletePitchDoc(pitchDocId: string): void {
  try {
    const docs = getStoredPitchDocs();
    const metadata = getStoredPitchDocMetadata();
    
    delete docs[pitchDocId];
    delete metadata[pitchDocId];
    
    localStorage.setItem(PITCH_DOCS_STORAGE_KEY, JSON.stringify(docs));
    localStorage.setItem(PITCH_DOC_METADATA_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error('Error deleting pitch doc:', error);
  }
}

// Generate a unique pitch doc ID
export function generatePitchDocId(): string {
  return `pitch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create metadata for a pitch doc
export function createPitchDocMetadata(
  pitchDocId: string, 
  title: string, 
  briefId?: string
): PitchDocMetadata {
  return {
    id: pitchDocId,
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'generated',
    briefId
  };
}
