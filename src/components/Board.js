import React, { useEffect, useRef, useState } from "react";
import "./Board.css";
import Square from "./Square.js";
import { fenToArr, generateNotation } from "../utils.js";

import { Chess } from "chess.js";

const Board = () => {
  const files = {
    0: "a",
    1: "b",
    2: "c",
    3: "d",
    4: "e",
    5: "f",
    6: "g",
    7: "h",
  };
  const chess = useRef(new Chess())
  const [board, setBoard] = useState(fenToArr(chess.current.fen()));
  const [highlight, setHighlight] = useState(false);
  const [highlightedSquare, setHighlightedSquare] = useState([]);
  const [activePieceSquare, setActivePieceSquare] = useState(null);
  const [activePiece, setActivePiece] = useState(null);
  const boardref = useRef(null);
  const turnToMove = chess.current.turn();

  function onPieceClick(e) {
    const classList = e.target.className.split(" ");
    const xCoord = Math.floor(
      (e.clientX - boardref.current.getBoundingClientRect().x) / 50,
    );
    const yCoord = Math.floor(
      (e.clientY - boardref.current.getBoundingClientRect().y) / 45,
    );
    if (classList.includes("piece")) {
      if (classList.includes("white-piece") && turnToMove == "w" || classList.includes("black-piece") && turnToMove == "b") {
        if (
          activePiece &&
          activePieceSquare[0] == xCoord &&
          activePieceSquare[1] == yCoord
        ) {
          setHighlightedSquare([]);
          setActivePieceSquare(null);
          setActivePiece(null);
        } else {
          setActivePieceSquare([xCoord, yCoord]);
          setActivePiece(board[yCoord][xCoord]);
          setHighlightedSquare([xCoord, yCoord]);
        }
      }
    } else {
      if (activePieceSquare) {
        const toNotation = generateNotation(xCoord, yCoord);
        const fromNotation = generateNotation(
          activePieceSquare[0],
          activePieceSquare[1],
        );
        let move;
        try {
          move = chess.current.move({ to: toNotation, from: fromNotation });
        } catch (error) {
          return;
        }
        const boardState = fenToArr(move.after);
        setBoard(boardState);
        setActivePiece(null);
        setActivePieceSquare(null);
        setHighlightedSquare([]);
      }
    }
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
