'use client';

// these are the props that the button component will receive
type ButtonProps = {
  children: React.ReactNode; // this is the button text
  onClick?: () => void; // Defining the onClick function
  variant?: "primary" | "secondary"; // this is the variant of the button
  disabled?: boolean; // this is the disabled state of the button
  size?: 'small' | 'medium' | 'large'; // this is the size of the button
}

// this is the button component
export default function Button({ 
  children, 
  onClick, 
  variant = "primary", 
  disabled = false,
  size = 'large',
 }: ButtonProps) {

<<<<<<< HEAD
=======

>>>>>>> 45ab8ab93e06582bbc6f4823ff0814afad83b015
  let styles = '';

  // these are the styles for the button depending on the variant
  if ( variant === "primary" ) {
    styles = 'bg-blue-600 text-white px-4 py-4 rounded';
  } else if ( variant === "secondary" ) {
    styles = 'bg-gray-600 text-white px-4 py-4 rounded ';
  }

  //these are the sizes for the button
// let buttonSize = '';

//   if( size === 'small' ) {
//     buttonSize = 'px-4 py-2 rounded w-[100px] h-[32px]';
//   } else if( size === 'medium' ) {
//     buttonSize = 'px-4 py-2 rounded w-[200px] h-[42px]';
//   } else if( size === 'large' ) {
//     buttonSize = 'px-4 py-2 rounded w-[400px] h-[52px]';
//   }

  // this is the disabled state of the button
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (

    <button 
      className={`${styles} ${disabledStyles} rounded font-bold`} 
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
   
  )
}
