// frontend/src/services/geminiService.ts
import axios from "axios";
import { TriviaQuestion } from "../types";

const API_BASE_URL = "https://gemini-quest.onrender.com"; // Or your deployed backend URL
const askedQuestions: Set<string> = new Set(); // Keep track of asked questions

export const fetchTriviaQuestion = async (
  category: string
): Promise<TriviaQuestion | null> => {
  try {
    let question: TriviaQuestion | null = null;
    let attempts = 0;
    const MAX_ATTEMPTS = 3; // Adjust if needed

    while (!question && attempts < MAX_ATTEMPTS) {
      // Retry logic if we've already asked this questions, only fetch up to 3 times
      const response = await axios.post<TriviaQuestion>(
        `${API_BASE_URL}/api/question`,
        { category }
      );
      const newQuestion = response.data;

      if (!askedQuestions.has(newQuestion.question)) {
        //New questions. Checks if has been asked before. Very likely won't match since using LLM which generates with a degree of randomness, but good defensive coding
        question = newQuestion;
        askedQuestions.add(newQuestion.question);
      } else {
        attempts++;
      }
    }

    if (!question) {
      // Handle the case where no unique question could be found after multiple attempts, may signal bad prompt/configuration issues for the model
      throw new Error(
        "Could not fetch a unique question. Our cosmic reserves are depleted. Please try again or refresh the universe."
      );
    }

    return question;
  } catch (error) {
    // Handle the error and return null or re-throw error for higher-level handling (in App.tsx or elsewhere).

    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.message, error.response?.data);
    } else {
      console.error("An unexpected cosmic event occurred:", error);
    }
    return null;
  }
};

export const clearAskedQuestions = () => {
  askedQuestions.clear();
};
