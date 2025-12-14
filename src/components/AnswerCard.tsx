import { Answer } from '../types';
import './AnswerCard.css';

interface AnswerCardProps {
  answer: Answer;
  number: number;
  onReveal: (answerId: string) => void;
}

function AnswerCard({ answer, number, onReveal }: AnswerCardProps) {
  return (
    <div
      className={`answer-card ${answer.revealed ? 'revealed' : ''}`}
      onClick={() => !answer.revealed && onReveal(answer.id)}
    >
      <div className="card-inner">
        <div className="card-front">
          <div className="answer-number">{number}</div>
        </div>
        <div className="card-back">
          <div className="answer-content">
            <div className="answer-number">{number}</div>
            <div className="answer-text">{answer.text}</div>
            <div className="answer-points">{answer.points}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnswerCard;
