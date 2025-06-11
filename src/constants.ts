// src/constants.ts
export const TOTAL_QUESTIONS = 10;
export const TIME_PER_QUESTION = 20; // Seconds
export const ANSWER_FEEDBACK_DURATION = 2000; // Milliseconds (2 seconds)
export const API_BASE_URL = "http://127.0.0.1:5000"; // Or your deployed backend URL
export const categories = [
  "General Knowledge",
  "Science",
  "Bitcoin",
  "History",
  "Pop Culture",
  "Geography",
  "Computers",
  "Brain Teasers",
];

export enum GameState { //  <--- This is the fix to use
  Idle,
  SelectingCategory,
  LoadingQuestion,
  Playing,
  Answered,
  GameOver,
}
