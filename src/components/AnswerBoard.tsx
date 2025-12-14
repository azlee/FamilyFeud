import { Answer } from "../types";
import "./AnswerBoard.css";
import AnswerCard from "./AnswerCard";

interface AnswerBoardProps {
  answers: Answer[];
  onRevealAnswer: (answerId: string) => void;
}

function AnswerBoard({ answers, onRevealAnswer }: AnswerBoardProps) {
  const sortedAnswers = [...answers].sort((a, b) => b.points - a.points);

  return (
    <div className="answer-board">
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
  );
}

export default AnswerBoard;
