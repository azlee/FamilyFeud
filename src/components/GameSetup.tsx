import Papa from "papaparse";
import { useState } from "react";
import { Player, Question } from "../types";
import "./GameSetup.css";
import PlayerSetup from "./PlayerSetup";
import QuestionForm from "./QuestionForm";

interface GameSetupProps {
  onStartGame: (players: Player[], questions: Question[]) => void;
}

function GameSetup({ onStartGame }: GameSetupProps) {
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "", score: 0 },
    { id: "2", name: "", score: 0 },
  ]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const handlePlayersChange = (updatedPlayers: Player[]) => {
    setPlayers(updatedPlayers);
  };

  const handleAddQuestion = (question: Question) => {
    if (editingQuestion) {
      setQuestions(questions.map((q) => (q.id === question.id ? question : q)));
      setEditingQuestion(null);
    } else {
      setQuestions([...questions, question]);
    }
    setShowQuestionForm(false);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowQuestionForm(true);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const handleCancelForm = () => {
    setShowQuestionForm(false);
    setEditingQuestion(null);
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsedQuestions: Question[] = [];

          results.data.forEach((row: any, index: number) => {
            if (!row.Question || row.Question.trim() === "") {
              return;
            }

            const answers = [];
            let answerIndex = 1;

            while (row[`Answer ${answerIndex}`]) {
              const answerText = row[`Answer ${answerIndex}`];
              const answerPoints = parseInt(
                row[`Points ${answerIndex}`] || "0"
              );

              if (answerText && answerText.trim() !== "") {
                answers.push({
                  id: `${Date.now()}-${index}-${answerIndex}`,
                  text: answerText.trim(),
                  points: answerPoints,
                  revealed: false,
                });
              }

              answerIndex++;
            }

            if (answers.length > 0) {
              parsedQuestions.push({
                id: `${Date.now()}-${index}`,
                question: row.Question.trim(),
                answers: answers,
              });
            }
          });

          if (parsedQuestions.length > 0) {
            setQuestions([...questions, ...parsedQuestions]);
          } else {
            alert("No valid questions found in CSV file.");
          }
        } catch (error) {
          alert("Error parsing CSV file. Please check the format.");
          console.error("CSV parsing error:", error);
        }
      },
      error: (error) => {
        alert("Error reading CSV file: " + error.message);
        console.error("CSV reading error:", error);
      },
    });

    event.target.value = "";
  };

  const canStartGame =
    players.every((p) => p.name.trim() !== "") && questions.length > 0;

  const handleStartGame = () => {
    if (canStartGame) {
      onStartGame(players, questions);
    }
  };

  return (
    <div className="game-setup">
      <h2 className="setup-title">Game Setup</h2>

      <PlayerSetup players={players} onChange={handlePlayersChange} />

      <div className="questions-section">
        <div className="section-header">
          <h3>Questions ({questions.length})</h3>
          {!showQuestionForm && (
            <div className="question-actions-group">
              <button
                className="btn-primary"
                onClick={() => setShowQuestionForm(true)}
              >
                Add Question
              </button>
              <label className="btn-secondary csv-upload-btn">
                Import CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          )}
        </div>

        {showQuestionForm && (
          <QuestionForm
            question={editingQuestion}
            onSave={handleAddQuestion}
            onCancel={handleCancelForm}
          />
        )}

        <div className="questions-list">
          {questions.map((question, index) => (
            <div key={question.id} className="question-item">
              <div className="question-header">
                <h4>Question {index + 1}</h4>
                <div className="question-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => handleEditQuestion(question)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="question-text-setup">{question.question}</p>
              <div className="answers-preview">
                {question.answers.map((answer, i) => (
                  <div key={answer.id} className="answer-preview">
                    <span>#{i + 1}</span>
                    <span>{answer.text}</span>
                    <span className="points">{answer.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="btn-success start-game-btn"
        onClick={handleStartGame}
        disabled={!canStartGame}
      >
        Start Game
      </button>
      {!canStartGame && (
        <p className="validation-message">
          Please enter player names and add at least one question to start
        </p>
      )}
    </div>
  );
}

export default GameSetup;
