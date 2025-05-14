'use client';

// Imports
import { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for our context data
interface BriefContextType {

    briefName: string;
    setBriefName: (value: string) => void;
    brandDescription: string;
    setBrandDescription: (value: string) => void;
    productDescription: string;
    setProductDescription: (value: string) => void;
    targetAudience: string;
    setTargetAudience: (value: string) => void;
    intent: string;
    setIntent: (value: string) => void;
    tactics: string;
    setTactics: (value: string) => void;
    message: string;
    setMessage: (value: string) => void;
    objective: string;
    setObjective: (value: string) => void;
    tone: string;
    setTone: (value: string) => void;
    style: string;
    setStyle: (value: string) => void;
    
}

// create the context
const briefContext = createContext<BriefContextType | null>(null);

// provider props
interface providerProps {
    children: ReactNode;
}

// create provider 
export function BriefProviderFunc( { children }: providerProps ) {

    // here is the state of what I am going to keep track of
    const [ briefName, setBriefName ] = useState( '' );
    const [ brandDescription, setBrandDescription ] = useState( '' );
    const [ productDescription, setProductDescription ] = useState( '' );
    const [ targetAudience, setTargetAudience ] = useState( '' );
    const [ intent, setIntent ] = useState( '' );
    const [ tactics, setTactics ] = useState( '' );
    const [ message, setMessage ] = useState( '' );
    const [ objective, setObjective ] = useState( '' );
    const [ tone, setTone ] = useState( '' );
    const [ style, setStyle ] = useState( '' );
    

    // the return of the provider
    return (
        <briefContext.Provider value={ { briefName, setBriefName, brandDescription, setBrandDescription, productDescription, setProductDescription, targetAudience, setTargetAudience, intent, setIntent, tactics, setTactics, message, setMessage, objective, setObjective, tone, setTone, style, setStyle } }>
            { children }
        </briefContext.Provider>
    )
        
}

// Custom hook
export function useBriefData() {
    const context = useContext( briefContext );
    if ( !context ) {
        throw new Error( 'useBriefData must be used within a BriefProvider' );
    }
    return context;
}