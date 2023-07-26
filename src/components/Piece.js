import React from 'react'

const Piece = ({piece}) => {
    const piecesUnicode = {
        "N": "♘",
        "K":"♔",
        "R":"♖",
        "Q":"♕",
        "P":"♙",
        "n":"♞",
        "k":"♚",
        "r":"♜",
        "q":"♛",
        "p":"♟︎",
        "b":"♝",
    }
    if (piece in piecesUnicode){
        return (
            <>
            <div>{piecesUnicode[piece]}</div>
            </>
        )
    }
}

    export default Piece
