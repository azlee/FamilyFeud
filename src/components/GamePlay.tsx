import { useEffect, useState } from "react";
import { FaceOffResult, Player, Question } from "../types";
import AnswerBoard from "./AnswerBoard";
import FaceOff from "./FaceOff";
import GameControls from "./GameControls";
import GameHeader from "./GameHeader";
import "./GamePlay.css";
import PlayerStatus from "./PlayerStatus";
import StrikeOverlay from "./StrikeOverlay";

interface GamePlayProps {
  players: Player[];
  questions: Question[];
  onGameOver: (players: Player[]) => void;
  isReadOnly?: boolean;
}

function GamePlay({
  players: initialPlayers,
  questions,
  onGameOver,
  isReadOnly,
}: GamePlayProps) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [roundStartPlayerIndex, setRoundStartPlayerIndex] = useState(0);
  const [roundStartPlayerPoints, setRoundStartPlayerPoints] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [stealMode, setStealMode] = useState(false);
  const [showFaceOff, setShowFaceOff] = useState(true);
  const [roundEnded, setRoundEnded] = useState(false);
  const [showStrikeOverlay, setShowStrikeOverlay] = useState(false);
  const [strikeType, setStrikeType] = useState<'normal' | 'stealFail'>('normal');
  const [currentQuestion, setCurrentQuestion] = useState<Question>(
    questions[0]
  );

  useEffect(() => {
    setCurrentQuestion(questions[currentRound]);
  }, [currentRound, questions]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'x' && !isReadOnly && !showFaceOff) {
        const allRevealed = currentQuestion.answers.every((a) => a.revealed);
        if (!allRevealed && !stealMode && !roundEnded) {
          setStrikeType('normal');
          setShowStrikeOverlay(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentQuestion, stealMode, roundEnded, isReadOnly, showFaceOff]);

  const currentPlayer = players[currentPlayerIndex];
  const otherPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;

  const handleFaceOffComplete = (result: FaceOffResult) => {
    setCurrentPlayerIndex(result.startingPlayerIndex);
    setRoundStartPlayerIndex(result.startingPlayerIndex);

    // Mark face-off answers as revealed
    if (result.revealedAnswerIds.length > 0) {
      const updatedAnswers = currentQuestion.answers.map((a) =>
        result.revealedAnswerIds.includes(a.id) ? { ...a, revealed: true } : a
      );
      setCurrentQuestion({ ...currentQuestion, answers: updatedAnswers });

      // Award points to the starting player
      const updatedPlayers = players.map((p, i) =>
        i === result.startingPlayerIndex
          ? { ...p, score: p.score + result.pointsEarned }
          : p
      );
      setPlayers(updatedPlayers);

      // Track points for steal calculation
      setRoundStartPlayerPoints(result.pointsEarned);
    }

    setShowFaceOff(false);
  };

  const handleRevealAnswer = (answerId: string) => {
    const answer = currentQuestion.answers.find((a) => a.id === answerId);
    if (!answer || answer.revealed) return;

    const updatedAnswers = currentQuestion.answers.map((a) =>
      a.id === answerId ? { ...a, revealed: true } : a
    );

    setCurrentQuestion({ ...currentQuestion, answers: updatedAnswers });

    const updatedPlayers = players.map((p, i) =>
      i === currentPlayerIndex ? { ...p, score: p.score + answer.points } : p
    );
    setPlayers(updatedPlayers);

    // Track points earned by the original player (not during steal mode)
    if (!stealMode) {
      setRoundStartPlayerPoints(roundStartPlayerPoints + answer.points);
    }
  };

  const handleWrongAnswer = () => {
    setStrikeType('normal');
    setShowStrikeOverlay(true);
  };

  const handleStrikeComplete = () => {
    setShowStrikeOverlay(false);

    if (strikeType === 'stealFail') {
      setRoundEnded(true);
    } else {
      const newStrikes = strikes + 1;

      if (newStrikes >= 3) {
        if (stealMode) {
          setRoundEnded(true);
        } else {
          setStealMode(true);
          setCurrentPlayerIndex(otherPlayerIndex);
          setStrikes(0);
        }
      } else {
        setStrikes(newStrikes);
      }
    }
  };

  const handleStealSuccess = () => {
    // Transfer only the points that the original player earned (not the stealing player's points)
    const updatedPlayers = players.map((p, i) => {
      if (i === roundStartPlayerIndex) {
        // Remove points from the player who started the round
        return { ...p, score: p.score - roundStartPlayerPoints };
      } else if (i === currentPlayerIndex) {
        // Add the original player's points to the stealing player
        return { ...p, score: p.score + roundStartPlayerPoints };
      }
      return p;
    });
    setPlayers(updatedPlayers);

    setRoundEnded(true);
  };

  const handleStealFail = () => {
    setStrikeType('stealFail');
    setShowStrikeOverlay(true);
  };

  const handleRevealAllAnswers = () => {
    const updatedAnswers = currentQuestion.answers.map((a) => ({
      ...a,
      revealed: true,
    }));
    setCurrentQuestion({ ...currentQuestion, answers: updatedAnswers });
  };

  const nextRound = (playersToUse?: Player[]) => {
    // Use provided players or current state, ensure it's an array
    const finalPlayers =
      playersToUse && Array.isArray(playersToUse) ? playersToUse : players;

    // Check if we just completed the last round
    if (currentRound >= questions.length - 1) {
      // Ensure we're passing valid player data
      if (Array.isArray(finalPlayers) && finalPlayers.length > 0) {
        onGameOver(finalPlayers);
      }
    } else {
      setCurrentRound(currentRound + 1);
      setCurrentPlayerIndex(0);
      setRoundStartPlayerIndex(0);
      setRoundStartPlayerPoints(0);
      setStrikes(0);
      setStealMode(false);
      setShowFaceOff(true);
      setRoundEnded(false);
    }
  };

  // Safety check: if currentQuestion is not set yet, don't render
  if (!currentQuestion) {
    return null;
  }

  const allAnswersRevealed = currentQuestion.answers.every((a) => a.revealed);

  if (showFaceOff && !isReadOnly) {
    return (
      <div className="game-play">
        <GameHeader
          players={players}
          currentRound={currentRound + 1}
          totalRounds={questions.length}
        />
        <FaceOff
          key={`faceoff-${currentRound}`}
          players={players}
          question={currentQuestion}
          onComplete={handleFaceOffComplete}
        />
      </div>
    );
  }

  return (
    <div className="game-play">
      <GameHeader
        players={players}
        currentRound={currentRound + 1}
        totalRounds={questions.length}
      />

      <div className="game-content">
        <div className="question-display">
          <h2 className="question-text">{currentQuestion.question}</h2>
        </div>

        <AnswerBoard
          answers={
            isReadOnly
              ? currentQuestion.answers.map((a) => ({ ...a, revealed: true }))
              : currentQuestion.answers
          }
          onRevealAnswer={handleRevealAnswer}
        />

        {!isReadOnly && (
          <PlayerStatus
            currentPlayer={currentPlayer}
            strikes={strikes}
            stealMode={stealMode}
          />
        )}

        {!isReadOnly && (
          <GameControls
            onWrongAnswer={handleWrongAnswer}
            onStealSuccess={handleStealSuccess}
            onStealFail={handleStealFail}
            onNextRound={nextRound}
            onRevealAllAnswers={handleRevealAllAnswers}
            stealMode={stealMode}
            allAnswersRevealed={allAnswersRevealed}
            roundEnded={roundEnded}
            isLastRound={currentRound >= questions.length - 1}
          />
        )}
      </div>

      {!isReadOnly && (
        <StrikeOverlay
          show={showStrikeOverlay}
          strikeCount={strikeType === 'stealFail' ? 1 : strikes + 1}
          onComplete={handleStrikeComplete}
        />
      )}
    </div>
  );
}

export default GamePlay;
