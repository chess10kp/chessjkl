const fenToArr = (fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR") => {
  const field = fen.split(" ");
  const files = field[0].split("/");
  const arr = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => "")
  );
  let rankIndex;
  for (let i = 0; i < files.length; i++) {
    rankIndex = 0;
    for (let j = 0; j < files[i].length; j++) {
      if (!isNaN(files[i][j])) {
        rankIndex += parseInt(files[i][j]);
      } else {
        arr[i][rankIndex] = files[i][j];
        rankIndex += 1;
      }
    }
  }
  return arr;
};

const isWhite = (piece) => {
  return piece == piece.toUpperCase() ? "w" : "b";
};

const generateNotation = (xCoord, yCoord) => {
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
  return `${files[xCoord]}${8 - yCoord}`;
};

const generateCoords = (notation) => {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
  if (notation.length == 2) {
    // the piece is a pawn
    const xCoord = files.indexOf(notation[0]);
    return `${xCoord}${8 - parseInt(notation[1])}`;
  } else if (
    notation.length == 3 ||
    (notation.length == 4 && notation[notation.length - 1] == "+")
  ) {
    // piece that isnt capturing or a piece that checks
    const xCoord = files.indexOf(notation[1]);
    return `${xCoord}${8 - parseInt(notation[2])}`;
  } else if (
    notation.length == 4 ||
    (notation.length == 5 && notation[notation.length - 1] == "+")
  ) {
    // piece or pawn capture
    const xCoord = files.indexOf(notation[2]);
    return `${xCoord}${8 - parseInt(notation[3]) }`;
  }
};

module.exports = {
  fenToArr,
  generateNotation,
  isWhite,
  generateCoords,
};
