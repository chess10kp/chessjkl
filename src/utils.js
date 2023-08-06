const fenToArr = (fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR") => {
  const field = fen.split(" ");
  const files = field[0].split("/");
  const arr = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => ""),
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
module.exports = {
  fenToArr,
  generateNotation,
  isWhite,
};
