import React from 'react';
import { GameProvider } from '../../context/GameContext';
import { GameBoard } from './GameBoard';
import { GameControls } from './GameControls';
import { ScoreDisplay } from './ScoreDisplay';
import { GameSettings } from './GameSettings';
import { GameOverScreen } from './GameOverScreen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GameProps {
  className?: string;
}

export function Game({ className = '' }: GameProps) {
  return (
    <GameProvider>
      <div className={`grid gap-6 ${className}`}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-center">Snake Game</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-[1fr_300px] gap-6">
              <div className="space-y-6">
                {/* Game board with fixed aspect ratio container */}
                <div className="aspect-square w-full max-w-[500px] mx-auto">
                  <GameBoard className="h-full" />
                </div>
                
                {/* Game controls */}
                <GameControls />
              </div>
              
              <div className="space-y-6">
                {/* Score display */}
                <ScoreDisplay />
                
                {/* Game settings */}
                <GameSettings />
                
                {/* Game instructions */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">How to Play</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>Use arrow keys or touch controls to move the snake</li>
                      <li>Eat the red food to grow and score points</li>
                      <li>Avoid hitting the walls or yourself</li>
                      <li>The game gets faster as you score more points</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Game over screen (appears when game is over) */}
      <GameOverScreen />
    </GameProvider>
  );
}