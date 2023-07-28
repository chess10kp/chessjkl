import React, { useState, useRef } from "react";
import "./Board.css";
import Piece from "./Piece.js"
import fenToArr from "../utils.js"

// import { Chess } from 'chess.js'

const Board = () => {
  const initPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPPP/RNBQKBNR"
  const [board, setboard] = useState([
['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
["", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", ""],
['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
])
  const Square = ({ rank, file}) => { 
        let piece = ""
        try {
            piece = board[file][rank]
        } catch (Typeerror) {
            piece = ""
        }
      const isBlack = (rank + file) % 2 == 0; return (
          <div className={`square ${isBlack ? "white" : "black"}`}>
          {piece && <Piece piece={piece}/>}
          </div>
      )
  };
    return (
    <div className="board">
      {board.map((rank, rankIndex) => (
        <div key={rankIndex} >
          {rank.map((_file, fileIndex) => 
            <Square rank={rankIndex} 
                  file={fileIndex} 
                  key={`${fileIndex}-${rankIndex}`}/>
          )
            }
        </div>
      ))}
    </div>
  );
};

export default Board;
