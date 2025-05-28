
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-primary"></div>
      <p className="text-xl text-slate-300">Generating wisdom from the digital cosmos...</p>
    </div>
  );
};

export default Loader;
    