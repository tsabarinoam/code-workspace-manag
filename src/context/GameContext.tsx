import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Define types
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameStatus = 'INITIAL' | 'RUNNING' | 'PAUSED' | 'GAME_OVER';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type Position = { x: number; y: number };
export type Snake = Position[];

interface GameState {
  snake: Snake;
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  highScore: number;
  gameStatus: GameStatus;
  difficulty: Difficulty;
  boardSize: { width: number; height: number };
}

interface GameContextType {
  state: GameState;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  changeDirection: (direction: Direction) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setBoardSize: (width: number, height: number) => void;
}

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Speed values for different difficulty levels (in milliseconds)
const SPEED = {
  EASY: 150,
  MEDIUM: 100,
  HARD: 70,
};

// Initial state
const createInitialState = (): GameState => ({
  snake: [{ x: 5, y: 5 }],
  food: { x: 10, y: 10 },
  direction: 'RIGHT',
  nextDirection: 'RIGHT',
  score: 0,
  highScore: parseInt(localStorage.getItem('snakeHighScore') || '0', 10),
  gameStatus: 'INITIAL',
  difficulty: 'MEDIUM',
  boardSize: { width: 20, height: 20 },
});

// Provider component
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(createInitialState);
  const [gameInterval, setGameInterval] = useState<number | null>(null);

  // Generate random food position
  const generateFood = useCallback((snake: Snake, boardSize: { width: number; height: number }): Position => {
    const { width, height } = boardSize;
    let newFood: Position;
    
    // Generate food until it's not on the snake
    do {
      newFood = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    return newFood;
  }, []);

  // Check for collisions
  const checkCollision = useCallback((head: Position, snake: Snake, boardSize: { width: number; height: number }): boolean => {
    const { width, height } = boardSize;
    
    // Check wall collision
    if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
      return true;
    }
    
    // Check self collision (skip the last segment as it will be removed when moving)
    for (let i = 0; i < snake.length - 1; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true;
      }
    }
    
    return false;
  }, []);

  // Move the snake
  const moveSnake = useCallback(() => {
    setState(prevState => {
      const { snake, food, nextDirection, score, highScore, boardSize } = prevState;
      
      // Create new head based on direction
      const head = { ...snake[0] };
      
      switch (nextDirection) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }
      
      // Check for collision
      if (checkCollision(head, snake, boardSize)) {
        // Game over
        clearInterval(gameInterval as number);
        setGameInterval(null);
        
        // Update high score if needed
        const newHighScore = score > highScore ? score : highScore;
        if (newHighScore > highScore) {
          localStorage.setItem('snakeHighScore', newHighScore.toString());
        }
        
        return {
          ...prevState,
          gameStatus: 'GAME_OVER',
          highScore: newHighScore,
          direction: nextDirection,
        };
      }
      
      // Create new snake array
      const newSnake = [head, ...snake];
      
      // Check if snake ate food
      let newFood = food;
      let newScore = score;
      
      if (head.x === food.x && head.y === food.y) {
        // Snake ate food, generate new food and increase score
        newFood = generateFood(newSnake, boardSize);
        newScore += 1;
      } else {
        // Snake didn't eat food, remove tail
        newSnake.pop();
      }
      
      return {
        ...prevState,
        snake: newSnake,
        food: newFood,
        score: newScore,
        direction: nextDirection,
      };
    });
  }, [checkCollision, gameInterval, generateFood]);

  // Start game
  const startGame = useCallback(() => {
    // Reset game state
    setState(prevState => ({
      ...createInitialState(),
      highScore: prevState.highScore,
      difficulty: prevState.difficulty,
      boardSize: prevState.boardSize,
      gameStatus: 'RUNNING',
    }));
    
    // Clear any existing interval
    if (gameInterval) {
      clearInterval(gameInterval);
    }
    
    // Start game loop
    const interval = window.setInterval(() => {
      moveSnake();
    }, SPEED[state.difficulty]);
    
    setGameInterval(interval);
  }, [gameInterval, moveSnake, state.difficulty]);

  // Pause game
  const pauseGame = useCallback(() => {
    if (gameInterval) {
      clearInterval(gameInterval);
      setGameInterval(null);
    }
    
    setState(prevState => ({
      ...prevState,
      gameStatus: 'PAUSED',
    }));
  }, [gameInterval]);

  // Resume game
  const resumeGame = useCallback(() => {
    if (state.gameStatus === 'PAUSED') {
      const interval = window.setInterval(() => {
        moveSnake();
      }, SPEED[state.difficulty]);
      
      setGameInterval(interval);
      
      setState(prevState => ({
        ...prevState,
        gameStatus: 'RUNNING',
      }));
    }
  }, [moveSnake, state.difficulty, state.gameStatus]);

  // Restart game
  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  // Change direction
  const changeDirection = useCallback((newDirection: Direction) => {
    setState(prevState => {
      // Prevent 180-degree turns
      const { direction } = prevState;
      if (
        (direction === 'UP' && newDirection === 'DOWN') ||
        (direction === 'DOWN' && newDirection === 'UP') ||
        (direction === 'LEFT' && newDirection === 'RIGHT') ||
        (direction === 'RIGHT' && newDirection === 'LEFT')
      ) {
        return prevState;
      }
      
      return {
        ...prevState,
        nextDirection: newDirection,
      };
    });
  }, []);

  // Set difficulty
  const setDifficulty = useCallback((difficulty: Difficulty) => {
    setState(prevState => ({
      ...prevState,
      difficulty,
    }));
    
    // Update game speed if game is running
    if (state.gameStatus === 'RUNNING' && gameInterval) {
      clearInterval(gameInterval);
      
      const interval = window.setInterval(() => {
        moveSnake();
      }, SPEED[difficulty]);
      
      setGameInterval(interval);
    }
  }, [gameInterval, moveSnake, state.gameStatus]);

  // Set board size
  const setBoardSize = useCallback((width: number, height: number) => {
    setState(prevState => ({
      ...prevState,
      boardSize: { width, height },
    }));
  }, []);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (gameInterval) {
        clearInterval(gameInterval);
      }
    };
  }, [gameInterval]);

  // Create context value
  const contextValue: GameContextType = {
    state,
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    changeDirection,
    setDifficulty,
    setBoardSize,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook to use the game context
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}