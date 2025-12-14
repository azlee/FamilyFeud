import { Player } from '../types';
import './GameHeader.css';

interface GameHeaderProps {
  players: Player[];
  currentRound: number;
  totalRounds: number;
}

function GameHeader({ players, currentRound, totalRounds }: GameHeaderProps) {
  return (
    <div className="game-header">
      <div className="player-score player-1">
        <div className="player-name">{players[0].name}</div>
        <div className="player-score-value">{players[0].score}</div>
      </div>

      <div className="round-info">
        <div className="round-label">Round</div>
        <div className="round-number">{currentRound} / {totalRounds}</div>
      </div>

      <div className="player-score player-2">
        <div className="player-name">{players[1].name}</div>
        <div className="player-score-value">{players[1].score}</div>
      </div>
    </div>
  );
}

export default GameHeader;
