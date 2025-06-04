import React, { memo } from "react";
import { TriviaQuestion } from "../types";
import Button from "./Button";

interface QuestionDisplayProps {
  questionData: TriviaQuestion | null;
  onSelectAnswer: (answer: string) => void;
  gameState: "Playing" | "Answered"; // or use your GameState enum
  userAnswer: string | null;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = memo(
  ({ questionData, onSelectAnswer, gameState, userAnswer }) => {
    if (!questionData) {
      return <p>Loading question...</p>;
    }

    return (
      <div>
        <p className="text-2xl mb-4">{questionData.question}</p>
        <div className="grid grid-cols-2 gap-4">
          {questionData.options.map((option) => {
            const isCorrect = option === questionData.correctAnswer;
            const isSelected = userAnswer === option;
            const isAnswered = gameState === "Answered";
            let buttonVariant = "primary"; // Default

            if (isAnswered) {
              buttonVariant = isCorrect
                ? "success"
                : isSelected
                ? "error"
                : "primary";
            }

            return (
              <Button
                key={option}
                onClick={() => onSelectAnswer(option)}
                variant={buttonVariant}
                disabled={isAnswered}
                className="!w-auto px-4 py-3 text-lg"
              >
                {option}
              </Button>
            );
          })}
        </div>
      </div>
    );
  }
);

export default QuestionDisplay;
