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
  );
  const [explanation, setExplanation] = useState<string | null>(null);
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set()); // Keep track of questions

  const loadQuestions = useCallback(
    async (category: string) => {
      setIsLoading(true);
      setLoadingMessage("Fetching trivia from the cosmos...");
      setError(null);
      setUserAnswer(null);
      setExplanation(null);
      setIsStartButtonDisabled(true);
      setGameState(GameState.LoadingQuestion);
      setRandomFact(null);
      try {
        const fetchedQuestions = await fetchTriviaQuestions(
          category,
          TOTAL_QUESTIONS
        );
        if (fetchedQuestions && fetchedQuestions.length > 0) {
          // Filter out already asked questions, if any.
          const uniqueQuestions = fetchedQuestions.filter(
            (question) => !askedQuestions.has(question.question)
          );
          if (uniqueQuestions.length < TOTAL_QUESTIONS) {
            setError(
              "Not enough unique questions available in this category. Please try a different category."
            );
            setGameState(GameState.SelectingCategory);
            return;
          }

          setQuestions(uniqueQuestions);
          setGameState(GameState.Playing);
          setCurrentQuestionIndex(0);
          setScore(0);
          setIsTimerPaused(false);
          setAskedQuestions(
            (prevAsked) =>
              new Set([...prevAsked, ...uniqueQuestions.map((q) => q.question)])
          );
        } else {
          setError(
            "Oh no! Failed to load questions. The cosmos is silent.  Please try again or select a different category."
          ); // Apology Message
          setGameState(GameState.SelectingCategory);
        }
      } catch (err: any) {
        // Explicitly type 'err' as 'any' or 'Error'
        console.error(err);
        setError(
          `We're so sorry, something went wrong while fetching questions. Please try again, or select a different category. Detailed error: ${
            err?.message || "An unknown error occurred" // Use optional chaining
          }` // Apology Message and Detail
        );
        setGameState(GameState.SelectingCategory);
      } finally {
        setIsLoading(false);
        setLoadingMessage(null);
        setIsStartButtonDisabled(false);
      }
    },
    [askedQuestions]
  );

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
      if (currentQuestion) {
        if (answer === currentQuestion.correctAnswer) {
          setScore((prevScore) => prevScore + 10);
        }
        setExplanation(
          currentQuestion.explanation || "No explanation available."
        );
      }

      setTimeout(() => {
        if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setIsTimerPaused(false);
          setGameState(GameState.Playing);
          setUserAnswer(null);
          setExplanation(null); // Clear explanation for the next question
        } else {
          setGameState(GameState.GameOver);
        }
      }, ANSWER_FEEDBACK_DURATION + 3000); // Add 4 second delay.
    },
    [gameState, questions, currentQuestionIndex]
  );

  const handleTimeUp = useCallback(() => {
    if (gameState === GameState.Playing && questions) {
      handleAnswer("__TIME_UP__");
    }
  }, [gameState, handleAnswer, questions]);

  const handleRestart = () => {
    setQuestions(null);
    setGameState(GameState.SelectingCategory);
    setSelectedCategory(null);
    setExplanation(null); // Clear explanation on restart
    setAskedQuestions(new Set()); // Reset the asked questions
  };

  const handleReload = () => {
    window.location.reload(); // Reload the entire page
  };

  useEffect(() => {
    // Clear the cache on unmount (browser close/refresh)
    const handleBeforeUnload = async () => {
      console.log("No Cache Clearing Needed");
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
        <Loader message={loadingMessage} /> {/* Use message prop */}
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
    if (!questions || currentQuestionIndex >= TOTAL_QUESTIONS) {
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
        {explanation && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md shadow-md text-sm">
            <p className="font-semibold">Explanation:</p>
            <p>{explanation}</p>
          </div>
        )}
      </div>
    );
  }

  if (gameState === GameState.GameOver) {
    return <EndScreen score={score} onRestart={handleRestart} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      {error ? (
        <div className="text-center">
          <p className="text-red-500 mb-4">
            We're very sorry, but an error occurred: {error}
          </p>
          <Button onClick={handleReload} variant="primary">
            Reload Page
          </Button>
        </div>
      ) : (
        <>
          <p>Something went wrong. Current state: {gameState}</p>
          <Button onClick={handleRestart} variant="primary">
            Restart
          </Button>
        </>
      )}
    </div>
  );
};

export default App;
