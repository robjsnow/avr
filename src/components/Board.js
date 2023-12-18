import React, { useState, useEffect, useCallback } from 'react';


const checkWinner = (board) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // Return 'Alien' or 'Robot'
    }
  }

  return null; // No winner yet
};

const Board = ({ mode }) => {
  const initialBoard = Array(9).fill(null);
  const [board, setBoard] = useState(initialBoard);
  const [isAlienTurn, setIsAlienTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  const handleClick = useCallback((index) => {
    if (board[index] !== null || winner) {
      return;
    }

    playSound(isAlienTurn ? '👽' : '🤖');

    const newBoard = board.map((item, idx) => {
      if (idx === index) {
        return isAlienTurn ? '👽' : '🤖';
      }
      return item;
    });

    setBoard(newBoard);
    setIsAlienTurn(!isAlienTurn);
    const newWinner = checkWinner(newBoard);
    const isBoardFull = newBoard.every(cell => cell !== null);

    if (!newWinner && isBoardFull) {
      setWinner('Tie');
    } else {
      setWinner(newWinner);
    }
  }, [board, isAlienTurn, winner]);

  const playSound = (player) => {
    const sound = new Audio(player === '👽' ? 'sound/alien.mp3' : 'sound/robot.mp3');
    sound.play();
  };

  const findWinningMove = useCallback((board, player) => {
    for (let i = 0; i < board.length; i++) {
      if (board[i]) continue;
      let newBoard = [...board];
      newBoard[i] = player;
      if (checkWinner(newBoard) === player) {
        return i;
      }
    }
    return null;
  }, []);

  const findRandomMove = useCallback((board) => {
    const emptyIndices = board
      .map((cell, index) => (cell === null ? index : null))
      .filter(val => val !== null);
    if (emptyIndices.length === 0) {
      return null;
    }
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }, []);

  const findBestMove = useCallback((board) => {

    return findRandomMove(board); 
  }, [findRandomMove]);

  const makeMove = useCallback((index) => {
    if (index === null) return;
    setTimeout(() => handleClick(index), 500);
  }, [handleClick]);

  const handleAIMove = useCallback(() => {
    let move = null;
  
    move = findWinningMove(board, '🤖');
    if (move !== null) {
      return makeMove(move);
    }
  
    move = findWinningMove(board, '👽');
    if (move !== null) {
      return makeMove(move);
    }
  
    if (Math.random() < 0.1) { // 10% chance of making a mistake
      move = findRandomMove(board);
    } else {
      move = findBestMove(board);
    }
    
    makeMove(move);
  }, [board, findBestMove, findRandomMove, findWinningMove, makeMove]);

  useEffect(() => {
    if (mode === 'single' && !isAlienTurn && !winner) {
      handleAIMove();
    }
  }, [board, isAlienTurn, mode, winner, handleAIMove]);



  const renderCell = (index) => {
    return (
      <button onClick={() => handleClick(index)}>
        {board[index]}
      </button>
    );
  };

  const getWinnerGif = () => {
    return winner === '👽' ? '/images/alien.gif' : '/images/robot.gif';
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setWinner(null);
    setIsAlienTurn(true);
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Aliens vs Robots</h2>
      <div className="board-container">
        {Array.from(Array(9).keys()).map(index => renderCell(index))}
      </div>
      {winner && (
        <div className="winner-announcement">
          {winner === 'Tie' ? (
            <p>It's a tie!</p>
          ) : (
            <>
              <img src={getWinnerGif()} alt="Winner!" />
              <p>Congratulations {winner}!</p>
            </>
          )}
          <button onClick={resetGame}>Reset Game</button>
        </div>
      )}
    </div>
  );
};

export default Board;