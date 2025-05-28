
import React from 'react';
import { TriviaQuestion, GameState } from '../types';
import Button from './Button';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';

interface QuestionDisplayProps {
  questionData: TriviaQuestion;
  onSelectAnswer: (answer: string) => void;
  gameState: GameState;
  userAnswer: string | null;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  questionData,
  onSelectAnswer,
  gameState,
  userAnswer,
}) => {
  const { question, options, correctAnswer } = questionData;
  const isAnswered = gameState === GameState.Answered;

  const getButtonVariant = (option: string): 'correct' | 'incorrect' | 'neutral' => {
    if (!isAnswered) return 'neutral';
    if (option === correctAnswer) return 'correct';
    if (option === userAnswer && option !== correctAnswer) return 'incorrect';
    return 'neutral';
  };

  return (
    <div className="w-full max-w-2xl p-6 bg-slate-800 rounded-xl shadow-2xl animate-slide-in-bottom">
      <h2 className="text-2xl md:text-3xl font-semibold text-center text-slate-100 mb-8 leading-tight" dangerouslySetInnerHTML={{ __html: question }}></h2>
      <div className="space-y-4">
        {options.map((option, index) => {
          const variant = getButtonVariant(option);
          const isSelectedIncorrect = isAnswered && option === userAnswer && option !== correctAnswer;
          const isActualCorrect = isAnswered && option === correctAnswer;

          return (
            <Button
              key={index}
              onClick={() => onSelectAnswer(option)}
              disabled={isAnswered}
              variant={variant}
              className={`flex items-center justify-between ${
                isAnswered && variant === 'neutral' ? 'opacity-60' : ''
              }`}
            >
              <span dangerouslySetInnerHTML={{ __html: option }}></span>
              {isActualCorrect && <CheckIcon className="w-6 h-6 text-white" />}
              {isSelectedIncorrect && <XIcon className="w-6 h-6 text-white" />}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionDisplay;
    