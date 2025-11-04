// Variables storage utilities
// Handles localStorage operations for brands, products, and personas

import { Brand, Product, Persona, Trend, VariableType, VariableMetadata, BrandInput, ProductInput, PersonaInput, TrendInput } from './variables-types';

// Storage keys
const BRANDS_KEY = 'variables_brands';
const PRODUCTS_KEY = 'variables_products';
const PERSONAS_KEY = 'variables_personas';
const TRENDS_KEY = 'variables_trends';
const BACKUP_KEY = 'variables_backup';

// Check if we're in browser environment
const isClient = typeof window !== 'undefined';

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Brand operations
export const saveBrand = async (brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Promise<Brand> => {
  const newBrand: Brand = {
    ...brand,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isClient) {
    const existingBrands = getBrands();
    const updatedBrands = [...existingBrands, newBrand];
    localStorage.setItem(BRANDS_KEY, JSON.stringify(updatedBrands));
    
    // Also save to file storage
    try {
      await fetch('/api/variables/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'brand',
          data: newBrand,
        }),
      });
    } catch (error) {
      console.warn('Failed to save to file storage:', error);
    }
  }
  
  return newBrand;
};

export const updateBrand = async (id: string, brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Promise<Brand | null> => {
  if (!isClient) return null;

  const existingBrands = getBrands();
  const brandIndex = existingBrands.findIndex(b => b.id === id);
  
  let updatedBrand: Brand;
  
  if (brandIndex === -1) {
    // Brand not in localStorage, create new entry
    updatedBrand = {
      ...brand,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    existingBrands.push(updatedBrand);
  } else {
    // Brand exists in localStorage, update it
    updatedBrand = {
      ...brand,
      id,
      createdAt: existingBrands[brandIndex].createdAt,
      updatedAt: new Date().toISOString(),
    };
    existingBrands[brandIndex] = updatedBrand;
  }

  localStorage.setItem(BRANDS_KEY, JSON.stringify(existingBrands));
  
  // Also save to file storage
  try {
    await fetch('/api/variables/files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'brand',
        data: updatedBrand,
      }),
    });
  } catch (error) {
    console.warn('Failed to save to file storage:', error);
  }
  
  return updatedBrand;
};

export const getBrands = (): Brand[] => {
  if (!isClient) return [];
  
  try {
    const brands = localStorage.getItem(BRANDS_KEY);
    return brands ? JSON.parse(brands) : [];
  } catch (error) {
    console.error('Error loading brands:', error);
    return [];
  }
};

export const getBrand = (id: string): Brand | null => {
  const brands = getBrands();
  return brands.find(brand => brand.id === id) || null;
};

export const deleteBrand = (id: string): boolean => {
  if (!isClient) return false;

  const existingBrands = getBrands();
  const updatedBrands = existingBrands.filter(brand => brand.id !== id);
  
  if (updatedBrands.length === existingBrands.length) return false;
  
  localStorage.setItem(BRANDS_KEY, JSON.stringify(updatedBrands));
  return true;
};

// Product operations
export const saveProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  const newProduct: Product = {
    ...product,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isClient) {
    const existingProducts = getProducts();
    const updatedProducts = [...existingProducts, newProduct];
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
    
    // Also save to file storage
    try {
      await fetch('/api/variables/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'product',
          data: newProduct,
        }),
      });
    } catch (error) {
      console.warn('Failed to save to file storage:', error);
    }
  }
  
  return newProduct;
};

export const updateProduct = async (id: string, product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product | null> => {
  console.log('updateProduct called with ID:', id);
  console.log('updateProduct data:', product);
  
  if (!isClient) {
    console.log('Not in client, returning null');
    return null;
  }

  const existingProducts = getProducts();
  console.log('Existing products:', existingProducts);
  const productIndex = existingProducts.findIndex(p => p.id === id);
  console.log('Product index:', productIndex);
  
  let updatedProduct: Product;
  
  if (productIndex === -1) {
    console.log('Product not found in localStorage, creating new entry');
    // Product not in localStorage, create new entry with current data
    updatedProduct = {
      ...product,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Add to localStorage
    existingProducts.push(updatedProduct);
  } else {
    console.log('Product found in localStorage, updating existing');
    // Product exists in localStorage, update it
    updatedProduct = {
      ...product,
      id,
      createdAt: existingProducts[productIndex].createdAt,
      updatedAt: new Date().toISOString(),
    };
    existingProducts[productIndex] = updatedProduct;
  }

  console.log('Updated product:', updatedProduct);

  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(existingProducts));
  console.log('Saved to localStorage');
  
  // Also save to file storage
  try {
    console.log('Sending to file storage...');
    const response = await fetch('/api/variables/files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'product',
        data: updatedProduct,
      }),
    });
    console.log('File storage response:', response.status);
    const result = await response.json();
    console.log('File storage result:', result);
  } catch (error) {
    console.warn('Failed to save to file storage:', error);
  }
  
  return updatedProduct;
};

