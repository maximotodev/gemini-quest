// Button.tsx
import React from "react";

interface ButtonProps {
  variant: "primary" | "secondary" | "success" | "error"; // Add 'success' and 'error'
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  children,
  onClick,
  disabled,
  className,
}) => {
  let baseClasses =
    "inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150";
  let variantClasses = "";

  switch (variant) {
    case "primary":
      variantClasses = "bg-blue-500 hover:bg-blue-700 text-white shadow";
      break;
    case "secondary":
      variantClasses = "bg-gray-200 hover:bg-gray-300 text-gray-800 shadow";
      break;
    case "success":
      variantClasses = "bg-green-500 hover:bg-green-700 text-white shadow"; // Tailwind classes for success
      break;
    case "error":
      variantClasses = "bg-red-500 hover:bg-red-700 text-white shadow"; // Tailwind classes for error
      break;
    default:
      variantClasses = "bg-gray-200 hover:bg-gray-300 text-gray-800 shadow"; // Default style
  }

  const combinedClasses = `${baseClasses} ${variantClasses} ${className || ""}`; // Combine all the classes

  return (
    <button onClick={onClick} disabled={disabled} className={combinedClasses}>
      {children}
    </button>
  );
};

export default Button;
