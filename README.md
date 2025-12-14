# Family Feud Web Game

A 1v1 Family Feud web game built with React and TypeScript. Set up your questions, answers, and players, then play through rounds of the classic game show!

## Features

- **Game Setup Mode**: Configure players and questions before starting
- **1v1 Gameplay**: Two players compete head-to-head
- **Customizable Questions**: Add your own survey questions with custom answers and point values
- **Strike System**: Three strikes and control passes to the other player
- **Steal Mechanism**: After 3 strikes, the other player gets one chance to steal the round
- **Flip Animations**: Satisfying card-flip animations when answers are revealed
- **Score Tracking**: Real-time score updates for both players
- **Multiple Rounds**: Play through as many questions as you configure

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The game will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## How to Play

### 1. Game Setup

1. **Enter Player Names**: Input names for both Player 1 and Player 2
2. **Add Questions**: Click "Add Question" to create survey questions
   - Enter the question text (e.g., "Name something you find in a kitchen")
   - Add multiple answers with point values
   - Answers are sorted by points (highest first) on the game board
   - You can edit or delete questions before starting
3. **Start Game**: Once you have player names and at least one question, click "Start Game"

### 2. Gameplay

#### Face-Off Phase (Start of Each Round)

Each round begins with a face-off to determine which player controls the board:

1. **Buzzer**: Click the buzzer button for whichever player buzzed in first
2. **First Guess**: The first player types their answer and submits
   - If it's the **top answer**, they win control immediately
   - If not, the second player gets to guess
3. **Second Guess** (if needed): The second player types their answer
   - The player with the **higher-ranked answer** wins control
   - If both wrong, the first buzzer wins control
4. **Pass or Play**: The winning player chooses:
   - **PLAY**: Their team plays the round
   - **PASS**: Give control to the other player

#### Main Round

- The game displays the current question at the top
- Answer cards are shown face-down (blue) with just numbers
- **Current Player**: The player whose turn it is shown in the status area
- **Revealing Answers**: Click on answer cards to reveal them
  - Revealed cards flip to show the answer text and points
  - Points are automatically added to the current player's score
- **Wrong Answers**: Click "Wrong Answer (Strike)" when a guess is incorrect
  - Each wrong answer adds a strike (displayed as red X marks)
  - After 3 strikes, the other player gets a steal opportunity
- **Steal Mode**:
  - The other player can continue guessing remaining answers
  - Click "Steal Successful" to transfer all of the original player's points to the stealing player
  - Click "Steal Failed" to end the round
- **Next Round**: Once all answers are revealed, click "Next Round" to continue

### 3. Game Over

- After all rounds are complete, the final scores are displayed
- The winner is announced (or a tie is declared)
- Click "Play Again" to return to setup and configure a new game

## Game Rules

1. **Face-Off**: Each round starts with a face-off to determine board control
2. **Pass or Play**: The face-off winner chooses to play or pass control
3. **Turns**: The controlling player reveals answers by clicking cards
4. **Points**: Each correct answer awards points to the current player
5. **Strikes**: Three incorrect guesses = 3 strikes, control switches
6. **Steal**: After 3 strikes, the opposing player can steal all the original player's points
7. **Round End**: A round ends when all answers are revealed or after a steal attempt
8. **Winner**: The player with the most points after all rounds wins

## Project Structure

```
src/
├── components/          # React components
│   ├── GameSetup.tsx   # Setup mode container
│   ├── PlayerSetup.tsx # Player name inputs
│   ├── QuestionForm.tsx # Question creation form
│   ├── GamePlay.tsx    # Gameplay container
│   ├── FaceOff.tsx     # Face-off/buzzer round
│   ├── GameHeader.tsx  # Scores and round display
│   ├── AnswerBoard.tsx # Grid of answer cards
│   ├── AnswerCard.tsx  # Individual flippable card
│   ├── PlayerStatus.tsx # Current player and strikes
│   ├── GameControls.tsx # Game action buttons
│   └── GameOver.tsx    # End game screen
├── types/              # TypeScript interfaces
│   └── index.ts        # Game data models
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with animations

## Customization

### Styling

The game uses CSS variables defined in `src/index.css`:

- `--primary-blue`: Main blue color
- `--primary-red`: Red for revealed answers
- `--gold`: Gold accent color
- `--success`: Green for success states
- `--danger`: Red for strikes and errors

Modify these variables to customize the color scheme.

### Game Logic

Game logic is primarily in `src/components/GamePlay.tsx`:

- Modify strike count (default: 3)
- Adjust scoring rules
- Change steal mechanics
- Customize round progression

## License

MIT

## Enjoy!

Have fun playing Family Feud with your friends and family!
