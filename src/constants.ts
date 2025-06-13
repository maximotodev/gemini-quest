// src/constants.ts
export const TOTAL_QUESTIONS = 10;
export const TIME_PER_QUESTION = 20;
export const ANSWER_FEEDBACK_DURATION = 2000;
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000"; // Default value
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
