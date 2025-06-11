import axios from "axios";
import { TriviaQuestion } from "../types";
import { API_BASE_URL } from "../constants";

export const fetchTriviaQuestions = async (
  category: string,
  numQuestions: number
): Promise<TriviaQuestion[] | null> => {
  try {
    const response = await axios.post<TriviaQuestion[]>(
      `${API_BASE_URL}/api/questions`,
      { category, num_questions: numQuestions }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.message, error.response?.data);
    } else {
      console.error("An unexpected cosmic event occurred:", error);
    }
    return null;
  }
};
