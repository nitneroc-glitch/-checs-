const VALUES = {

  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000

};

function evaluate() {

  let score = 0;

  for(let r=0;r<8;r++) {

    for(let c=0;c<8;c++) {

      const piece = board[r][c];

      if(!piece) continue;

      const value =
        VALUES[piece.toLowerCase()];

      if(isBlack(piece))
        score += value;
      else
        score -= value;

    }
  }

  // Bonus ML
  score += mlEvaluate(board);

  return score;
}

function aiMove() {

  if(gameOver) return;

  const depth =
    Number(
      document.getElementById("difficulty").value
    );

  const moves =
    getMovesForColor("black");

  if(!moves.length) {

    checkGameEnd();
    return;
  }

  let bestScore = -Infinity;
  let bestMove = moves[0];

  for(const move of moves) {

    const backup = cloneBoard();

    movePiece(
      move.r1,
      move.c1,
      move.r2,
      move.c2
    );

    const score =
      minimax(
        depth-1,
        false,
        -Infinity,
        Infinity
      );

    board = backup;

    if(score > bestScore) {

      bestScore = score;
      bestMove = move;

    }
  }

  movePiece(
    bestMove.r1,
    bestMove.c1,
    bestMove.r2,
    bestMove.c2
  );

  trainFromPosition(board);

  turn = "white";

  drawBoard();

  document.getElementById("status").textContent =
    "À toi de jouer !";

  checkGameEnd();
}

function minimax(
  depth,
  maximizing,
  alpha,
  beta
) {

  if(depth <= 0)
    return evaluate();

  const color =
    maximizing ? "black" : "white";

  const moves =
    getMovesForColor(color);

  if(!moves.length)
    return evaluate();

  if(maximizing) {

    let best = -Infinity;

    for(const move of moves) {

      const backup = cloneBoard();

      movePiece(
        move.r1,
        move.c1,
        move.r2,
        move.c2
      );

      const score =
        minimax(
          depth-1,
          false,
          alpha,
          beta
        );

      board = backup;

      best = Math.max(best,score);

      alpha = Math.max(alpha,score);

      if(beta <= alpha)
        break;
    }

    return best;

  } else {

    let best = Infinity;

    for(const move of moves) {

      const backup = cloneBoard();

      movePiece(
        move.r1,
        move.c1,
        move.r2,
        move.c2
      );

      const score =
        minimax(
          depth-1,
          true,
          alpha,
          beta
        );

      board = backup;

      best = Math.min(best,score);

      beta = Math.min(beta,score);

      if(beta <= alpha)
        break;
    }

    return best;
  }
}

function cloneBoard() {

  return board.map(row => [...row]);
}
