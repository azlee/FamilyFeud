import { Answer } from "../types";
import "./AnswerBoard.css";
import AnswerCard from "./AnswerCard";

interface AnswerBoardProps {
  answers: Answer[];
  onRevealAnswer: (answerId: string) => void;
}

function AnswerBoard({ answers, onRevealAnswer }: AnswerBoardProps) {
  const sortedAnswers = [...answers].sort((a, b) => b.points - a.points);

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
