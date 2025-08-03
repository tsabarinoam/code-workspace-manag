import React from 'react';
import { useGame } from '../../context/GameContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy, Target } from 'lucide-react';

interface GameOverScreenProps {
  className?: string;
}

export function GameOverScreen({ className = '' }: GameOverScreenProps) {
  const { state, restartGame } = useGame();
  const { score, highScore, gameStatus } = state;
  
  // Only show when game is over
  if (gameStatus !== 'GAME_OVER') {
    return null;
  }

  // Check if player achieved a new high score
  const isNewHighScore = score === highScore && score > 0;

  return (
    <div className={`fixed inset-0 bg-background/80 flex items-center justify-center z-50 ${className}`}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Game Over</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-center items-center space-x-8">
              <div className="text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-sm text-muted-foreground">Score</div>
                <div className="text-3xl font-bold">{score}</div>
              </div>
              
              <div className="text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                <div className="text-sm text-muted-foreground">High Score</div>
                <div className="text-3xl font-bold">{highScore}</div>
              </div>
            </div>
            
            {isNewHighScore && (
              <div className="bg-amber-500/20 text-amber-700 dark:text-amber-400 p-3 rounded-md text-center">
                🎉 New High Score! 🎉
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={restartGame} className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Play Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}