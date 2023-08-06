import React, { useEffect, useRef, useState } from "react";
import "./Board.css";
import Square from "./Square.js";
import { isWhite as color, fenToArr, generateNotation } from "../utils.js";

import { Chess } from "chess.js";

const Board = () => {
  const chess = useRef(new Chess());
  const [board, setBoard] = useState(fenToArr(chess.current.fen()));
  const [keyHighlight, setkeyHighlight] = useState([5, 5]);
  const [highlightedSquare, setHighlightedSquare] = useState([]);
  const [activePieceSquare, setActivePieceSquare] = useState(null);
  const [activePiece, setActivePiece] = useState(null);
  const boardref = useRef(null);
  const turnToMove = useRef("w");
  const keyStack = useRef([]); // stack to store number prefixes

  function updateHighlight(index, value) {
    setkeyHighlight((previousHighlight) => {
      const newHighlight = [...previousHighlight];
      newHighlight[index] += value;
      newHighlight[index] = newHighlight[index] < 0 ? 0 : newHighlight[index];
      newHighlight[index] = newHighlight[index] > 7 ? 7 : newHighlight[index];
      return newHighlight;
    });
  }
  function handleKeyDown(e) {
    switch (e.key) {
      case "j":
        updateHighlight(1, 1);
        break;
      case "k":
        updateHighlight(1, -1);
        break;
      case "l":
        updateHighlight(0, 1);
        break;
      case "h":
        updateHighlight(0, -1);
        break;
      case "1":
        keyStack.current.append(1);
        console.log(keyStack);
        break;
      case "Enter":
        const yCoord = keyHighlight[1];
        const xCoord = keyHighlight[0];
        const pieceSelected = board[keyHighlight[1]][keyHighlight[0]];
        if (pieceSelected) {
          if (color(pieceSelected) == turnToMove.current) {
            // toggle highlights
            if (
              activePiece &&
              activePieceSquare[0] == xCoord &&
              activePieceSquare[1] == yCoord
              // if the same piece is clicked turn off highlight
            ) {
              setHighlightedSquare([]);
              setActivePieceSquare(null);
              setActivePiece(null);
            } else {
              // else highlight the piece
              setActivePieceSquare([xCoord, yCoord]);
              setActivePiece(board[yCoord][xCoord]);
              setHighlightedSquare([xCoord, yCoord]);
            }
          } else {
            // if piece selected is of opposing color, capture
            if (activePieceSquare) {
              const toNotation = generateNotation(xCoord, yCoord); //to coordinate in coordinate form
              const fromNotation = generateNotation(
                activePieceSquare[0],
                activePieceSquare[1]
              );
              let move;
              try {
                move = chess.current.move({
                  to: toNotation,
                  from: fromNotation,
                });
              } catch (error) {
                return;
              }
              const boardState = fenToArr(move.after);
              setBoard(boardState);
              setActivePiece(null);
              setActivePieceSquare(null);
              setHighlightedSquare([]);
            } else {
              // clicking opposing piece without a piece selected
              return;
            }
          }
        } else {
          // square selected to move
          if (activePieceSquare) {
            const toNotation = generateNotation(xCoord, yCoord); //to coordinate in coordinate form
            const fromNotation = generateNotation(
              activePieceSquare[0],
              activePieceSquare[1]
            );
            let move;
            try {
              move = chess.current.move({ to: toNotation, from: fromNotation });
            } catch (error) {
              return;
            }
            const boardState = fenToArr(move.after);
            setBoard(boardState);
            turnToMove.current = turnToMove.current == "w" ? "b" : "w";
            setActivePiece(null);
            setActivePieceSquare(null);
            setHighlightedSquare([]);
          }
        }
        break;
      default:
        return;
    }
  }
  function handlePieceClick(e) {
    setkeyHighlight([]) // remove keyHighlight when using mouse
    const classList = e.target.className.split(" ");
    const xCoord = Math.floor(
      (e.clientX - boardref.current.getBoundingClientRect().x) / 50
    );
    const yCoord = Math.floor(
      (e.clientY - boardref.current.getBoundingClientRect().y) / 45
    );
    if (classList.includes("piece")) {
      if (
        (classList.includes("white-piece") && turnToMove.current == "w") ||
        (classList.includes("black-piece") && turnToMove.current == "b")
        // if the piece is the same as the color to move, switch highlights
      ) {
        if (
          activePiece &&
          activePieceSquare[0] == xCoord &&
          activePieceSquare[1] == yCoord
          // if the same piece is clicked turn off highlight
        ) {
          setHighlightedSquare([]);
          setActivePieceSquare(null);
          setActivePiece(null);
        } else {
          // else highlight the piece
          setActivePieceSquare([xCoord, yCoord]);
          setActivePiece(board[yCoord][xCoord]);
          setHighlightedSquare([xCoord, yCoord]);
          setkeyHighlight([xCoord, yCoord])
        }
      } else {
        // if piece selected is of opposing color, captures
        if (activePieceSquare) {
          const toNotation = generateNotation(xCoord, yCoord); //to coordinate in coordinate form
          const fromNotation = generateNotation(
            activePieceSquare[0],
            activePieceSquare[1]
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
          turnToMove.current = turnToMove.current == "w" ? "b" : "w";
        } else {
          setkeyHighlight([xCoord, yCoord])
          return;
        }
      }
    } else {
      if (activePieceSquare) {
        const toNotation = generateNotation(xCoord, yCoord); //to coordinate in coordinate form
        const fromNotation = generateNotation(
          activePieceSquare[0],
          activePieceSquare[1]
        );
        let move;
        try {
          move = chess.current.move({ to: toNotation, from: fromNotation });
        } catch (error) {
          return;
        }
        const boardState = fenToArr(move.after);
        setBoard(boardState);
        turnToMove.current = turnToMove.current == "w" ? "b" : "w";
        setActivePiece(null);
        setActivePieceSquare(null);
        setHighlightedSquare([]);
      }
      else {
        setkeyHighlight([xCoord, yCoord])
        return
      }
    }
  }
  return (
    <div
      ref={boardref}
      className="board"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseDown={handlePieceClick}
    >
      {board.map((rank, rankIndex) => (
        <div key={rankIndex}>
          {rank.map((_file, fileIndex) => (
            <Square
              board={board}
              highlight={highlightedSquare}
              keyHighlight={keyHighlight}
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
