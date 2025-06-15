import React from "react";

interface LoaderProps {
  message?: string; // Optional message
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-primary"></div>
      <p className="text-xl text-slate-300">
        {message || "Generating wisdom from the digital cosmos..."}
      </p>
    </div>
  );
};

export default Loader;
