

// these are the props that the button component will receive
type ButtonProps = {
  children: React.ReactNode; // this is the button text
  onClick?: () => void; // this is the function that will be called when the button is clicked
  variant?: "primary" | "secondary"; // this is the variant of the button
  disabled?: boolean; // this is the disabled state of the button
}

// this is the button component
export default function Button({ 
  children, 
  onClick, 
  variant = "primary", 
  disabled = false,
 }: ButtonProps) {

  let styles = '';

  // these are the styles for the button depending on the variant
  if ( variant === "primary" ) {
    styles = 'bg-blue-600 text-white px-4 py-2 rounded w-[400px] h-[52px]';
  } else if ( variant === "secondary" ) {
    styles = 'bg-gray-600 text-white px-4 py-2 rounded w-[400px] h-[52px]';
  }

  // this is the disabled state of the button
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (

    <button 
    className={`${styles} ${disabledStyles} rounded-2xl`} 
    onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
   
  )
}

