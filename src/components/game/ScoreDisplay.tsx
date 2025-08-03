import React from 'react';
import { useGame } from '../../context/GameContext';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Target } from 'lucide-react';

interface ScoreDisplayProps {
  className?: string;
}

export function ScoreDisplay({ className = '' }: ScoreDisplayProps) {
  const { state } = useGame();
  const { score, highScore } = state;

  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <Card>
        <CardContent className="p-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-primary" />
          <div>
            <div className="text-sm font-medium text-muted-foreground">Score</div>
            <div className="text-2xl font-bold">{score}</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-amber-500" />
          <div>
            <div className="text-sm font-medium text-muted-foreground">High Score</div>
            <div className="text-2xl font-bold">{highScore}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}