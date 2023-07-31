import Piece from "./Piece.js";

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

export default Square
