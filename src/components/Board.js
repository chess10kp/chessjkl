import React, { useState } from "react";
import "./Board.css";
import Piece from "./Piece.js"

// import { Chess } from 'chess.js'

const Board = () => {
  // const initPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPPP/RNBQKBNR"
  const [board, setboard] = useState(Array(8).fill(Array(8).fill("")));

  const Square = ({ rank, file }) => {
    const isBlack = (rank + file) % 2 == 0;
    return <div className={`square ${isBlack ? "white" : "black"}`}></div>;
  };
    return (
    <div className="board">
      {board.map((rank, rankindex) => (
        <div key={rankindex} classname="row">
          {rank.map((_file, fileIndex) => (
            <Square rank={rankindex} file={fileIndex}></Square>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
