'use client';

// imports
import { createContext, useContext, useState, ReactNode } from "react";

// Context Types
interface GenBriefContextType {

    briefName: string;
    setBriefName: (value: string) => void;
    brand: string;
    setBrand: (value: string) => void;
    product: string;
    setProduct: (value: string) => void;
    targetAudience: string;
    setTargetAudience: (value: string) => void;
    objective: string;
    setObjective: (value: string) => void;
    toneAndStyle: string;
    setToneAndStyle: (value: string) => void;
    useCase: string; // this is a maybe but could be useful
    setUseCase: (value: string) => void;
    constraints: string;
    setConstraints: (value: string) => void;

}

// Provider props type
interface providerProps {
    children: ReactNode;
}

// initializing the context
const genBriefContext = createContext<GenBriefContextType | null>(null);

// Create the provider function
export function GenBriefProviderFunc( { children }: providerProps ) {

    // States I will keep track of
    const [ briefName, setBriefName ] = useState( '' );
    const [ brand, setBrand ] = useState( '' );
    const [ product, setProduct ] = useState( '' );
    const [ targetAudience, setTargetAudience ] = useState( '' );
    const [ objective, setObjective ] = useState( '' );
    const [ toneAndStyle, setToneAndStyle ] = useState( '' );
    const [ useCase, setUseCase ] = useState( '' );
    const [ constraints, setConstraints ] = useState( '' );

    // the return of the provider
    return (
        <genBriefContext.Provider value={ { briefName, setBriefName, brand, setBrand, product, setProduct, targetAudience, setTargetAudience, objective, setObjective, toneAndStyle, setToneAndStyle, useCase, setUseCase, constraints, setConstraints } }>
            { children }
        </genBriefContext.Provider>
    )

}

// Custom hook
export function useGenBriefData() {
    const context = useContext( genBriefContext );
    if ( !context ) {
        throw new Error( 'useGenBriefData must be used within a GenBriefProvider' );
    }
    return context;
}