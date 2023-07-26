const fenToArr = (fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR") => {
  const field = fen.split(" ");
  const files = field[0].split("/");
  const arr = [...Array(8)].map((ele) => Array(8));
  for (let i = 0; i < files.length; i++) {
    for (let j = 0; j < files[i].length; j++) {
      if (!isNaN(files[i][j])) {
        j += files[i][j] - 1;
      } else {
        arr[i][j] = [
          files[i][j],
          files[i][j] == files[i][j].toLowerCase() ? 0 : 1,
        ];
      }
    }
  }
  return arr;
};

