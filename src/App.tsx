import { useState } from 'react';
import { GameMode, Player, Question } from './types';
import GameSetup from './components/GameSetup';
import GamePlay from './components/GamePlay';
import GameOver from './components/GameOver';
import './App.css';

function App() {
  const [gameMode, setGameMode] = useState<GameMode>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleStartGame = (gamePlayers: Player[], gameQuestions: Question[]) => {
    setPlayers(gamePlayers);
    setQuestions(gameQuestions);
    setGameMode('playing');
  };

  const handleGameOver = (finalPlayers: Player[]) => {
    setPlayers(finalPlayers);
    setGameMode('gameover');
  };

  const handlePlayAgain = () => {
    setGameMode('setup');
    setPlayers([]);
    setQuestions([]);
  };

  return (
    <div className="App">
      <h1 className="app-title">FAMILY FEUD</h1>

      {gameMode === 'setup' && (
        <GameSetup onStartGame={handleStartGame} />
      )}

      {gameMode === 'playing' && (
        <GamePlay
          players={players}
          questions={questions}
          onGameOver={handleGameOver}
        />
      )}

      {gameMode === 'gameover' && (
        <GameOver
          players={players}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}

export default App;
