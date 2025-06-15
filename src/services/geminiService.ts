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

    if (response.status !== 200) {
      // Added status code check
      console.error(
        "Failed to fetch questions.  Status code:",
        response.status
      );
      throw new Error(`HTTP error! Status: ${response.status}`); // Throw an error
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.message, error.response?.data);
      // More specific error message for Axios errors
      throw new Error(
        `Failed to fetch trivia questions: ${error.message}.  Please check your network connection or try again later.`
      );
    } else {
      console.error("An unexpected cosmic event occurred:", error);
      // More general error message for unexpected errors
      throw new Error(
        "An unexpected error occurred while fetching questions. Please try again later."
      );
    }
  }
};
