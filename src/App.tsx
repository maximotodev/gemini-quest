/// <reference types="vite/client" />
import "./App.css";
import React, { useState, useEffect, useCallback } from "react";
import { GameState, TriviaQuestion } from "./types";
import {
  TOTAL_QUESTIONS,
  TIME_PER_QUESTION,
  ANSWER_FEEDBACK_DURATION,
} from "./constants";
import {
  clearAskedQuestions,
  fetchTriviaQuestion,
} from "./services/geminiService";
import StartScreen from "./components/StartScreen";
import QuestionDisplay from "./components/QuestionDisplay";
import Timer from "./components/Timer";
import Scoreboard from "./components/Scoreboard";
import EndScreen from "./components/EndScreen";
import Loader from "./components/Loader";
import Button from "./components/Button";

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(
    GameState.SelectingCategory
  );
  const [currentQuestionData, setCurrentQuestionData] =
    useState<TriviaQuestion | null>(null);
  const [score, setScore] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(true);

  const loadQuestion = useCallback(async (category: string) => {
    setGameState(GameState.LoadingQuestion);
    setError(null);
    setUserAnswer(null);
    try {
      const question = await fetchTriviaQuestion(category);
      if (question) {
        setCurrentQuestionData(question);
        setGameState(GameState.Playing);
        setIsTimerPaused(false);
      } else {
        setError(
          "Failed to load question. The cosmos is silent. Try a different category or try again."
        );
        setGameState(GameState.SelectingCategory); // Or an error state
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while fetching question."
      );
      setGameState(GameState.SelectingCategory); // Or an error state
    }
  }, []);

  const handleStartGame = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      setCurrentQuestionIndex(0);
      setScore(0);
      loadQuestion(category);
    },
    [loadQuestion]
  );

  const handleAnswer = useCallback(
    (answer: string) => {
      if (gameState !== GameState.Playing) return;

      setIsTimerPaused(true);
      setUserAnswer(answer);
      setGameState(GameState.Answered);

      if (answer === currentQuestionData?.correctAnswer) {
        setScore((prevScore) => prevScore + 10);
      }

      setTimeout(() => {
        if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          if (selectedCategory) loadQuestion(selectedCategory);
        } else {
          setGameState(GameState.GameOver);
        }
      }, ANSWER_FEEDBACK_DURATION);
    },
    [
      gameState,
      currentQuestionData,
      currentQuestionIndex,
      selectedCategory,
      loadQuestion,
    ]
  );

  const handleTimeUp = useCallback(() => {
    if (gameState === GameState.Playing) {
      handleAnswer("__TIME_UP__"); // Treat time up as a wrong answer or specific handling
    }
  }, [gameState, handleAnswer]);

  const handleRestart = () => {
    clearAskedQuestions();
    setGameState(GameState.SelectingCategory);
    setCurrentQuestionData(null);
    setSelectedCategory(null);
    // Score and question index are reset in handleStartGame
  };

  // Effect to handle potential API key issues early
  useEffect(() => {
    if (!import.meta.env.VITE_API_KEY) {
      setError(
        "Gemini API Key is missing. Please configure the VITE_API_KEY environment variable."
      );
      setGameState(GameState.Idle); // A state to show this specific error
    }
  }, []);

  if (error && gameState === GameState.Idle) {
    // Specific error for API key
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-red-900 text-white">
        <h1 className="text-3xl font-bold mb-4">Configuration Error</h1>
        <p className="text-lg">{error}</p>
        <p className="text-md mt-2">
          This app requires a Gemini API key to function.
        </p>
      </div>
    );
  }

  if (
    gameState === GameState.SelectingCategory ||
    gameState === GameState.Idle
  ) {
    // Fix: isLoading prop for StartScreen.
    // The StartScreen component is rendered only when gameState is SelectingCategory or Idle.
    // In this context, `gameState === GameState.LoadingQuestion` would always be false.
    // Passing `false` explicitly as isLoading because the global loading state (GameState.LoadingQuestion)
    // is handled by rendering the <Loader /> component, not by an isLoading prop within StartScreen.
    return <StartScreen onStartGame={handleStartGame} isLoading={false} />;
  }

  if (gameState === GameState.LoadingQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <Loader />
      </div>
    );
  }

  if (gameState === GameState.GameOver) {
    return <EndScreen score={score} onRestart={handleRestart} />;
  }

  if (
    (gameState === GameState.Playing || gameState === GameState.Answered) &&
    currentQuestionData
  ) {
    return (
      <div className="flex flex-col items-center min-h-screen p-4 md:p-8 pt-8 md:pt-12">
        <Scoreboard score={score} currentQuestionIndex={currentQuestionIndex} />
        <div className="mb-8">
          <Timer
            key={currentQuestionIndex} // Force re-mount to reset timer state on new question
            initialTime={TIME_PER_QUESTION}
            onTimeUp={handleTimeUp}
            isPaused={isTimerPaused}
          />
        </div>
        <QuestionDisplay
          questionData={currentQuestionData}
          onSelectAnswer={handleAnswer}
          gameState={gameState}
          userAnswer={userAnswer}
        />
        {error && (
          <div className="mt-6 p-4 bg-red-500 text-white rounded-md shadow-lg w-full max-w-2xl text-center">
            <p className="font-semibold">Oops! Something went wrong:</p>
            <p>{error}</p>
            <Button
              onClick={handleRestart}
              variant="secondary"
              className="mt-4 !w-auto px-4 py-2 text-sm"
            >
              Try New Game
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Something went wrong. Current state: {gameState}</p>
      <Button onClick={handleRestart} variant="primary">
        Restart
      </Button>
    </div>
  ); // Fallback
};

export default App;
