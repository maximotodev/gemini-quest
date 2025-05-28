
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'correct' | 'incorrect' | 'neutral';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  let baseStyle = "font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed text-lg w-full";
  
  switch (variant) {
    case 'primary':
      baseStyle += ' bg-brand-primary hover:bg-cyan-500 text-white focus:ring-brand-primary';
      break;
    case 'secondary':
      baseStyle += ' bg-brand-secondary hover:bg-violet-600 text-white focus:ring-brand-secondary';
      break;
    case 'correct':
      baseStyle += ' bg-green-500 hover:bg-green-600 text-white focus:ring-green-500';
      break;
    case 'incorrect':
      baseStyle += ' bg-red-500 hover:bg-red-600 text-white focus:ring-red-500';
      break;
    case 'neutral':
      baseStyle += ' bg-slate-700 hover:bg-slate-600 text-slate-100 focus:ring-slate-500';
      break;
  }

  return (
    <button className={`${baseStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
    