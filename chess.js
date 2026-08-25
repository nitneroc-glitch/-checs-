const PIECES = {
  P: "♙",
  R: "♖",
  N: "♘",
  B: "♗",
  Q: "♕",
  K: "♔",

  p: "♟",
  r: "♜",
  n: "♞",
  b: "♝",
  q: "♛",
  k: "♚"
};

let board = [];
let selected = null;
let turn = "white";
let gameOver = false;

function createBoard() {

  board = [

    ["r","n","b","q","k","b","n","r"],
    ["p","p","p","p","p","p","p","p"],

    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],

    ["P","P","P","P","P","P","P","P"],
    ["R","N","B","Q","K","B","N","R"]

  ];

  turn = "white";
  selected = null;
  gameOver = false;

  drawBoard();
}

function drawBoard() {

  const container = document.getElementById("board");

  container.innerHTML = "";

  for(let r = 0; r < 8; r++) {

    for(let c = 0; c < 8; c++) {

      const square = document.createElement("div");

      square.className =
        "square " +
        ((r + c) % 2 === 0 ? "light" : "dark");

      const piece = board[r][c];

      if(piece) {
        square.textContent = PIECES[piece];
      }

      if(
        selected &&
        selected.r === r &&
        selected.c === c
      ) {
        square.classList.add("selected");
      }

      square.onclick = () => clickSquare(r,c);

      container.appendChild(square);
    }
  }
}

function isWhite(piece) {
  return piece && piece === piece.toUpperCase();
}

function isBlack(piece) {
  return piece && piece === piece.toLowerCase();
}

function clickSquare(r,c) {

  if(gameOver || turn !== "white") return;

  const piece = board[r][c];

  if(!selected) {

    if(piece && isWhite(piece)) {

      selected = {r,c};

      drawBoard();
    }

    return;
  }

  if(
    selected.r === r &&
    selected.c === c
  ) {

    selected = null;
    drawBoard();
    return;
  }

  if(piece && isWhite(piece)) {

    selected = {r,c};
    drawBoard();

    return;
  }

  if(isLegalMove(selected.r, selected.c, r, c)) {

    movePiece(
      selected.r,
      selected.c,
      r,
      c
    );

    selected = null;

    drawBoard();

    if(!checkGameEnd()) {

      turn = "black";

      document.getElementById("status").textContent =
        "🤖 L'IA réfléchit...";

      setTimeout(aiMove, 300);
    }
  }
}

function movePiece(r1,c1,r2,c2) {

  let piece = board[r1][c1];

  board[r2][c2] = piece;
  board[r1][c1] = null;

  // Promotion
  if(piece === "P" && r2 === 0)
    board[r2][c2] = "Q";

  if(piece === "p" && r2 === 7)
    board[r2][c2] = "q";
}

function isLegalMove(r1,c1,r2,c2) {

  const piece = board[r1][c1];

  if(!piece) return false;

  if(
    isWhite(piece) &&
    turn !== "white"
  ) return false;

  if(
    isBlack(piece) &&
    turn !== "black"
  ) return false;

  const target = board[r2][c2];

  if(
    target &&
    isWhite(piece) === isWhite(target)
  ) return false;

  const dr = r2-r1;
  const dc = c2-c1;

  const adr = Math.abs(dr);
  const adc = Math.abs(dc);

  const type = piece.toLowerCase();

  if(type === "p") {

    const direction =
      isWhite(piece) ? -1 : 1;

    const start =
      isWhite(piece) ? 6 : 1;

    if(dc === 0 && !target) {

      if(dr === direction)
        return true;

      if(
        r1 === start &&
        dr === direction*2 &&
        !board[r1+direction][c1]
      )
        return true;
    }

    if(
      adr === 1 &&
      adc === 1 &&
      dr === direction &&
      target
    )
      return true;

    return false;
  }

  if(type === "n") {

    return (
      (adr === 2 && adc === 1) ||
      (adr === 1 && adc === 2)
    );
  }

  if(type === "k") {

    return adr <= 1 && adc <= 1;
  }

  if(type === "r") {

    if(dr !== 0 && dc !== 0)
      return false;

    return clearPath(
      r1,c1,r2,c2
    );
  }

  if(type === "b") {

    if(adr !== adc)
      return false;

    return clearPath(
      r1,c1,r2,c2
    );
  }

  if(type === "q") {

    if(
      dr !== 0 &&
      dc !== 0 &&
      adr !== adc
    )
      return false;

    return clearPath(
      r1,c1,r2,c2
    );
  }

  return false;
}

function clearPath(r1,c1,r2,c2) {

  const dr = Math.sign(r2-r1);
  const dc = Math.sign(c2-c1);

  let r = r1+dr;
  let c = c1+dc;

  while(r !== r2 || c !== c2) {

    if(board[r][c])
      return false;

    r += dr;
    c += dc;
  }

  return true;
}

function getLegalMoves(color) {

  const moves = [];

  for(let r=0;r<8;r++) {

    for(let c=0;c<8;c++) {

      const piece = board[r][c];

      if(!piece) continue;

      if(
        color === "white" &&
        !isWhite(piece)
      ) continue;

      if(
        color === "black" &&
        !isBlack(piece)
      ) continue;

      for(let r2=0;r2<8;r2++) {

        for(let c2=0;c2<8;c2++) {

          if(isLegalMove(r,c,r2,c2)) {

            moves.push({
              r1:r,
              c1:c,
              r2:r2,
              c2:c2
            });
          }

        }
      }
    }
  }

  return moves;
}

function checkGameEnd() {

  const white = getMovesForColor("white");
  const black = getMovesForColor("black");

  if(!white.length) {

    gameOver = true;

    if(turn === "white") {

      document.getElementById("status").textContent =
        "💀 L'IA gagne !";

      updateStats("loss");
    }
    else {

      document.getElementById("status").textContent =
        "🏆 Tu as gagné !";

      updateStats("win");
    }

    return true;
  }

  if(!black.length) {

    gameOver = true;

    document.getElementById("status").textContent =
      "🏆 Tu as gagné !";

    updateStats("win");

    return true;
  }

  return false;
}

function getMovesForColor(color) {

  const oldTurn = turn;

  turn = color;

  const moves = getLegalMoves(color);

  turn = oldTurn;

  return moves;
}

function startGame() {

  loadStats();

  createBoard();
}

function newGame() {

  createBoard();

  document.getElementById("status").textContent =
    "À toi de jouer !";
}

document
  .getElementById("newGame")
  .addEventListener("click", newGame);
