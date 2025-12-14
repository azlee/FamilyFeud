export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface Answer {
  id: string;
  text: string;
  points: number;
  revealed: boolean;
}

export interface Question {
  id: string;
  question: string;
  answers: Answer[];
}

export type GameMode = "setup" | "playing" | "gameover";

export type FaceOffPhase =
  | "buzzer"
  | "firstGuess"
  | "secondGuess"
  | "passOrPlay";

export interface FaceOffResult {
  startingPlayerIndex: number;
  passOrPlay: "pass" | "play";
  revealedAnswerIds: string[];
  pointsEarned: number;
}

export interface GameState {
  mode: GameMode;
  players: Player[];
  questions: Question[];
  currentRound: number;
  currentPlayerIndex: number;
  strikes: number;
  stealAttemptMode: boolean;
}