export const getProducts = (): Product[] => {
  if (!isClient) return [];
  
  try {
    const products = localStorage.getItem(PRODUCTS_KEY);
    return products ? JSON.parse(products) : [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

export const getProduct = (id: string): Product | null => {
  const products = getProducts();
  return products.find(product => product.id === id) || null;
};

export const deleteProduct = (id: string): boolean => {
  if (!isClient) return false;

  const existingProducts = getProducts();
  const updatedProducts = existingProducts.filter(product => product.id !== id);
  
  if (updatedProducts.length === existingProducts.length) return false;
  
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
  return true;
};

// Persona operations
export const savePersona = async (persona: Omit<Persona, 'id' | 'createdAt' | 'updatedAt'>): Promise<Persona> => {
  const newPersona: Persona = {
    ...persona,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isClient) {
    const existingPersonas = getPersonas();
    const updatedPersonas = [...existingPersonas, newPersona];
    localStorage.setItem(PERSONAS_KEY, JSON.stringify(updatedPersonas));
    
    // Also save to file storage
    try {
      await fetch('/api/variables/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'persona',
          data: newPersona,
        }),
      });
    } catch (error) {
      console.warn('Failed to save to file storage:', error);
    }
  }
  
  return newPersona;
};

export const updatePersona = async (id: string, persona: Omit<Persona, 'id' | 'createdAt' | 'updatedAt'>): Promise<Persona | null> => {
  if (!isClient) return null;

  const existingPersonas = getPersonas();
  const personaIndex = existingPersonas.findIndex(p => p.id === id);
  
  let updatedPersona: Persona;
  
  if (personaIndex === -1) {
    // Persona not in localStorage, create new entry
    updatedPersona = {
      ...persona,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    existingPersonas.push(updatedPersona);
  } else {
    // Persona exists in localStorage, update it
    updatedPersona = {
      ...persona,
      id,
      createdAt: existingPersonas[personaIndex].createdAt,
      updatedAt: new Date().toISOString(),
    };
    existingPersonas[personaIndex] = updatedPersona;
  }

  localStorage.setItem(PERSONAS_KEY, JSON.stringify(existingPersonas));
  
  // Also save to file storage
  try {
    await fetch('/api/variables/files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'persona',
        data: updatedPersona,
      }),
    });
  } catch (error) {
    console.warn('Failed to save to file storage:', error);
  }
  
  return updatedPersona;
};

export const getPersonas = (): Persona[] => {
  if (!isClient) return [];
  
  try {
    const personas = localStorage.getItem(PERSONAS_KEY);
    return personas ? JSON.parse(personas) : [];
  } catch (error) {
    console.error('Error loading personas:', error);
    return [];
  }
};

export const getPersona = (id: string): Persona | null => {
  const personas = getPersonas();
  return personas.find(persona => persona.id === id) || null;
};

export const deletePersona = (id: string): boolean => {
  if (!isClient) return false;

  const existingPersonas = getPersonas();
  const updatedPersonas = existingPersonas.filter(persona => persona.id !== id);
  
  if (updatedPersonas.length === existingPersonas.length) return false;
  
  localStorage.setItem(PERSONAS_KEY, JSON.stringify(updatedPersonas));
  return true;
};

// Generic operations
export const getAllVariables = (): VariableMetadata[] => {
  const brands = getBrands().map(brand => ({
    id: brand.id,
    name: brand.name,
    type: 'brand' as VariableType,
    description: generateBrandSummary(brand),
    createdAt: brand.createdAt,
    updatedAt: brand.updatedAt,
  }));

  const products = getProducts().map(product => ({
    id: product.id,
    name: product.name,
    type: 'product' as VariableType,
    description: generateProductSummary(product),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }));

  const personas = getPersonas().map(persona => ({
    id: persona.id,
    name: persona.name, // Use the stored generated name
    type: 'persona' as VariableType,
    description: generatePersonaSummary(persona),
    createdAt: persona.createdAt,
    updatedAt: persona.updatedAt,
  }));

  const trends = getTrends().map(trend => ({
    id: trend.id,
    name: trend.name,
    type: 'trend' as VariableType,
    description: generateTrendSummary(trend),
    createdAt: trend.createdAt,
    updatedAt: trend.updatedAt,
  }));

  return [...brands, ...products, ...personas, ...trends];
};

export const getVariable = (id: string, type: VariableType): Brand | Product | Persona | Trend | null => {
  switch (type) {
    case 'brand':
      return getBrand(id);
    case 'product':
      return getProduct(id);
    case 'persona':
      return getPersona(id);
    case 'trend':
      return getTrend(id);
    default:
      return null;
  }
};

