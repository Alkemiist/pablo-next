'use client';

import { ContextProvider } from '@/app/context/appContext';
import { ReactNode } from 'react';

export default function ContextWrapper({ children }: { children: ReactNode }) {
  return <ContextProvider>{children}</ContextProvider>;
} 