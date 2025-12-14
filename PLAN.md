# Family Feud Web Game - Implementation Plan

## Project Overview
A 1v1 Family Feud web game built with React that allows players to set up rounds, questions, and point values before starting the game.

## Core Requirements

### 1. Game Setup Mode
- Configure number of rounds
- Add players (2 players for 1v1)
- Set up questions for each round
  - Question text
  - Multiple answers with point values
  - Track which answers have been revealed
- Ability to edit/remove questions before starting

### 2. Play Mode
- Display current question
- Show answer board (hidden answers that get revealed)
- Player turn management
- Score tracking for both players
- Strike system (3 strikes = turn over)
- Ability to reveal answers when guessed correctly
- Round progression
- Display final winner at end

### 3. Game Features
- Answer board with flip animation when revealing
- Visual feedback for correct/incorrect guesses
- Strike indicators (X marks)
- Current player highlight
- Score display for both players
- Round indicator
- Game state management (setup → playing → game over)

### 4. Technical Requirements
- React with TypeScript
- State management for game flow
- Responsive design
- Clean, intuitive UI

## Application Architecture

### Component Structure
```
App
├── GameSetup
│   ├── PlayerSetup
│   ├── RoundSetup
│   └── QuestionForm
│       └── AnswerInput
├── GamePlay
│   ├── GameHeader (scores, round info)
│   ├── QuestionDisplay
│   ├── AnswerBoard
│   │   └── AnswerCard
│   ├── PlayerStatus (strikes, current turn)
│   └── GameControls
└── GameOver
    └── WinnerDisplay
```

### Data Models

#### Player
```typescript
{
  id: string
  name: string
  score: number
}
```

#### Answer
```typescript
{
  id: string
  text: string
  points: number
  revealed: boolean
}
```

#### Question
```typescript
{
  id: string
  question: string
  answers: Answer[]
}
```

#### Round
```typescript
{
  id: string
  question: Question
  currentPlayer: string
  strikes: number
  roundWinner?: string
}
```

#### GameState
```typescript
{
  mode: 'setup' | 'playing' | 'gameover'
  players: Player[]
  questions: Question[]
  currentRound: number
  currentPlayer: number
  strikes: number
}
```

## Implementation TODO

### Phase 1: Project Setup
- [ ] Initialize React project with TypeScript and Vite
- [ ] Set up project structure (components, types, utils folders)
- [ ] Install necessary dependencies (if any)
- [ ] Create base CSS/styling setup

### Phase 2: Data Models & Types
- [ ] Create TypeScript interfaces for Player, Answer, Question, GameState
- [ ] Set up initial game state structure
- [ ] Create utility functions for game logic

### Phase 3: Setup Mode Components
- [ ] Create GameSetup container component
- [ ] Build PlayerSetup component (input for 2 player names)
- [ ] Build QuestionForm component
  - [ ] Question text input
  - [ ] Dynamic answer inputs (add/remove answers)
  - [ ] Point value inputs for each answer
  - [ ] Validation
- [ ] Create question list display with edit/delete functionality
- [ ] Add "Start Game" button with validation

### Phase 4: Play Mode Components
- [ ] Create GamePlay container component
- [ ] Build GameHeader component
  - [ ] Display player names and scores
  - [ ] Display current round number
- [ ] Build QuestionDisplay component
- [ ] Build AnswerBoard component
  - [ ] Create AnswerCard component with flip animation
  - [ ] Grid layout for answers
  - [ ] Show answer number and points when revealed
- [ ] Build PlayerStatus component
  - [ ] Show current player turn
  - [ ] Display strike indicators (X marks)
- [ ] Build GameControls component
  - [ ] Manual answer reveal buttons/interface
  - [ ] Correct answer button (awards points)
  - [ ] Wrong answer button (adds strike)
  - [ ] Next round button

### Phase 5: Game Logic
- [ ] Implement turn switching logic
- [ ] Implement strike system (3 strikes = other player gets chance to steal)
- [ ] Implement scoring system
- [ ] Implement round progression
- [ ] Handle round completion (all answers revealed or 3 strikes)
- [ ] Implement steal opportunity after 3 strikes
- [ ] Determine round winner and award points
- [ ] Progress to next round

### Phase 6: Game Over
- [ ] Create GameOver component
- [ ] Display final scores
- [ ] Show winner
- [ ] Add "Play Again" button (resets to setup)

### Phase 7: Styling & Polish
- [ ] Style setup mode forms
- [ ] Style game board (Family Feud aesthetic)
- [ ] Add flip animations for answer reveals
- [ ] Add visual feedback for strikes
- [ ] Responsive design for different screen sizes
- [ ] Add sound effects (optional)
- [ ] Polish transitions between game states

### Phase 8: Testing & Refinement
- [ ] Test full game flow
- [ ] Test edge cases (no answers, single answer, max answers)
- [ ] Verify scoring calculations
- [ ] Test game state persistence
- [ ] Fix any bugs

## Technical Stack
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **Styling:** CSS Modules or styled-components (TBD)
- **State Management:** React useState/useReducer (no external state library needed)

## Game Flow

1. **Setup Phase**
   - Enter player names
   - Add questions with answers and points
   - Validate setup is complete
   - Start game

2. **Play Phase**
   - Display question
   - Current player attempts to guess answers
   - Host manually reveals answers when guessed correctly
   - Award points for correct answers to current player
   - Track strikes for incorrect answers
   - After 3 strikes, other player gets one chance to steal
   - Round ends when all answers revealed or steal attempt completes
   - Progress to next round

3. **Game Over Phase**
   - Show final scores
   - Declare winner
   - Option to play again

## Notes
- No Fast Money round required
- Manual control for host to reveal answers (not auto-matching user input)
- Simple 1v1 format
- Focus on clean UI/UX for both setup and gameplay
