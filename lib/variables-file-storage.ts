// Simple file-based storage for variables
import fs from 'fs';
import path from 'path';
import { Brand, Product, Persona, VariableMetadata, VariableType } from './variables-types';

const STORAGE_DIR = path.join(process.cwd(), 'storage', 'variables');

// Ensure storage directory exists
const ensureStorageDir = () => {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
};

// Read all variables from files
export const loadVariablesFromFiles = (): VariableMetadata[] => {
  ensureStorageDir();
  
  const variables: VariableMetadata[] = [];
  
  try {
    const files = fs.readdirSync(STORAGE_DIR);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(STORAGE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const variable = JSON.parse(content);
        
        // Determine type from filename
        let type: VariableType;
        if (file.startsWith('brand_')) {
          type = 'brand';
        } else if (file.startsWith('product_')) {
          type = 'product';
        } else if (file.startsWith('persona_')) {
          type = 'persona';
        } else {
          continue; // Skip unknown types
        }
        
        variables.push({
          id: variable.id,
          name: variable.name,
          type,
          description: generateDescription(variable, type),
          createdAt: variable.createdAt,
          updatedAt: variable.updatedAt,
        });
      }
    }
  } catch (error) {
    console.error('Error loading variables from files:', error);
  }
  
  return variables;
};

// Generate description based on variable type
const generateDescription = (variable: any, type: VariableType): string => {
  switch (type) {
    case 'brand':
      return variable.mission ? `${variable.mission.substring(0, 120)}${variable.mission.length > 120 ? '...' : ''}` : 'No description available';
    case 'product':
      return variable.problemSolved ? `${variable.problemSolved.substring(0, 120)}${variable.problemSolved.length > 120 ? '...' : ''}` : 'No description available';
    case 'persona':
      return variable.demographics ? `${variable.demographics.substring(0, 120)}${variable.demographics.length > 120 ? '...' : ''}` : 'No description available';
    default:
      return 'No description available';
  }
};

// Get individual variable from file
export const getVariableFromFile = (id: string, type: VariableType): Brand | Product | Persona | null => {
  ensureStorageDir();
  
  try {
    const fileName = `${type}_${id}.json`;
    const filePath = path.join(STORAGE_DIR, fileName);
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error reading variable from file:', error);
  }
  
  return null;
};

// Write variable to file
export const writeVariable = (variable: Brand | Product | Persona, type: VariableType): boolean => {
  ensureStorageDir();
  
  try {
    const fileName = `${type}_${variable.id}.json`;
    const filePath = path.join(STORAGE_DIR, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(variable, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing variable to file:', error);
    return false;
  }
};