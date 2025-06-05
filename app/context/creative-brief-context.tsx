
// imports
import { createContext, useContext, useState, ReactNode } from 'react';

// set types for context
interface CreativeBriefContextType {

    // page 1 context
    briefTitle: string;
    setBriefTitle: (title: string) => void;
    briefDescription: string;
    setBriefDescription: (description: string) => void;
    outputFormat: string;
    setOutputFormat: (format: string) => void;

    // page 2 context
    brandName: string;
    setBrandName: (name: string) => void;
    product: string;
    setProduct: (product: string) => void;
    targetAudience: string;
    setTargetAudience: (targetAudience: string) => void;

    // page 3 context
    toneOrVoice: string;
    setToneOrVoice: (toneOrVoice: string) => void;
    platformOrChannel: string;
    setPlatformOrChannel: (platformOrChannel: string) => void;
    visualStyleOrMood: string;
    setVisualStyleOrMood: (visualStyleOrMood: string) => void;
    referencesOrInspiration: string;
    setReferencesOrInspiration: (referencesOrInspiration: string) => void;
    
}