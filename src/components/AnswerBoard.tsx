import { Answer } from "../types";
import "./AnswerBoard.css";
import AnswerCard from "./AnswerCard";
import { useEffect } from "react";

interface AnswerBoardProps {
  answers: Answer[];
  onRevealAnswer: (answerId: string) => void;
}

function AnswerBoard({ answers, onRevealAnswer }: AnswerBoardProps) {
  const sortedAnswers = [...answers].sort((a, b) => b.points - a.points);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      const numKey = parseInt(key);

      if (!isNaN(numKey) && numKey >= 1 && numKey <= sortedAnswers.length) {
        const answerIndex = numKey - 1;
        const answer = sortedAnswers[answerIndex];

        if (answer && !answer.revealed) {
          onRevealAnswer(answer.id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [sortedAnswers, onRevealAnswer]);

  // Generate light bulbs for each edge
  const generateBulbs = (count: number, offset: number = 0) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className="light-bulb"
        style={{ animationDelay: `${(i + offset) * 0.1}s` }}
      />
    ));
  };

  return (
    <div className="answer-board">
      <div className="board-frame">
        <div className="light-strip top">{generateBulbs(20, 0)}</div>
        <div className="light-strip bottom">{generateBulbs(20, 20)}</div>
        <div className="light-strip left">{generateBulbs(12, 40)}</div>
        <div className="light-strip right">{generateBulbs(12, 52)}</div>

        <div className="answers-grid">
          {sortedAnswers.map((answer, index) => (
            <AnswerCard
              key={answer.id}
              answer={answer}
              number={index + 1}
              onReveal={onRevealAnswer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnswerBoard;
