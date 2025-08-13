'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: 'small' | 'medium' | 'large';
}

export default function Button({ 
  children, 
  variant = "primary", 
  size = 'large',
  className = '',
  ...props
}: ButtonProps) {
  let styles = '';

  // these are the styles for the button depending on the variant
  if (variant === "primary") {
    styles = 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold transition-colors duration-200';
  } else if (variant === "secondary") {
    styles = 'bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-bold transition-colors duration-200';
  }

  // these are the sizes for the button
  let buttonSize = '';
  if (size === 'small') {
    buttonSize = 'px-3 py-1 text-sm';
  } else if (size === 'medium') {
    buttonSize = 'px-4 py-2 text-base';
  } else if (size === 'large') {
    buttonSize = 'px-6 py-3 text-lg';
  }

  // this is the disabled state of the button
  const disabledStyles = props.disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button 
      className={`${styles} ${buttonSize} ${disabledStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
