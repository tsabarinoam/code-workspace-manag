# Snake Game

A classic Snake Game built with React, TypeScript, and Tailwind CSS. This interactive game features responsive design, multiple difficulty levels, and touch controls for mobile devices.

## Features

### Game Mechanics
- Classic snake movement in four directions
- Food generation at random positions
- Snake growth when eating food
- Collision detection with walls and self
- Progressive difficulty as the snake grows

### Game Controls
- Keyboard arrow keys for desktop users
- Touch/swipe controls for mobile users
- On-screen control buttons for easy navigation
- Game control buttons (start, pause, restart)

### Game States
- Initial/Start screen
- Active gameplay
- Paused state
- Game over screen with score summary

### Additional Features
- Multiple difficulty levels (Easy, Medium, Hard)
- High score tracking with local storage
- Responsive design that works on all screen sizes
- Dark/light theme support

## Technical Implementation

### Architecture
The game is built using a modular component architecture with React Context for state management. The main components include:

- **Game**: The main container component
- **GameBoard**: Renders the game board with snake and food
- **GameControls**: Handles user input for controlling the snake
- **ScoreDisplay**: Shows current and high scores
- **GameSettings**: Allows changing game settings like difficulty
- **GameOverScreen**: Displays game over information and restart option

### State Management
The game state is managed using React Context, which includes:

- Snake position and direction
- Food position
- Game status (initial, running, paused, game over)
- Score and high score
- Difficulty settings

### Responsive Design
The game is fully responsive and works well on:

- Desktop computers with keyboard controls
- Tablets with touch controls
- Mobile phones with optimized touch interface

## How to Play

1. Press the Start button to begin the game
2. Use arrow keys (desktop) or swipe (mobile) to control the snake
3. Eat the red food to grow and score points
4. Avoid hitting the walls or yourself
5. The game gets faster as you score more points
6. Try to beat your high score!

## Development

This game is built with:

- React 19
- TypeScript
- Tailwind CSS
- Radix UI Components

## License

This project is licensed under the MIT License.