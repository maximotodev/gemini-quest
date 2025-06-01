// frontend/src/services/geminiService.ts
import axios from "axios";
import { TriviaQuestion } from "../types";

const API_BASE_URL = "https://gemini-quest.onrender.com"; // Or your deployed backend URL

export const fetchTriviaQuestions = async (
  category: string,
  numQuestions: number = 10
): Promise<TriviaQuestion[] | null> => {
  try {
    const response = await axios.post<TriviaQuestion[]>(
      `${API_BASE_URL}/api/questions`, // Changed endpoint
      { category, num_questions: numQuestions } // Pass num_questions
    );
    return response.data; // Return the array of questions
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.message, error.response?.data);
    } else {
      console.error("An unexpected cosmic event occurred:", error);
    }
    return null;
  }
};

export const clearCache = async () => {
  try {
    await axios.post(`${API_BASE_URL}/api/clear_cache`); // Call the new endpoint
  } catch (error) {
    console.error("Error clearing cache:", error);
    // Handle the error (e.g., show a message to the user)
  }
};
