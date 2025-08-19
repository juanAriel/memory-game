let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moveCounter = 0;
let timerSeconds = 0;
let timerInterval = null;
let totalSeconds = 0;
let hasGameStarted = false;

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
    }, 100);
  }
}

function resetGame() {
  matchedPairs = 0;
  moveCounter = 0;
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

  // Mostrar todas las cartas
  cardsElements.forEach((cardEl) => {
    const index = cardEl.dataset.index;
    const card = cards[index];
    card.flipped = true;
  });

  renderBoard();

  // Esperar 3 segundos y luego ocultarlas
  setTimeout(() => {
    cardsElements.forEach((cardEl) => {
      const index = cardEl.dataset.index;
      const card = cards[index];
      card.flipped = false;
    });

    renderBoard();
  }, 3000);
}

document.getElementById("new-game").addEventListener("click", resetGame);
document.getElementById("reset-game").addEventListener("click", resetGame);

createCards();
