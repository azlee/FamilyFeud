import './GameControls.css';

interface GameControlsProps {
  onWrongAnswer: () => void;
  onStealSuccess: () => void;
  onStealFail: () => void;
  onNextRound: () => void;
  stealMode: boolean;
  allAnswersRevealed: boolean;
  isLastRound: boolean;
}

function GameControls({
  onWrongAnswer,
  onStealSuccess,
  onStealFail,
  onNextRound,
  stealMode,
  allAnswersRevealed,
  isLastRound
}: GameControlsProps) {
  return (
    <div className="game-controls">
      {!allAnswersRevealed && !stealMode && (
        <button className="btn-danger control-btn" onClick={onWrongAnswer}>
          Wrong Answer (Strike)
        </button>
      )}

      {stealMode && (
        <>
          <button className="btn-success control-btn" onClick={onStealSuccess}>
            Steal Successful
          </button>
          <button className="btn-danger control-btn" onClick={onStealFail}>
            Steal Failed
          </button>
        </>
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
