'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-slate-900 border border-slate-700 rounded-2xl ${className}`}>
      {children}
    </div>
  );
}