import './GameControls.css';

interface GameControlsProps {
  onWrongAnswer: () => void;
  onStealSuccess: () => void;
  onStealFail: () => void;
  onNextRound: () => void;
  onRevealAllAnswers: () => void;
  stealMode: boolean;
  allAnswersRevealed: boolean;
  roundEnded: boolean;
  isLastRound: boolean;
}

function GameControls({
  onWrongAnswer,
  onStealSuccess,
  onStealFail,
  onNextRound,
  onRevealAllAnswers,
  stealMode,
  allAnswersRevealed,
  roundEnded,
  isLastRound
}: GameControlsProps) {
  return (
    <div className="game-controls">
      {!allAnswersRevealed && !stealMode && !roundEnded && (
        <button className="btn-danger control-btn" onClick={onWrongAnswer}>
          Wrong Answer (Strike)
        </button>
      )}

      {stealMode && !roundEnded && (
        <>
          <button className="btn-success control-btn" onClick={onStealSuccess}>
            Steal Successful
          </button>
          <button className="btn-danger control-btn" onClick={onStealFail}>
            Steal Failed
          </button>
        </>
      )}

      {roundEnded && !allAnswersRevealed && (
        <button className="btn-warning control-btn" onClick={onRevealAllAnswers}>
          Reveal Remaining Answers
        </button>
      )}

      {allAnswersRevealed && (
        <button className="btn-primary control-btn" onClick={onNextRound}>
          {isLastRound ? 'End Game' : 'Next Round'}
        </button>
      )}
    </div>
  );
}

export default GameControls;
