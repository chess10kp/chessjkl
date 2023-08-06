import Piece from "./Piece.js";

const Square = ({ board, rank, file, highlight, keyHighlight }) => {
  let piece = "";
  if (board[file] !== undefined) {
    piece = board[file][rank];
  }
  let isHighlight = false;
  if (highlight) {
    isHighlight = highlight[0] == rank && highlight[1] == file;
  }
  const isKeyHighlight = keyHighlight[0] == rank && keyHighlight[1] == file;
  const isBlack = (rank + file) % 2 === 0;
  const classes = `square ${isBlack ? "white" : "black"} ${
    isHighlight ? "highlight" : ""
  } ${isKeyHighlight ? "key-highlight" : ""}`;
  return <div className={classes}>{piece && <Piece piece={piece} />}</div>;
};

export default Square;
