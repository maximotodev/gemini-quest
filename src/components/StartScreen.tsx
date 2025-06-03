// src/components/StartScreen.tsx
import React from "react";
import Button from "./Button";

interface StartScreenProps {
  onStartGame: (category: string) => void;
  isLoading: boolean;
  isStartButtonDisabled: boolean;
}

const categories = [
  "General Knowledge",
  "Science",
  "Pop Culture",
  "History",
  "Geography",
  "Computers",
];

const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  isLoading,
  isStartButtonDisabled,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-8">Gemini Trivia Quest</h1>
      <p className="text-lg mb-4">Choose a Category:</p>
      {categories.map((category) => (
        <Button
          key={category}
          onClick={() => onStartGame(category)}
          variant="primary"
          disabled={isLoading || isStartButtonDisabled} //Disable button
          className="mb-2 !w-auto px-6 py-3 text-lg"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default StartScreen;
