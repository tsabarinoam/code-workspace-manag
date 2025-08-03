import React, { useEffect, useRef } from 'react';
import { useGame, Position } from '../../context/GameContext';

interface GameBoardProps {
  className?: string;
}

export function GameBoard({ className = '' }: GameBoardProps) {
  const { state } = useGame();
  const { snake, food, boardSize, gameStatus } = state;
  const boardRef = useRef<HTMLDivElement>(null);

  // Calculate cell size based on board dimensions and available space
  const calculateCellSize = (): number => {
    if (!boardRef.current) return 20; // Default size
    
    const boardElement = boardRef.current;
    const availableWidth = boardElement.clientWidth;
    const availableHeight = boardElement.clientHeight;
    
    // Calculate cell size based on available space and board dimensions
    const cellWidth = Math.floor(availableWidth / boardSize.width);
    const cellHeight = Math.floor(availableHeight / boardSize.height);
    
    // Use the smaller dimension to ensure square cells
    return Math.min(cellWidth, cellHeight);
  };

  // Check if a position contains a snake segment
  const isSnake = (x: number, y: number): boolean => {
    return snake.some(segment => segment.x === x && segment.y === y);
  };

  // Check if a position is the snake's head
  const isSnakeHead = (x: number, y: number): boolean => {
    return snake.length > 0 && snake[0].x === x && snake[0].y === y;
  };

  // Check if a position contains food
  const isFood = (x: number, y: number): boolean => {
    return food.x === x && food.y === y;
  };

  // Generate the game board grid
  const renderGrid = () => {
    const cellSize = calculateCellSize();
    const grid = [];
    
    for (let y = 0; y < boardSize.height; y++) {
      for (let x = 0; x < boardSize.width; x++) {
        let cellClass = 'bg-muted';
        
        if (isSnakeHead(x, y)) {
          cellClass = 'bg-primary';
        } else if (isSnake(x, y)) {
          cellClass = 'bg-primary/80';
        } else if (isFood(x, y)) {
          cellClass = 'bg-destructive';
        }
        
        grid.push(
          <div
            key={`${x}-${y}`}
            className={`absolute rounded-sm ${cellClass} transition-all duration-100`}
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              left: `${x * cellSize}px`,
              top: `${y * cellSize}px`,
            }}
          />
        );
      }
    }
    
    return grid;
  };

  // Update cell size on window resize
  useEffect(() => {
    const handleResize = () => {
      // Force re-render to update cell sizes
      forceUpdate();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Force component to re-render
  const forceUpdate = () => {
    if (boardRef.current) {
      const currentWidth = boardRef.current.style.width;
      boardRef.current.style.width = `${parseInt(currentWidth || '0') + 1}px`;
      setTimeout(() => {
        if (boardRef.current) {
          boardRef.current.style.width = currentWidth;
        }
      }, 0);
    }
  };

  // Calculate the board dimensions
  const cellSize = calculateCellSize();
  const boardWidth = boardSize.width * cellSize;
  const boardHeight = boardSize.height * cellSize;

  return (
    <div 
      className={`relative border border-border rounded-md overflow-hidden ${className}`}
      ref={boardRef}
      style={{
        width: '100%',
        height: '100%',
        maxWidth: `${boardWidth}px`,
        maxHeight: `${boardHeight}px`,
      }}
    >
      <div 
        className="relative"
        style={{
          width: `${boardWidth}px`,
          height: `${boardHeight}px`,
        }}
      >
        {renderGrid()}
        
        {/* Game status overlay */}
        {gameStatus !== 'RUNNING' && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="text-center p-4 rounded-md">
              {gameStatus === 'INITIAL' && (
                <p className="text-lg font-semibold">Press Start to Play</p>
              )}
              {gameStatus === 'PAUSED' && (
                <p className="text-lg font-semibold">Game Paused</p>
              )}
              {gameStatus === 'GAME_OVER' && (
                <p className="text-lg font-semibold text-destructive">Game Over</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}