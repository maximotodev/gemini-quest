// frontend/src/App.tsx
import "./App.css";
import React, { useState, useEffect, useCallback } from "react";
import { GameState, TriviaQuestion } from "./types";
import {
  TOTAL_QUESTIONS,
  TIME_PER_QUESTION,
  ANSWER_FEEDBACK_DURATION,
} from "./constants";
import {
  fetchTriviaQuestions, // Changed to fetchTriviaQuestions
  // Import the function to clear the cache
  clearCache,
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
  const [questions, setQuestions] = useState<TriviaQuestion[] | null>(null); // Array of questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false); // New loading state

  const loadQuestions = useCallback(async (category: string) => {
    // Changed name
    setIsLoading(true);
    setError(null);
    setUserAnswer(null);
    try {
      const fetchedQuestions = await fetchTriviaQuestions(category); // Use the new function
      if (fetchedQuestions && fetchedQuestions.length > 0) {
        setQuestions(fetchedQuestions);
        setGameState(GameState.Playing);
        setCurrentQuestionIndex(0); // Reset index
        setScore(0);
        setIsTimerPaused(false);
      } else {
        setError(
          "Failed to load questions. The cosmos is silent. Try a different category or try again."
        );
        setGameState(GameState.SelectingCategory); // Or an error state
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while fetching questions."
      );
      setGameState(GameState.SelectingCategory); // Or an error state
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleStartGame = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      loadQuestions(category); // Changed to loadQuestions
    },
    [loadQuestions]
  );

  const handleAnswer = useCallback(
    (answer: string) => {
      if (gameState !== GameState.Playing || !questions) return; //Check questions

      setIsTimerPaused(true);
      setUserAnswer(answer);
      setGameState(GameState.Answered);

      const currentQuestion = questions[currentQuestionIndex]; // Get current question
      if (currentQuestion && answer === currentQuestion.correctAnswer) {
        setScore((prevScore) => prevScore + 10);
      }

      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setIsTimerPaused(false); // Start timer for next question
          setGameState(GameState.Playing); // Set state back to playing.
          setUserAnswer(null); //Clear answer
        } else {
          setGameState(GameState.GameOver);
        }
      }, ANSWER_FEEDBACK_DURATION);
    },
    [gameState, questions, currentQuestionIndex]
  );

  const handleTimeUp = useCallback(() => {
    if (gameState === GameState.Playing && questions) {
      // Check if questions loaded
      handleAnswer("__TIME_UP__");
    }
  }, [gameState, handleAnswer, questions]);

  const handleRestart = useCallback(async () => {
    // Clear the questions in the frontend
    setQuestions(null);
    setGameState(GameState.SelectingCategory);
    setSelectedCategory(null);
    // Call backend to clear cache
    try {
      await clearCache(); // Call the clearCache function from geminiService
    } catch (error) {
      console.error("Error clearing cache:", error);
      // Optionally: set an error state in frontend
    }
  }, []);

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
    return <StartScreen onStartGame={handleStartGame} isLoading={isLoading} />;
  }

  if (gameState === GameState.LoadingQuestion || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <Loader />
      </div>
    );
  }

  if (gameState === GameState.GameOver) {
    return <EndScreen score={score} onRestart={handleRestart} />;
  }

  if (gameState === GameState.Playing || gameState === GameState.Answered) {
    if (!questions || currentQuestionIndex >= questions.length) {
      return <p>Loading questions...</p>;
    }

    const currentQuestionData = questions[currentQuestionIndex];
    if (!currentQuestionData) {
      return <p>Error: Could not load question.</p>;
    }

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
