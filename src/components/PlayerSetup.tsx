import { Player } from '../types';
import './PlayerSetup.css';

interface PlayerSetupProps {
  players: Player[];
  onChange: (players: Player[]) => void;
}

function PlayerSetup({ players, onChange }: PlayerSetupProps) {
  const handlePlayerNameChange = (index: number, name: string) => {
    const updatedPlayers = players.map((player, i) =>
      i === index ? { ...player, name } : player
    );
    onChange(updatedPlayers);
  };

  return (
    <div className="player-setup">
      <h3 className="section-title">Players</h3>
      <div className="players-grid">
        {players.map((player, index) => (
          <div key={player.id} className="player-input-group">
            <label htmlFor={`player-${index}`}>Player {index + 1}</label>
            <input
              id={`player-${index}`}
              type="text"
              value={player.name}
              onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              placeholder={`Enter Player ${index + 1} name`}
              maxLength={20}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerSetup;
