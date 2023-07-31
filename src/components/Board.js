import React, { useEffect, useRef, useState } from "react";
import "./Board.css";
import Piece from "./Piece.js";
import fenToArr from "../utils.js";

import { Chess } from "chess.js";

const Board = () => {
  const chess = new Chess();
  const [board, setboard] = useState(fenToArr(chess.fen()));
  const [highlight, setHighlight] = useState(false);
  const [highlightedSquare, setHighlightedSquare] = useState([]);
  const [activePiece, setActivePiece] = useState(null);
  const boardref = useRef(null);

  const Square = ({ board, rank, file, highlight }) => {
    let piece = "";
    if (board[file] !== undefined) {
      piece = board[file][rank];
    }
    let isHighlight = false
    if (highlight) {
      isHighlight =  (highlight[0] == rank && highlight[1] == file) 
    }
    const isBlack = (rank + file) % 2 === 0;
    const classes = `square ${isBlack ? "white" : "black"} ${isHighlight ? "highlight" : ""}`
    return (
      <div className={classes}>
        {piece && <Piece piece={piece} />}
      </div>
    );
  };

  function onPieceClick(e) {
    const classList = e.target.className.split(" ");
    // if (classList.includes("piece")) {
    const xCoord = (Math.floor((e.clientX - boardref.current.getBoundingClientRect().x)/50))
    const yCoord = (Math.floor((e.clientY - boardref.current.getBoundingClientRect().y)/45))
    setHighlightedSquare([xCoord, yCoord])

    // }
  }
  return (
    <div ref={boardref} className="board" onMouseDown={onPieceClick}>
      {board.map((rank, rankIndex) => (
        <div key={rankIndex}>
          {rank.map((_file, fileIndex) => (
            <Square
              board={board}
              highlight={highlightedSquare}
              rank={rankIndex}
              file={fileIndex}
              key={`${fileIndex}-${rankIndex}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
