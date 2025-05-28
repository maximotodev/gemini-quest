
import React from 'react';
import { TOTAL_QUESTIONS } from '../constants';

interface ScoreboardProps {
  score: number;
  currentQuestionIndex: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, currentQuestionIndex }) => {
  const progressPercentage = ((currentQuestionIndex +1 ) / TOTAL_QUESTIONS) * 100;

  return (
    <div className="w-full bg-slate-800 p-4 rounded-lg shadow-xl mb-6 animate-fade-in">
      <div className="flex justify-between items-center mb-2 text-lg">
        <span className="font-semibold text-slate-300">Score: <span className="text-brand-primary font-bold">{score}</span></span>
        <span className="font-semibold text-slate-300">Question: <span className="text-brand-primary font-bold">{currentQuestionIndex + 1}</span> / {TOTAL_QUESTIONS}</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-3">
        <div
          className="bg-brand-primary h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Scoreboard;
    