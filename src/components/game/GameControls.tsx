import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useGame, Direction } from '../../context/GameContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight 
} from 'lucide-react';

interface GameControlsProps {
  className?: string;
}

export function GameControls({ className = '' }: GameControlsProps) {
  const { state, startGame, pauseGame, resumeGame, restartGame, changeDirection } = useGame();
  const { gameStatus } = state;

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== 'RUNNING') return;
      
      switch (e.key) {
        case 'ArrowUp':
          changeDirection('UP');
          e.preventDefault();
          break;
        case 'ArrowDown':
          changeDirection('DOWN');
          e.preventDefault();
          break;
        case 'ArrowLeft':
          changeDirection('LEFT');
          e.preventDefault();
          break;
        case 'ArrowRight':
          changeDirection('RIGHT');
          e.preventDefault();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [changeDirection, gameStatus]);

  // Handle touch controls
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (gameStatus !== 'RUNNING') return;
      if (!touchStartX || !touchStartY) return;
      
      const touchEndX = e.touches[0].clientX;
      const touchEndY = e.touches[0].clientY;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      
      // Determine swipe direction based on the larger delta
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 50) {
          changeDirection('RIGHT');
        } else if (deltaX < -50) {
          changeDirection('LEFT');
        }
      } else {
        // Vertical swipe
        if (deltaY > 50) {
          changeDirection('DOWN');
        } else if (deltaY < -50) {
          changeDirection('UP');
        }
      }
      
      // Reset touch start position after significant movement
      if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
        touchStartX = touchEndX;
        touchStartY = touchEndY;
      }
    };
    
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [changeDirection, gameStatus]);

  // Render game control buttons
  const renderGameControlButtons = () => {
    switch (gameStatus) {
      case 'INITIAL':
        return (
          <Button onClick={startGame} className="w-24">
            <Play className="mr-2 h-4 w-4" />
            Start
          </Button>
        );
      case 'RUNNING':
        return (
          <Button onClick={pauseGame} className="w-24">
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </Button>
        );
      case 'PAUSED':
        return (
          <Button onClick={resumeGame} className="w-24">
            <Play className="mr-2 h-4 w-4" />
            Resume
          </Button>
        );
      case 'GAME_OVER':
        return (
          <Button onClick={restartGame} className="w-24">
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart
          </Button>
        );
    }
  };

  // Handle direction button clicks
  const handleDirectionClick = (direction: Direction) => {
    if (gameStatus === 'RUNNING') {
      changeDirection(direction);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Game control buttons */}
      <div className="flex justify-center">
        {renderGameControlButtons()}
      </div>
      
      {/* Direction controls for mobile/touch */}
      <div className="md:hidden">
        <div className="flex justify-center mb-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12"
            onClick={() => handleDirectionClick('UP')}
            disabled={gameStatus !== 'RUNNING'}
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex justify-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12"
            onClick={() => handleDirectionClick('LEFT')}
            disabled={gameStatus !== 'RUNNING'}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12"
            onClick={() => handleDirectionClick('DOWN')}
            disabled={gameStatus !== 'RUNNING'}
          >
            <ArrowDown className="h-6 w-6" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12"
            onClick={() => handleDirectionClick('RIGHT')}
            disabled={gameStatus !== 'RUNNING'}
          >
            <ArrowRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {/* Keyboard instructions for desktop */}
      <div className="hidden md:block text-center text-sm text-muted-foreground">
        Use arrow keys to control the snake
      </div>
    </div>
  );
}