
import React, { useEffect, useState } from 'react';

interface TimerProps {
  initialTime: number;
  onTimeUp: () => void;
  isPaused: boolean;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp, isPaused }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime); // Reset timer when initialTime changes (new question)
  }, [initialTime]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, isPaused]);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);
  
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (timeLeft / initialTime) * circumference;

  let colorClass = 'text-green-400 stroke-green-400';
  if (timeLeft <= initialTime * 0.5) colorClass = 'text-yellow-400 stroke-yellow-400';
  if (timeLeft <= initialTime * 0.25) colorClass = 'text-red-400 stroke-red-400';


  return (
    <div className="relative w-28 h-28">
       <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          className="text-slate-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          className={`${colorClass.split(' ')[1]} transition-all duration-500 ease-linear`}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${colorClass.split(' ')[0]}`}>
        {timeLeft}
      </div>
    </div>
  );
};

export default Timer;
    