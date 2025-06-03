'use client';

// import { createContext, useState } from "react";
import { createContext, useContext, ReactNode } from "react";

// Define the type for our context data
interface AppContextType {
  mainCharacter: string;
  characters: string[];
}

// Create the context with initial value type
const AppContext = createContext<AppContextType | null>(null);

// Define the props type for the provider
interface ContextProviderProps {
  children: ReactNode;
}

// Create a provider component. This is the context we are providing to the app
export function ContextProvider({ children }: ContextProviderProps) {
    const mainCharacter = 'Pablo';
    const characters = ['Rosy', 'Enzo', 'Finn'];

    return (
        <AppContext.Provider value={{ mainCharacter, characters }}>
            {children}
        </AppContext.Provider>
    );
}

// Create a custom hook to use the context
export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within a ContextProvider');
    }
    return context;
} 