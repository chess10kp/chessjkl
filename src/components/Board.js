import React, { useEffect, useRef, useState } from "react";
import "./Board.css";
import Square from "./Square.js";
import BoardPlayer from "./ui/Player";
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
  const [keyHighlight, setkeyHighlight] = useState([4, 7]);
  const [highlightedSquare, setHighlightedSquare] = useState([]);
  const [activePieceSquare, setActivePieceSquare] = useState(null);
  const [activePiece, setActivePiece] = useState(null);
  const boardref = useRef(null);
  const turnToMove = useRef("w");
  const keyStack = useRef(1);
  const inCheck = useRef(false);
  const gameHasStarted = useRef(false);
  const gameHasEnded = useRef(false);
  const gameResult = useRef("");
  const suggestionCoords = useRef([]);
  document.addEventListener("keydown", function (el) {
    if (el.key == "Enter" && el.ctrlKey) {
      gameHasStarted.current = true;
      boardref.current.focus();
    }
  });

  useEffect(() => {
    inCheck.current = chess.current.inCheck();
    return () => {};
  }, [board]);

  useEffect(() => {
    if (chess.current.isGameOver()) {
      if (chess.current.isCheckmate()) {
        gameHasEnded.current = true;
        gameResult.current = `${turnToMove == "w" ? "white" : "black "} wins`;
      }
      if (
        chess.current.isDraw() ||
        chess.current.isInsufficientMaterial() ||
        chess.current.isStalemate()
      ) {
        gameHasEnded.current = true;
        gameResult.current = `Draw`;
      }
    }

    return () => {};
  }, [turnToMove]);

  function updateHighlight(index, value) {
    setkeyHighlight((previousHighlight) => {
      const newHighlight = [...previousHighlight];
      newHighlight[index] += value;
      newHighlight[index] = newHighlight[index] < 0 ? 0 : newHighlight[index];
      newHighlight[index] = newHighlight[index] > 7 ? 7 : newHighlight[index];
      return newHighlight;
    });
    keyStack.current = 1;
  }

  function movePlayedHandler(move) {
    turnToMove.current = turnToMove.current == "w" ? "b" : "w";
    suggestionCoords.current = [];
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
      return;
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
    setkeyHighlight([xCoord, yCoord]);
  }

  function handleKeyDown(e) {
    switch (e.key) {
      case "j":
      case "ArrowDown":
        updateHighlight(1, 1 * parseInt(keyStack.current));
        break;
      case "k":
      case "ArrowUp":
        updateHighlight(1, -1 * parseInt(keyStack.current));
        break;
      case "l":
      case "ArrowRight":
        updateHighlight(0, 1 * parseInt(keyStack.current));
        break;
      case "h":
      case "ArrowLeft":
        updateHighlight(0, -1 * parseInt(keyStack.current));
        break;
      case "1":
        keyStack.current = 1;
        break;
      case "2":
        keyStack.current = 2;
        break;
      case "3":
        keyStack.current = 3;
        break;
      case "4":
        keyStack.current = 4;
        break;
      case "5":
        keyStack.current = 5;
        break;
      case "6":
        keyStack.current = 6;
        break;
      case "7":
        keyStack.current = 7;
        break;
      case "8":
        keyStack.current = 8;
        break;
      case "9":
        keyStack.current = 9;
        break;
      case "Enter":
        if (document.activeElement != boardref.current || e.ctrlKey) {
          return;
        }
        const yCoord = keyHighlight[1];
        const xCoord = keyHighlight[0];
        const pieceSelected = board[keyHighlight[1]][keyHighlight[0]];
        if (pieceSelected) {
          if (color(pieceSelected) == turnToMove.current) {
            // color of piece selected is the same as the player's turn
            // toggle highlights
            if (
              // if the same piece is selected turn off highlight
              activePiece &&
              activePieceSquare[0] == xCoord &&
              activePieceSquare[1] == yCoord
            ) {
              pieceSelectHandler();
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
              movePlayedHandler(move);
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
            movePlayedHandler(move);
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
          pieceSelectHandler();
        } else {
          // else highlight the piece and show suggestions
          pieceSelectHandler(xCoord, yCoord);
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
          movePlayedHandler(move);
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
        movePlayedHandler(move);
      } else {
        setkeyHighlight([xCoord, yCoord]);
        return;
      }
    }
  }
  return (
    <div>
      <BoardPlayer
        turnToMove={turnToMove}
        player="black"
        gameHasStarted={gameHasStarted.current}
        gameHasEnded={gameHasEnded.current}
      />
      <div
        ref={boardref}
        className="board"
        id="board"
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
      <BoardPlayer
        turnToMove={turnToMove}
        player="white"
        gameHasStarted={gameHasStarted.current}
        gameHasEnded={gameHasEnded.current}
      />
    </div>
  );
};

export default Board;
