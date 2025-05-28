import React from "react";
import CategorySelector from "./CategorySelector";
import SparklesIcon from "./icons/SparklesIcon";

interface StartScreenProps {
  onStartGame: (category: string) => void;
  isLoading: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  isLoading,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center animate-fade-in">
      <SparklesIcon className="w-24 h-24 text-brand-primary mb-4" />
      <h1 className="text-5xl font-extrabold mb-3 tracking-tight">
        Gemini <span className="text-brand-primary">Quest</span>
      </h1>
      <p className="text-xl text-slate-300 mb-10 max-w-xl">
        Test your knowledge with AI-powered trivia! Questions generated
        dynamically by Gemini.
      </p>
      <div className="w-full max-w-lg">
        <CategorySelector onSelectCategory={onStartGame} disabled={isLoading} />
      </div>
      {isLoading && (
        <p className="mt-6 text-lg text-slate-400">Initializing game...</p>
      )}
    </div>
  );
};

export default StartScreen;
