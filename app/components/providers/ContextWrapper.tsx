'use client';

import { ContextProvider } from '@/app/context/appContext';
import { ReactNode } from 'react';

interface ContextWrapperProps {
  children: ReactNode;
}

export default function ContextWrapper({ children }: ContextWrapperProps) {
  return <ContextProvider>{children}</ContextProvider>;
} 