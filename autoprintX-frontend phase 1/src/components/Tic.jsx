import { useState } from "react";

const Tic = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true);
  const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const checkWinners = (currBoard) => {
    for (let i = 0; i < winningPatterns.length; i++) {
      const [a, b, c] = winningPatterns[i];

      if (
        currBoard[a] &&
        currBoard[a] === currBoard[b] &&
        currBoard[a] === currBoard[c]
      ) {
        return currBoard[a];
      }
    }
    return null;
  };
  const handleClick = (index) => {
    const newBoard = [...board];
    newBoard[index] = xTurn ? "X" : "O";

    setBoard(newBoard);
    setXTurn(!xTurn);
    const winner = checkWinners(newBoard);
    console.log(winner);

    if (winner || board[index]) return;
  };

  return (
    <>
      <div className="board">
        {board.map((cell, index) => {
          return (
            <button
              key={index}
              className="cell"
              onClick={() => handleClick(index)}
              disabled={cell !== null}
            >
              {cell}
            </button>
          );
        })}
      </div>
    </>
  );
};
export default Tic;
