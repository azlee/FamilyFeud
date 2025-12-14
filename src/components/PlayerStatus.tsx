import { Player } from '../types';
import './PlayerStatus.css';

interface PlayerStatusProps {
  currentPlayer: Player;
  strikes: number;
  stealMode: boolean;
}

function PlayerStatus({ currentPlayer, strikes, stealMode }: PlayerStatusProps) {
  return (
    <div className="player-status">
      <div className="current-turn">
        <div className="turn-label">
          {stealMode ? 'STEAL OPPORTUNITY' : 'Current Turn'}
        </div>
        <div className="current-player-name">{currentPlayer.name}</div>
      </div>

      <div className="strikes-display">
        <div className="strikes-label">Strikes</div>
        <div className="strikes-container">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`strike ${num <= strikes ? 'active' : ''}`}
            >
              X
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlayerStatus;
