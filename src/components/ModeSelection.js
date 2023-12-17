const ModeSelection = ({ onSelectMode }) => {
    return (
      <div className="mode-selection">
        <button onClick={() => onSelectMode('single')}>1 Player</button>
        <button onClick={() => onSelectMode('multi')}>2 Players</button>
      </div>
    );
  };
  
  export default ModeSelection;