import React from 'react';
import { useGame, Difficulty } from '../../context/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

interface GameSettingsProps {
  className?: string;
}

export function GameSettings({ className = '' }: GameSettingsProps) {
  const { state, setDifficulty } = useGame();
  const { difficulty, gameStatus } = state;

  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    setDifficulty(value as Difficulty);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Game Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-2">Difficulty</div>
            <RadioGroup 
              value={difficulty} 
              onValueChange={handleDifficultyChange}
              className="flex flex-col space-y-1"
              disabled={gameStatus === 'RUNNING'}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="EASY" id="easy" />
                <Label htmlFor="easy" className="cursor-pointer">Easy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="MEDIUM" id="medium" />
                <Label htmlFor="medium" className="cursor-pointer">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="HARD" id="hard" />
                <Label htmlFor="hard" className="cursor-pointer">Hard</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {gameStatus === 'RUNNING' && (
              <p>Settings cannot be changed during gameplay</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}