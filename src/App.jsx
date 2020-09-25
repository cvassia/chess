import React, { useEffect, useState } from "react";
import "./App.css";
import { gameSubject, initGame, resetGame, undoMove } from "./Game";
import Board from "./Board";
import resetIcon from "./assets/reset-icon.png";
import undoIcon from "./assets/undo-icon.png";

function App() {
  const [board, setBoard] = useState([]);
  const [isGameOver, setIsGameOver] = useState();
  const [result, setResult] = useState();
  useEffect(() => {
    initGame();
    const subscribe = gameSubject.subscribe((game) => {
      setBoard(game.board);
      setIsGameOver(game.isGameOver);
      setResult(game.result);
    });
    return () => subscribe.unsubscribe();
  }, []);

  return (
    <div className="container">
      {isGameOver && (
        <h2 className="vertical-text">
          Game Over
          <button onClick={resetGame}>
            <span className="vertical-text">New Game</span>
          </button>
        </h2>
      )}
      <div className="board-container">
        <Board board={board} />
        <button className="undo-button" onClick={undoMove}>
          <img className="undo-icon" src={undoIcon} alt="undo game" />
        </button>
        <button className="reset-button" onClick={resetGame}>
          <img className="reset-icon" src={resetIcon} alt="undo move" />
        </button>
      </div>
      {result && <h2 className="vertical-text">{result}</h2>}
    </div>
  );
}

export default App;
