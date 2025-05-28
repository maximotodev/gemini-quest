// frontend/src/services/geminiService.ts
import axios from "axios";
import { TriviaQuestion } from "../types";

const API_BASE_URL = "http://127.0.0.1:5000"; // Adjust if needed

export const fetchTriviaQuestion = async (
  category: string
): Promise<TriviaQuestion | null> => {
  try {
    const response = await axios.post<TriviaQuestion>(
      `${API_BASE_URL}/api/question`,
      { category }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching trivia question:", error);
    return null;
  }
};
