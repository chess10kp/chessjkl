import React, { useEffect, useRef, useState } from "react";
import "./Board.css";
import Square from "./Square.js";
import {
  isWhite as color,
  fenToArr,
  generateNotation,
  generateCoords,
} from "../utils.js";

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
  const inCheck = useRef(false);
  const suggestionCoords = useRef([]);

  useEffect(() => {
    inCheck.current = chess.current.inCheck();
    return () => {};
  }, [board]);

  function updateHighlight(index, value) {
    setkeyHighlight((previousHighlight) => {
      const newHighlight = [...previousHighlight];
      newHighlight[index] += value;
      newHighlight[index] = newHighlight[index] < 0 ? 0 : newHighlight[index];
      newHighlight[index] = newHighlight[index] > 7 ? 7 : newHighlight[index];
      return newHighlight;
    });
  }

  function movePlayedHandler(move) {
          turnToMove.current = turnToMove.current == "w" ? "b" : "w";
    suggestionCoords.current = []
          const boardState = fenToArr(move.after);
          setBoard(boardState);
          setActivePiece(null);
          setActivePieceSquare(null);
          setHighlightedSquare([]);
  }
  function pieceSelectHandler(xCoord = "", yCoord = "") {
    if (!xCoord && !yCoord) {
      suggestionCoords.current = [];
      setHighlightedSquare([]);
      setActivePieceSquare(null);
      setActivePiece(null);
      return
    }
    const fromNotation = generateNotation(xCoord, yCoord);
    const moves = chess.current.moves({ square: fromNotation });
    let coords = [];
    for (let i = 0; i < moves.length; i++) {
      // loop through list of possible moves and store coordinates in coords
      const coord = generateCoords(moves[i]);
      coords.push(coord);
    }
    suggestionCoords.current = coords;
    setActivePieceSquare([xCoord, yCoord]);
    setActivePiece(board[yCoord][xCoord]);
    setHighlightedSquare([xCoord, yCoord]);
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
        break;
      case "Enter":
        const yCoord = keyHighlight[1];
        const xCoord = keyHighlight[0];
        const pieceSelected = board[keyHighlight[1]][keyHighlight[0]];
        if (pieceSelected) {
          if (color(pieceSelected) == turnToMove.current) { // color of piece selected is the same as the player's turn
            // toggle highlights
            if (
              // if the same piece is selected turn off highlight
              activePiece &&
              activePieceSquare[0] == xCoord &&
              activePieceSquare[1] == yCoord
            ) {
              pieceSelectHandler()
            } else {
              // else highlight the piece
              pieceSelectHandler(xCoord, yCoord);
            }
          } else {
            // if piece selected is of opposing color, capture
            if (activePieceSquare) {
              const toNotation = generateNotation(xCoord, yCoord); 
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
              movePlayedHandler(move)
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
            movePlayedHandler(move)
          }
        }
        break;
      default:
        return;
    }
  }
  function handlePieceClick(e) {
    setkeyHighlight([]); // remove keyHighlight when using mouse
    const classList = e.target.className.split(" ");
    const xCoord = Math.floor(
      (e.clientX - boardref.current.getBoundingClientRect().x) / 50
    );
    const yCoord = Math.floor(
      (e.clientY - boardref.current.getBoundingClientRect().y) / 45
    );
    if (classList.includes("piece")) {
      // a piece is clicked
      if (
        // if the piece is the same as the color to move, switch highlights
        (classList.includes("white-piece") && turnToMove.current == "w") ||
        (classList.includes("black-piece") && turnToMove.current == "b")
      ) {
        if (
          // if the same piece is clicked turn off highlight
          activePiece &&
          activePieceSquare[0] == xCoord &&
          activePieceSquare[1] == yCoord
        ) {
          pieceSelectHandler()
        } else {
          // else highlight the piece and show suggestions
          pieceSelectHandler(xCoord,yCoord)
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
          movePlayedHandler(move)
        } else {
          // if only an oppoenent piece is selectd
          setkeyHighlight([xCoord, yCoord]);
          return;
        }
      }
    } else {
      //if square is selected
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
        movePlayedHandler(move)
      } else {
        setkeyHighlight([xCoord, yCoord]);
        return;
      }
    }
  }
  return (
    <div>
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
                inCheck={inCheck}
                turnToMove={turnToMove}
                suggestionCoords={suggestionCoords}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
