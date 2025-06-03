/// <reference types="vite/client" />
import "./App.css";
import React, { useState, useEffect, useCallback } from "react";
import { GameState, TriviaQuestion } from "./types";
import {
  TOTAL_QUESTIONS,
  TIME_PER_QUESTION,
  ANSWER_FEEDBACK_DURATION,
} from "./constants";
import { fetchTriviaQuestions } from "./services/geminiService";
import StartScreen from "./components/StartScreen";
import QuestionDisplay from "./components/QuestionDisplay";
import Timer from "./components/Timer";
import Scoreboard from "./components/Scoreboard";
import EndScreen from "./components/EndScreen";
import Loader from "./components/Loader";
import Button from "./components/Button";
import { clearCache } from "./services/geminiService"; // Import clearCache
import { randomFacts2025 } from "./utils/randomFacts";
const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(
    GameState.SelectingCategory
  );
  const [questions, setQuestions] = useState<TriviaQuestion[] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [isStartButtonDisabled, setIsStartButtonDisabled] =
    useState<boolean>(false);
  const [randomFact, setRandomFact] = useState<string | null>(null);
  const [factIntervalId, setFactIntervalId] = useState<NodeJS.Timer | null>(
    null
  ); // State for the interval ID

  const loadQuestions = useCallback(async (category: string) => {
    setIsLoading(true);
    setLoadingMessage("Fetching trivia from the cosmos...");
    setError(null);
    setUserAnswer(null);
    setIsStartButtonDisabled(true);
    setGameState(GameState.LoadingQuestion);
    setRandomFact(null);
    try {
      const fetchedQuestions = await fetchTriviaQuestions(category);
      if (fetchedQuestions && fetchedQuestions.length > 0) {
        setQuestions(fetchedQuestions);
        setGameState(GameState.Playing);
        setCurrentQuestionIndex(0);
        setScore(0);
        setIsTimerPaused(false);
      } else {
        setError(
          "Failed to load questions. The cosmos is silent. Try a different category or try again."
        );
        setGameState(GameState.SelectingCategory);
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while fetching questions."
      );
      setGameState(GameState.SelectingCategory);
    } finally {
      setIsLoading(false);
      setLoadingMessage(null);
      setIsStartButtonDisabled(false);
    }
  }, []);

  const handleStartGame = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      loadQuestions(category);
    },
    [loadQuestions]
  );

  const handleAnswer = useCallback(
    (answer: string) => {
      if (gameState !== GameState.Playing || !questions) return;

      setIsTimerPaused(true);
      setUserAnswer(answer);
      setGameState(GameState.Answered);

      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion && answer === currentQuestion.correctAnswer) {
        setScore((prevScore) => prevScore + 10);
      }

      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setIsTimerPaused(false);
          setGameState(GameState.Playing);
          setUserAnswer(null);
        } else {
          setGameState(GameState.GameOver);
        }
      }, ANSWER_FEEDBACK_DURATION);
    },
    [gameState, questions, currentQuestionIndex]
  );

  const handleTimeUp = useCallback(() => {
    if (gameState === GameState.Playing && questions) {
      handleAnswer("__TIME_UP__");
    }
  }, [gameState, handleAnswer, questions]);

  const handleRestart = useCallback(async () => {
    // Clear the questions
    setQuestions(null);
    setGameState(GameState.SelectingCategory);
    setSelectedCategory(null);
  }, []);

  useEffect(() => {
    // Clear the cache on unmount (browser close/refresh)
    const handleBeforeUnload = async () => {
      try {
        await clearCache();
      } catch (error) {
        console.error("Error clearing cache on unload:", error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up: Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []); // Empty dependency array: Run once on mount and unmount
  // New useEffect for the random fact interval
  useEffect(() => {
    // Function to update the random fact
    const updateFact = () => {
      if (
        isLoading &&
        loadingMessage === "Fetching trivia from the cosmos..."
      ) {
        const fact = randomFacts2025();
        setRandomFact(fact);
      } else {
        setRandomFact(null); // Clear when not loading
      }
    };

    // Set the interval
    const intervalId = setInterval(updateFact, 7000); // 7 seconds (7000 milliseconds)
    setFactIntervalId(intervalId);

    // Clean up the interval on unmount
    return () => {
      clearInterval(intervalId);
      setFactIntervalId(null);
    };
  }, [isLoading, loadingMessage]);

  useEffect(() => {
    if (!import.meta.env.VITE_API_KEY) {
      setError(
        "Gemini API Key is missing. Please configure the VITE_API_KEY environment variable."
      );
      setGameState(GameState.Idle);
    }
  }, []);

  // New useEffect to fetch a random fact while loading questions
  useEffect(() => {
    if (isLoading && loadingMessage === "Fetching trivia from the cosmos...") {
      const fact = randomFacts2025();
      setRandomFact(fact);
    } else {
      setRandomFact(null);
    }
  }, [isLoading, loadingMessage]);

  if (error && gameState === GameState.Idle) {
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

  if (gameState === GameState.SelectingCategory) {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-red-900 text-white">
          <h1 className="text-3xl font-bold mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-lg">{error}</p>
          <Button
            onClick={handleStartGame}
            variant="secondary"
            className="mt-4 !w-auto px-4 py-2 text-sm"
          >
            Try Again
          </Button>
        </div>
      );
    }
    return (
      <StartScreen
        onStartGame={handleStartGame}
        isLoading={isLoading}
        isStartButtonDisabled={isStartButtonDisabled}
      />
    );
  }

  if (gameState === GameState.LoadingQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <Loader />
        {loadingMessage && (
          <p className="mt-4 text-gray-400">{loadingMessage}</p>
        )}
        {randomFact && (
          <p className="mt-2 text-sm italic text-gray-500">
            Did you know? {randomFact}
          </p>
        )}
      </div>
    );
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
            key={currentQuestionIndex}
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
      </div>
    );
  }

  if (gameState === GameState.GameOver) {
    return <EndScreen score={score} onRestart={handleRestart} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Something went wrong. Current state: {gameState}</p>
      <Button onClick={handleRestart} variant="primary">
        Restart
      </Button>
    </div>
  );
};

export default App;
