'use client';

import { MouseEvent, ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({
    children,
    variant = 'primary',
    disabled = false,
    fullWidth = false,
    onClick,
  }: ButtonProps) {
    let style = '';
  
    if (variant === 'primary') {
      style = 'bg-blue-600 text-white hover:bg-blue-700';
    } else if (variant === 'secondary') {
      style = 'bg-gray-200 text-black hover:bg-gray-300';
    } else if (variant === 'outline') {
      style = 'border border-gray-500 text-black hover:bg-gray-100';
    }
  
    const width = fullWidth ? 'w-full' : '';
    const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
    return (
      <button
        disabled={disabled}
        onClick={onClick}
        className={`px-4 py-2 rounded ${style} ${width} ${disabledStyle}`}
      >
        {children}
      </button>
    );
  }