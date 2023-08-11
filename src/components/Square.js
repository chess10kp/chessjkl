import Piece from "./Piece.js";
import { isWhite  } from "../utils";

const Square = ({ board, rank, file, highlight, keyHighlight , inCheck, turnToMove, suggestionCoords}) => {
  const isSuggestionHighlight = suggestionCoords.current.find((el) => el == `${rank}${file}` )
  if (isSuggestionHighlight) {
  }
  let piece = "";
  if (board[file] !== undefined) {
    piece = board[file][rank];
  }
  let isHighlight = false;
  if (highlight) {
    isHighlight = highlight[0] == rank && highlight[1] == file;
  }
  let isCheckHighlight = false;
  if (inCheck && piece) { //if A king is under check and this is a square with a piece 
    if (piece.toUpperCase() == "K") {
      if (isWhite(piece) != turnToMove.current) { // if piece color is the same as the turnTomove
        isCheckHighlight = true; // handles both white and black
      }
    }
  }
  const isKeyHighlight = keyHighlight[0] == rank && keyHighlight[1] == file;
  const isBlackSquare = (rank + file) % 2 === 0;
  const classes = `square ${isBlackSquare ? "white" : "black"} ${
    isHighlight ? "highlight" : ""
  } ${isKeyHighlight ? "key-highlight" : ""} ${isCheckHighlight ? "check-highligh" : ""} ${isSuggestionHighlight ? "suggestion-highlight" : ""}`;
  return <div className={classes}>{piece && <Piece piece={piece} />}</div>;
};

export default Square;
