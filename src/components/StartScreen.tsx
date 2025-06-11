// src/components/StartScreen.tsx
import React, { useState } from "react";
import Button from "./Button";
import { categories } from "../constants"; // Import the categories

interface StartScreenProps {
  onStartGame: (category: string) => void;
  isLoading: boolean;
  isStartButtonDisabled: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  isLoading,
  isStartButtonDisabled,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    onStartGame(category);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-8">Gemini Quest</h1>
      <p className="text-lg mb-4">Choose a Category:</p>
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => handleCategoryClick(category)}
            variant="primary"
            disabled={isLoading || isStartButtonDisabled}
            className={`mb-2 !w-auto px-6 py-3 text-lg ${
              selectedCategory === category ? "bg-blue-500 text-white" : ""
            }`}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default StartScreen;
