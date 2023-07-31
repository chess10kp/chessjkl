import React from "react";
import "./Piece.css";

const Piece = ({ piece = null }) => {
  if (piece) {
    const image = `images/${piece}.png`;
    const pieceClass = piece.toUpperCase() == piece;
    return (
      <div
        className={pieceClass ? "white-piece piece" : "black-piece piece"}
        style={{ backgroundImage: `url(${image})` }}
      />
    );
  }
};

export default Piece;