export const deleteVariable = (id: string, type: VariableType): boolean => {
  switch (type) {
    case 'brand':
      return deleteBrand(id);
    case 'product':
      return deleteProduct(id);
    case 'persona':
      return deletePersona(id);
    case 'trend':
      return deleteTrend(id);
    default:
      return false;
  }
};

// Helper functions for generating summaries and names
const generateBrandSummary = (brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): string => {
  return brand.mission ? `${brand.mission.substring(0, 60)}${brand.mission.length > 60 ? '...' : ''}` : 'No description available';
};

const generateProductSummary = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): string => {
  return product.problemSolved ? `${product.problemSolved.substring(0, 50)}${product.problemSolved.length > 50 ? '...' : ''}` : 'No description available';
};

const generatePersonaSummary = (persona: Omit<Persona, 'id' | 'createdAt' | 'updatedAt'>): string => {
  return persona.demographics ? `${persona.demographics.substring(0, 40)}${persona.demographics.length > 40 ? '...' : ''}` : 'No description available';
};

const generateTrendSummary = (trend: Omit<Trend, 'id' | 'createdAt' | 'updatedAt'>): string => {
  return trend.description ? `${trend.description.substring(0, 120)}${trend.description.length > 120 ? '...' : ''}` : 'No description available';
};

// Generate a name for persona based on demographics
export const generatePersonaName = (persona: Omit<Persona, 'id' | 'createdAt' | 'updatedAt'>): string => {
  // Extract key demographic info for name generation
  const demographics = persona.demographics.toLowerCase();
  
  // Simple name generation based on common demographic patterns
  if (demographics.includes('millennial') || demographics.includes('gen y')) {
    return 'The Millennial Professional';
  } else if (demographics.includes('gen z') || demographics.includes('gen-z')) {
    return 'The Gen Z Digital Native';
  } else if (demographics.includes('gen x') || demographics.includes('gen-x')) {
    return 'The Gen X Professional';
  } else if (demographics.includes('boomer') || demographics.includes('baby boomer')) {
    return 'The Baby Boomer';
  } else if (demographics.includes('student')) {
    return 'The Student';
  } else if (demographics.includes('professional') || demographics.includes('working')) {
    return 'The Working Professional';
  } else if (demographics.includes('parent') || demographics.includes('family')) {
    return 'The Family-Oriented Parent';
  } else if (demographics.includes('entrepreneur') || demographics.includes('business owner')) {
    return 'The Entrepreneur';
  } else if (demographics.includes('senior') || demographics.includes('retired')) {
    return 'The Senior Citizen';
  } else {
    return 'The Target Persona';
  }
};
// Trend operations
export const saveTrend = async (trend: Omit<Trend, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trend> => {
  const newTrend: Trend = {
    ...trend,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isClient) {
    const existingTrends = getTrends();
    const updatedTrends = [...existingTrends, newTrend];
    localStorage.setItem(TRENDS_KEY, JSON.stringify(updatedTrends));
    
    // Also save to file storage
    try {
      await fetch('/api/variables/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'trend',
          data: newTrend,
        }),
      });
    } catch (error) {
      console.warn('Failed to save to file storage:', error);
    }
  }
  
  return newTrend;
};

export const updateTrend = async (id: string, trend: Omit<Trend, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trend | null> => {
  if (!isClient) return null;

  const existingTrends = getTrends();
  const trendIndex = existingTrends.findIndex(t => t.id === id);
  
  let updatedTrend: Trend;
  
  if (trendIndex === -1) {
    updatedTrend = {
      ...trend,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    existingTrends.push(updatedTrend);
  } else {
    updatedTrend = {
      ...trend,
      id,
      createdAt: existingTrends[trendIndex].createdAt,
      updatedAt: new Date().toISOString(),
    };
    existingTrends[trendIndex] = updatedTrend;
  }

  localStorage.setItem(TRENDS_KEY, JSON.stringify(existingTrends));
  
  try {
    await fetch('/api/variables/files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'trend',
        data: updatedTrend,
      }),
    });
  } catch (error) {
    console.warn('Failed to save to file storage:', error);
  }
  
  return updatedTrend;
};

export const getTrends = (): Trend[] => {
  if (!isClient) return [];
  
  try {
    const trends = localStorage.getItem(TRENDS_KEY);
    return trends ? JSON.parse(trends) : [];
  } catch (error) {
    console.error('Error loading trends:', error);
    return [];
  }
};

export const getTrend = (id: string): Trend | null => {
  const trends = getTrends();
  return trends.find(trend => trend.id === id) || null;
};

export const deleteTrend = (id: string): boolean => {
  if (!isClient) return false;

  const existingTrends = getTrends();
  const updatedTrends = existingTrends.filter(trend => trend.id !== id);
  
  if (updatedTrends.length === existingTrends.length) return false;
  
  localStorage.setItem(TRENDS_KEY, JSON.stringify(updatedTrends));
  return true;
};
