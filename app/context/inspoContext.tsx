'use client'

// imports
import { createContext, useContext, useState, ReactNode } from 'react';

// context types
interface InspoContextType {
    brand: string;
    setBrand: (value: string) => void;
    product: string;
    setProduct: (value: string) => void;
    persona: string;
    setPersona: (value: string) => void;
    goal: string;
    setGoal: (value: string) => void;
    visualGuide: string;
    setVisualGuide: (value: string) => void;
}

// provider props type
interface providerProps {
    children: ReactNode;
}

// create the context
const InspoContext = createContext<InspoContextType | undefined>(undefined);

// create the provider
export const InspoProvider = ({ children }: providerProps) => {
    const [brand, setBrand] = useState('');
    const [product, setProduct] = useState('');
    const [persona, setPersona] = useState('');
    const [goal, setGoal] = useState('');
    const [visualGuide, setVisualGuide] = useState('');

    return (
        <InspoContext.Provider value={{ brand, setBrand, product, setProduct, persona, setPersona, goal, setGoal, visualGuide, setVisualGuide }}>
            {children}
        </InspoContext.Provider>
    )
}

// create the hook
export const useInspoContext = () => {
    const context = useContext(InspoContext);
    if (!context) {
        throw new Error('useInspo must be used within an InspoProvider');
    }
    return context;
}