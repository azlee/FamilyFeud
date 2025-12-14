import { useState, useEffect } from 'react';
import { Question } from '../types';
import './QuestionForm.css';

interface QuestionFormProps {
  question: Question | null;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

interface AnswerInput {
  id: string;
  text: string;
  points: string;
}

function QuestionForm({ question, onSave, onCancel }: QuestionFormProps) {
  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState<AnswerInput[]>([
    { id: crypto.randomUUID(), text: '', points: '' }
  ]);

  useEffect(() => {
    if (question) {
      setQuestionText(question.question);
      setAnswers(question.answers.map(a => ({
        id: a.id,
        text: a.text,
        points: a.points.toString()
      })));
    }
  }, [question]);

  const handleAddAnswer = () => {
    setAnswers([...answers, { id: crypto.randomUUID(), text: '', points: '' }]);
  };

  const handleRemoveAnswer = (id: string) => {
    if (answers.length > 1) {
      setAnswers(answers.filter(a => a.id !== id));
    }
  };

  const handleAnswerChange = (id: string, field: 'text' | 'points', value: string) => {
    setAnswers(answers.map(a =>
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionText.trim()) {
      alert('Please enter a question');
      return;
    }

    const validAnswers = answers.filter(a => a.text.trim() && a.points.trim());

    if (validAnswers.length === 0) {
      alert('Please add at least one answer with points');
      return;
    }

    const newQuestion: Question = {
      id: question?.id || crypto.randomUUID(),
      question: questionText.trim(),
      answers: validAnswers.map(a => ({
        id: a.id,
        text: a.text.trim(),
        points: parseInt(a.points),
        revealed: false
      }))
    };

    onSave(newQuestion);
  };

  return (
    <form className="question-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="question">Question</label>
        <input
          id="question"
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter the survey question"
          maxLength={150}
          required
        />
      </div>

      <div className="answers-section">
        <div className="answers-header">
          <h4>Answers</h4>
          <button type="button" className="btn-secondary" onClick={handleAddAnswer}>
            + Add Answer
          </button>
        </div>

        <div className="answers-list">
          {answers.map((answer, index) => (
            <div key={answer.id} className="answer-input-row">
              <span className="answer-number">#{index + 1}</span>
              <input
                type="text"
                value={answer.text}
                onChange={(e) => handleAnswerChange(answer.id, 'text', e.target.value)}
                placeholder="Answer text"
                maxLength={50}
                className="answer-text-input"
              />
              <input
                type="number"
                value={answer.points}
                onChange={(e) => handleAnswerChange(answer.id, 'points', e.target.value)}
                placeholder="Points"
                min="1"
                max="99"
                className="points-input"
              />
              {answers.length > 1 && (
                <button
                  type="button"
                  className="btn-danger remove-btn"
                  onClick={() => handleRemoveAnswer(answer.id)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {question ? 'Update Question' : 'Save Question'}
        </button>
      </div>
    </form>
  );
}

export default QuestionForm;
