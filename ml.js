let mlWeights =
  JSON.parse(
    localStorage.getItem("chessML")
  ) || {

    material: 1,
    center: 0.2,
    development: 0.1,
    random: 0.05

  };

function mlEvaluate(position) {

  let score = 0;

  let center = 0;

  const centers = [
    [3,3],
    [3,4],
    [4,3],
    [4,4]
  ];

  for(const [r,c] of centers) {

    const piece = position[r][c];

    if(!piece) continue;

    if(isBlack(piece))
      center += 1;

    else
      center -= 1;
  }

  score +=
    center *
    mlWeights.center *
    100;

  return score;
}

function trainFromPosition(position) {

  // Petit apprentissage par renforcement.
  // L'objectif est d'avoir une base extensible
  // vers un vrai réseau neuronal.

  const random =
    Math.random() - 0.5;

  mlWeights.random +=
    random * 0.001;

  mlWeights.random =
    Math.max(
      -1,
      Math.min(
        1,
        mlWeights.random
      )
    );

  localStorage.setItem(
    "chessML",
    JSON.stringify(mlWeights)
  );
}

function trainAI() {

  const button =
    document.getElementById("train");

  button.disabled = true;

  button.textContent =
    "🧠 Entraînement...";

  let games = 0;

  const interval =
    setInterval(() => {

      games++;

      mlWeights.center +=
        (Math.random()-0.5)*0.01;

      mlWeights.development +=
        (Math.random()-0.5)*0.01;

      if(games >= 100) {

        clearInterval(interval);

        localStorage.setItem(
          "chessML",
          JSON.stringify(mlWeights)
        );

        button.disabled = false;

        button.textContent =
          "🧠 Entraîner l'IA";

        document.getElementById("status").textContent =
          "🧠 IA entraînée avec 100 simulations !";
      }

    },10);
}

document
  .getElementById("train")
  .addEventListener(
    "click",
    trainAI
  );

let stats =
  JSON.parse(
    localStorage.getItem("chessStats")
  ) || {

    wins:0,
    losses:0,
    draws:0

  };

function updateStats(type) {

  stats[type + "s"]++;

  localStorage.setItem(
    "chessStats",
    JSON.stringify(stats)
  );

  loadStats();
}

function loadStats() {

  stats =
    JSON.parse(
      localStorage.getItem("chessStats")
    ) || {

      wins:0,
      losses:0,
      draws:0
    };

  document.getElementById("wins").textContent =
    stats.wins;

  document.getElementById("losses").textContent =
    stats.losses;

  document.getElementById("draws").textContent =
    stats.draws;
}
