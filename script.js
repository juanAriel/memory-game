let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moveCounter = 0;
let timerSeconds = 0;
let timerInterval = null;
let totalSeconds = 0;
let hasGameStarted = false;
let errorCount = 0;

const images = [
  "images/image1.png",
  "images/image2.png",
  "images/image3.png",
  "images/image4.png",
];
const board = document.getElementById("game-board");
const moveDisplay = document.getElementById("move-counter");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const bestScoreDisplay = document.getElementById("best-score");
const errorDisplay = document.getElementById("move-falied");
function createCards() {
  cards = [];

  images.forEach((img, index) => {
    const card1 = {
      id: index * 2,
      image: img,
      flipped: false,
      matched: false,
    };
    const card2 = {
      id: index * 2 + 1,
      image: img,
      flipped: false,
      matched: false,
    };
    cards.push(card1, card2);
  });

  cards.sort(() => 0.5 - Math.random());

  renderBoard();
  showCards();
}

function renderBoard() {
  board.innerHTML = "";

  cards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.index = index;

    if (card.flipped || card.machetd) {
      cardElement.style.backgroundImage = `url(${card.image})`;
      cardElement.style.backgroundSize = "cover";
    } else {
      cardElement.style.backgroundImage = "";
      cardElement.textContent = "";
    }

    cardElement.addEventListener("click", handleCardClick);
    board.appendChild(cardElement);
  });

  VanillaTilt.init(document.querySelectorAll(".card"), {
    max: 15,
    speed: 400,
    scale: 1.05,
    glare: true,
    "max-glare": 0.3,
  });
}

function handleCardClick(event) {
  if (!hasGameStarted) {
    hasGameStarted = true;
    startTime();
  }

  const index = event.currentTarget.dataset.index;
  const card = cards[index];

  if (card.flipped || card.matched || flippedCards.length === 2) {
    return;
  }

  card.flipped = true;
  flippedCards.push(card);
  renderBoard();

  if (flippedCards.length === 2) {
    moveCounter++;
    moveDisplay.textContent = `Movimientos: ${moveCounter}`;

    if (flippedCards[0].image === flippedCards[1].image) {
      flippedCards[0].matched = true;
      flippedCards[1].matched = true;
      matchedPairs++;
      flippedCards = [];
      updateScore();
    } else {
      errorCount++;
      errorDisplay.textContent = errorCount;
      setTimeout(() => {
        flippedCards[0].flipped = false;
        flippedCards[1].flipped = false;
        flippedCards = [];
        renderBoard();
      }, 1000);
    }
  }
}

function updateScore() {
  scoreDisplay.textContent = `Puntuación: ${matchedPairs}`;

  if (matchedPairs === images.length) {
    setTimeout(() => {
      alert("¡Felicidades, encontraste todos los pares!");
      saveBestScoreIfNeeded();
    }, 100);
  }
}

function resetGame() {
  matchedPairs = 0;
  moveCounter = 0;
  errorCount = 0;
  errorDisplay.textContent = errorCount;
  moveDisplay.textContent = "Movimientos: 0";
  scoreDisplay.textContent = "Puntuación: 0";
  flippedCards = [];
  createCards();

  clearInterval(timerInterval);
  totalSeconds = 0;
  timerDisplay.textContent = "00:00";
  hasGameStarted = false;
}

function startTime() {
  totalSeconds = 0;

  timerInterval = setInterval(() => {
    totalSeconds++;

    const minutes = Math.floor(totalSeconds / 60);
    const seceonds = totalSeconds % 60;

    const formatTime =
      String(minutes).padStart(2, "0") +
      ":" +
      String(seceonds).padStart(2, "0");

    timerDisplay.textContent = formatTime;
  }, 1000);
}

/*function to show cards for three seconds on startup*/
function showCards() {
  const cardsElements = document.querySelectorAll(".card");

  cardsElements.forEach((cardEl) => {
    const index = cardEl.dataset.index;
    const card = cards[index];
    card.flipped = true;
  });

  renderBoard();

  setTimeout(() => {
    cardsElements.forEach((cardEl) => {
      const index = cardEl.dataset.index;
      const card = cards[index];
      card.flipped = false;
    });

    renderBoard();
  }, 3000);
}

/** funcition to storage best score in local storage*/
function bestScore() {
  const bestScore = JSON.parse(localStorage.getItem("bestScore"));

  if (bestScore) {
    bestScoreDisplay.textContent = `🏆 Mejor: ${bestScore.moves} movimientos, ${bestScore.time}`;
  } else {
    bestScoreDisplay.textContent = `🏆 Mejor: -- movimientos, --:--`;
  }
}
/**funtion for save best score */
function saveBestScoreIfNeeded() {
  const currentTime = timerDisplay.textContent;
  const currentMoves = moveCounter;

  const previous = JSON.parse(localStorage.getItem("bestScore"));

  let isBetter = false;

  if (!previous) {
    isBetter = true;
  } else {
    if (currentMoves < previous.moves) {
      isBetter = true;
    } else if (currentMoves === previous.moves && currentTime < previous.time) {
      isBetter = true;
    }
  }

  if (isBetter) {
    const newBest = {
      moves: currentMoves,
      time: currentTime,
    };
    localStorage.setItem("bestScore", JSON.stringify(newBest));
    bestScoreDisplay.textContent = `🏆 Mejor: ${newBest.moves} movimientos, ${newBest.time}`;
  }
}

/**mode dark */
document.getElementById("toggle-modo").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "ligth");
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
});

document.getElementById("new-game").addEventListener("click", resetGame);
document.getElementById("reset-game").addEventListener("click", resetGame);

createCards();
