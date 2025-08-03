import { Game } from './components/game';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="container mx-auto">
        <Game />
      </div>
    </div>
  );
}

export default App;