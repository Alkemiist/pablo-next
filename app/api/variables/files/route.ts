import { NextRequest, NextResponse } from 'next/server';
import { loadVariablesFromFiles, getVariableFromFile, writeVariable } from '@/lib/variables-file-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');
    
    // Handle individual variable request
    if (id && type) {
      const variable = getVariableFromFile(id, type as any);
      if (variable) {
        return NextResponse.json({ 
          success: true, 
          variable 
        });
      } else {
        return NextResponse.json(
          { success: false, message: 'Variable not found' },
          { status: 404 }
        );
      }
    }
    
    // Return all variables
    const variables = loadVariablesFromFiles();
    return NextResponse.json({ 
      success: true, 
      variables 
    });
  } catch (error) {
    console.error('Error getting variables from files:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get variables' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;
    
    if (!type || !data) {
      return NextResponse.json(
        { success: false, message: 'Missing type or data' },
        { status: 400 }
      );
    }
    
    // Ensure the data has required fields
    const variableData = {
      ...data,
      id: data.id || `temp_${Date.now()}`,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Save to file storage
    const success = writeVariable(variableData, type);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Variable saved successfully',
        variable: variableData
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to save variable' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error saving variable to files:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save variable' },
      { status: 500 }
    );
  }
}