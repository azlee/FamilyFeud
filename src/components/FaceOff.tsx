import { useState } from 'react';
import { Player, Question, Answer, FaceOffPhase, FaceOffResult } from '../types';
import AnswerBoard from './AnswerBoard';
import { findFuzzyMatch } from '../utils/fuzzyMatch';
import './FaceOff.css';

interface FaceOffProps {
  players: Player[];
  question: Question;
  onComplete: (result: FaceOffResult) => void;
}

function FaceOff({ players, question, onComplete }: FaceOffProps) {
  const [phase, setPhase] = useState<FaceOffPhase>('buzzer');
  const [firstBuzzer, setFirstBuzzer] = useState<number | null>(null);
  const [secondBuzzer, setSecondBuzzer] = useState<number | null>(null);
  const [firstGuess, setFirstGuess] = useState('');
  const [firstGuessAnswer, setFirstGuessAnswer] = useState<Answer | null>(null);
  const [secondGuess, setSecondGuess] = useState('');
  const [secondGuessAnswer, setSecondGuessAnswer] = useState<Answer | null>(null);
  const [winningPlayerIndex, setWinningPlayerIndex] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(question);

  const handleBuzz = (playerIndex: number) => {
    if (firstBuzzer === null) {
      setFirstBuzzer(playerIndex);
      setPhase('firstGuess');
    } else if (secondBuzzer === null) {
      setSecondBuzzer(playerIndex);
    }
  };

  const handleFirstGuessSubmit = () => {
    const guess = firstGuess.trim();
    const matchedAnswer = findFuzzyMatch(guess, question.answers);

    setFirstGuessAnswer(matchedAnswer || null);

    // Set the other player as second buzzer
    const otherPlayer = firstBuzzer === 0 ? 1 : 0;
    setSecondBuzzer(otherPlayer);

    // Mark answer as revealed on the board
    if (matchedAnswer) {
      const updatedAnswers = currentQuestion.answers.map(a =>
        a.id === matchedAnswer.id ? { ...a, revealed: true } : a
      );
      setCurrentQuestion({ ...currentQuestion, answers: updatedAnswers });

      // Check if it's the top answer
      const topAnswer = [...question.answers].sort((a, b) => b.points - a.points)[0];
      if (matchedAnswer.id === topAnswer.id) {
        // First player got top answer, they win
        setWinningPlayerIndex(firstBuzzer);
        setPhase('passOrPlay');
      } else {
        // Not top answer, second player gets to guess
        setPhase('secondGuess');
      }
    } else {
      // First player wrong, second player gets to guess
      setPhase('secondGuess');
    }
  };

  const handleSecondGuessSubmit = () => {
    const guess = secondGuess.trim();
    const matchedAnswer = findFuzzyMatch(guess, question.answers);

    setSecondGuessAnswer(matchedAnswer || null);

    // Mark answer as revealed on the board
    if (matchedAnswer) {
      const updatedAnswers = currentQuestion.answers.map(a =>
        a.id === matchedAnswer.id ? { ...a, revealed: true } : a
      );
      setCurrentQuestion({ ...currentQuestion, answers: updatedAnswers });
    }

    // Compare answers
    if (!firstGuessAnswer && !matchedAnswer) {
      // Both wrong, first buzzer wins
      setWinningPlayerIndex(firstBuzzer);
    } else if (firstGuessAnswer && !matchedAnswer) {
      // First correct, second wrong
      setWinningPlayerIndex(firstBuzzer);
    } else if (!firstGuessAnswer && matchedAnswer) {
      // First wrong, second correct
      setWinningPlayerIndex(secondBuzzer);
    } else if (firstGuessAnswer && matchedAnswer) {
      // Both correct, compare points
      if (matchedAnswer.points > firstGuessAnswer.points) {
        setWinningPlayerIndex(secondBuzzer);
      } else {
        setWinningPlayerIndex(firstBuzzer);
      }
    }

    setPhase('passOrPlay');
  };

  const handlePassOrPlay = (choice: 'pass' | 'play') => {
    if (winningPlayerIndex === null) return;

    let startingPlayerIndex = winningPlayerIndex;

    // If they pass, the other player plays
    if (choice === 'pass') {
      startingPlayerIndex = winningPlayerIndex === 0 ? 1 : 0;
    }

    // Collect revealed answer IDs and calculate points
    const revealedAnswerIds: string[] = [];
    let pointsEarned = 0;

    if (firstGuessAnswer) {
      revealedAnswerIds.push(firstGuessAnswer.id);
      pointsEarned += firstGuessAnswer.points;
    }
    if (secondGuessAnswer) {
      revealedAnswerIds.push(secondGuessAnswer.id);
      pointsEarned += secondGuessAnswer.points;
    }

    onComplete({
      startingPlayerIndex,
      passOrPlay: choice,
      revealedAnswerIds,
      pointsEarned
    });
  };

  return (
    <div className="face-off">
      <div className="face-off-content">
        <h2 className="face-off-title">FACE OFF!</h2>
        <div className="question-display-faceoff">
          <p className="question-text-faceoff">{question.question}</p>
        </div>

        <AnswerBoard
          answers={currentQuestion.answers}
          onRevealAnswer={() => {}}
        />

        {phase === 'buzzer' && (
          <div className="buzzer-phase">
            <p className="phase-instruction">Who buzzed in first?</p>
            <div className="buzzer-buttons">
              <button
                className="buzzer-btn player-1-btn"
                onClick={() => handleBuzz(0)}
              >
                <div className="buzzer-icon">🔴</div>
                <div className="player-name-buzz">{players[0].name}</div>
              </button>
              <button
                className="buzzer-btn player-2-btn"
                onClick={() => handleBuzz(1)}
              >
                <div className="buzzer-icon">🔴</div>
                <div className="player-name-buzz">{players[1].name}</div>
              </button>
            </div>
          </div>
        )}

        {phase === 'firstGuess' && firstBuzzer !== null && (
          <div className="guess-phase">
            <p className="phase-instruction">
              <strong>{players[firstBuzzer].name}</strong>, make your guess:
            </p>
            <input
              type="text"
              value={firstGuess}
              onChange={(e) => setFirstGuess(e.target.value)}
              placeholder="Enter your answer"
              className="guess-input"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleFirstGuessSubmit();
                }
              }}
            />
            <button className="btn-primary" onClick={handleFirstGuessSubmit}>
              Submit Guess
            </button>
          </div>
        )}

        {phase === 'secondGuess' && secondBuzzer !== null && (
          <div className="guess-phase">
            <div className="previous-guess">
              <p>
                <strong>{players[firstBuzzer!].name}</strong> guessed: "{firstGuess}"
                {firstGuessAnswer ? (
                  <span className="correct"> ✓ ({firstGuessAnswer.points} points)</span>
                ) : (
                  <span className="incorrect"> ✗ (Not on board)</span>
                )}
              </p>
            </div>
            <p className="phase-instruction">
              <strong>{players[secondBuzzer].name}</strong>, make your guess:
            </p>
            <input
              type="text"
              value={secondGuess}
              onChange={(e) => setSecondGuess(e.target.value)}
              placeholder="Enter your answer"
              className="guess-input"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSecondGuessSubmit();
                }
              }}
            />
            <button className="btn-primary" onClick={handleSecondGuessSubmit}>
              Submit Guess
            </button>
          </div>
        )}

        {phase === 'passOrPlay' && winningPlayerIndex !== null && (
          <div className="pass-play-phase">
            <div className="guesses-summary">
              {firstGuessAnswer && (
                <p className="guess-result">
                  <strong>{players[firstBuzzer!].name}</strong>: "{firstGuess}"
                  <span className="correct"> ✓ ({firstGuessAnswer.points} points)</span>
                </p>
              )}
              {!firstGuessAnswer && firstGuess && (
                <p className="guess-result">
                  <strong>{players[firstBuzzer!].name}</strong>: "{firstGuess}"
                  <span className="incorrect"> ✗</span>
                </p>
              )}
              {secondGuessAnswer && (
                <p className="guess-result">
                  <strong>{players[secondBuzzer!].name}</strong>: "{secondGuess}"
                  <span className="correct"> ✓ ({secondGuessAnswer.points} points)</span>
                </p>
              )}
              {!secondGuessAnswer && secondGuess && (
                <p className="guess-result">
                  <strong>{players[secondBuzzer!].name}</strong>: "{secondGuess}"
                  <span className="incorrect"> ✗</span>
                </p>
              )}
            </div>

            <div className="winner-announcement">
              <p className="winner-text">
                <strong>{players[winningPlayerIndex].name}</strong> controls the board!
              </p>
              <p className="phase-instruction">Do you want to PASS or PLAY?</p>
            </div>

            <div className="pass-play-buttons">
              <button
                className="btn-danger pass-btn"
                onClick={() => handlePassOrPlay('pass')}
              >
                PASS
                <small>Give control to {players[winningPlayerIndex === 0 ? 1 : 0].name}</small>
              </button>
              <button
                className="btn-success play-btn"
                onClick={() => handlePassOrPlay('play')}
              >
                PLAY
                <small>Your team plays</small>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FaceOff;
