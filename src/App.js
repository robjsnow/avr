import Board from './components/Board';
import ModeSelection from './components/ModeSelection';
import { React, useState } from 'react';
import './App.css';

function App() {
  const [gameMode, setGameMode] = useState(null);

  const handleSelectMode = (mode) => {
    setGameMode(mode);
  };

  

  return (
    <div className="App">
      {!gameMode ? (
        <ModeSelection onSelectMode={handleSelectMode} />
      ) : (
        <Board mode={gameMode} />
      )}
    </div>
  );
}

export default App;
