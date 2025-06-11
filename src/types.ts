export interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string; // Add explanation, make it optional with ?
}

export interface GeminiResponseFormat {
  question: string;
  options: string[];
  correctAnswer: string;
}

export enum GameState {
  Idle = "idle",
  SelectingCategory = "selectingCategory",
  LoadingQuestion = "loadingQuestion",
  Playing = "playing",
  Answered = "answered",
  GameOver = "gameOver",
}
