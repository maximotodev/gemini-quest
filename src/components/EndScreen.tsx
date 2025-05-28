
import React from 'react';
import Button from './Button';
import SparklesIcon from './icons/SparklesIcon';
import { TOTAL_QUESTIONS } from '../constants';

interface EndScreenProps {
  score: number;
  onRestart: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ score, onRestart }) => {
  let message = "";
  const percentage = (score / (TOTAL_QUESTIONS * 10)) * 100; // Assuming 10 points per question

  if (percentage >= 80) {
    message = "Outstanding! You're a trivia master!";
  } else if (percentage >= 50) {
    message = "Great job! You know your stuff!";
  } else if (percentage >= 20) {
    message = "Not bad! Keep practicing!";
  } else {
    message = "Better luck next time! Keep learning!";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center animate-fade-in">
      <SparklesIcon className="w-20 h-20 text-brand-primary mb-6" />
      <h1 className="text-5xl font-extrabold mb-4 text-slate-100">Game Over!</h1>
      <p className="text-3xl text-slate-200 mb-4">
        Your Final Score: <span className="text-brand-primary font-bold">{score}</span>
      </p>
      <p className="text-xl text-slate-300 mb-10">{message}</p>
      <div className="w-full max-w-xs">
        <Button onClick={onRestart} variant="primary">
          Play Again?
        </Button>
      </div>
    </div>
  );
};

export default EndScreen;
    