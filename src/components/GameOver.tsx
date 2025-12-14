import { Player } from "../types";
import "./GameOver.css";

interface GameOverProps {
  players: Player[];
  onPlayAgain: () => void;
}

function GameOver({ players, onPlayAgain }: GameOverProps) {
  // Safety check: ensure players is an array
  if (!players || !Array.isArray(players) || players.length === 0) {
    return (
      <div className="game-over">
        <div className="game-over-content">
          <h1 className="game-over-title">Game Over!</h1>
          <p>No player data available</p>
          <button className="btn-primary play-again-btn" onClick={onPlayAgain}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];
  const isTie = sortedPlayers[0].score === sortedPlayers[1].score;

  return (
    <div className="game-over">
      <div className="game-over-content">
        <h1 className="game-over-title">Game Over!</h1>

        {isTie ? (
          <div className="winner-announcement">
            <h2 className="tie-message">It's a Tie!</h2>
          </div>
        ) : (
          <div className="winner-announcement">
            <h2 className="winner-label">Winner</h2>
            <div className="winner-name">{winner.name}</div>
            <div className="winner-score">{winner.score} Points</div>
          </div>
        )}

        <div className="final-scores">
          <h3>Final Scores</h3>
          <div className="scores-list">
            {sortedPlayers.map((player, index) => (
              <div key={player.id} className="score-item">
                <span className="player-rank">#{index + 1}</span>
                <span className="player-name">{player.name}</span>
                <span className="player-final-score">{player.score}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-primary play-again-btn" onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
}

export default GameOver;
