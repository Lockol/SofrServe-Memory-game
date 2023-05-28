const cards = document.querySelectorAll(".memory-card");
let hasFlippedCard = false;
let boardLocked = false;
let firstCard, secondCard;
const hidden1 = document.querySelectorAll('div[data-value="cow-2"]');
const hidden2 = document.querySelectorAll('div[data-value="auto-1"]');

const easyModeButtons = document.querySelectorAll(".easy-mode");
easyModeButtons.forEach((easyModeButton) => {
  easyModeButton.addEventListener("click", () => {
    gameOverMessage.classList.add("hidden-text");
    winMessage.classList.add("hidden-text");
    cards.forEach((card) => {
      hidden1.forEach((div) => div.classList.add("hidden"));
      hidden2.forEach((div) => div.classList.add("hidden"));
      card.style.height = "calc(33.33%)";
    });

    resetStart();
    startTimer(25);
  });
});

// add logic for hard-mode button
const hardModeButtons = document.querySelectorAll(".hard-mode");
hardModeButtons.forEach((hardModeButton) => {
  hardModeButton.addEventListener("click", () => {
    gameOverMessage.classList.add("hidden-text");
    winMessage.classList.add("hidden-text");
    resetStart();
    // add new cards and change their sizes
    setTimeout(() => {
      cards.forEach((card) => {
        card.style.height = "calc(25%)";
        card.classList.remove("hidden");
      });
    }, 500);
    startTimer(10);
  });
});

const flipCard = (e) => {
  if (boardLocked) return;
  const target = e.target.parentElement;
  if (target === firstCard) return;
  target.classList.add("flip");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = target;
  } else {
    hasFlippedCard = false;
    secondCard = target;
    checkForMatch();
  }
  const audioPlayer = new AudioPlayer("flip");
  audioPlayer.playAudio();
};

const checkForMatch = () => {
  const isEqual = firstCard.dataset.value === secondCard.dataset.value;
  isEqual ? disableCards() : unflipCards();
};
//
const disableCards = () => {
  //disable cards if cards are equal
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  setTimeout(() => {
    //add green border if cards are equal
    firstCard.classList.add("playing");
    secondCard.classList.add("playing");
    //add sound effects if cards are equal
    const audioPlayer = new AudioPlayer("woohoo");
    audioPlayer.playAudio();
  }, 200);
};

// adding logic when cards are not equal add/remove shake and remove flip
const unflipCards = () => {
  boardLocked = true;
  setTimeout(() => {
    firstCard.querySelector(".front-face").classList.add("shake");
    secondCard.querySelector(".front-face").classList.add("shake");
  }, 200);

  setTimeout(() => {
    firstCard.querySelector(".front-face").classList.remove("shake");
    secondCard.querySelector(".front-face").classList.remove("shake");
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 1000);
};

// continue after a false result
const resetBoard = () => {
  hasFlippedCard = boardLocked = false;
  firstCard = secondCard = null;
};

const cardsRemovedPlaying = () => {
  cards.forEach((card) => {
    card.classList.remove("flip", "playing");
    card.addEventListener("click", flipCard);
  });
};

// CLASS METHODS for audio playback
class AudioPlayer {
  constructor(className) {
    this.audio = document.querySelector(`audio[class="${className}"]`);
  }

  playAudio() {
    if (!this.audio) return;
    this.audio.currentTime = 0;
    this.audio.play();
  }
}

function startGame() {
  resetBoard();
  cardsRemovedPlaying();
  shuffleCards();
}

const timerElement = document.getElementById("timer");
const gameOverMessage = document.getElementById("game-over-message");
const winMessage = document.getElementById("winner-message");
let timerInterval;

function startTimer(seconds) {
  clearInterval(timerInterval); // reload timer
  let remainingSeconds = seconds;
  // gameOverMessage.classList.add('hidden-text');

  timerInterval = setInterval(() => {
    remainingSeconds--;
    timerElement.textContent = remainingSeconds;
    const elements = document.querySelectorAll(".playing");

    // add new const for counting all playable cards
    const revealedCards = document.querySelectorAll(
      ".memory-card:not(.hidden)"
    );
    if (elements.length === revealedCards.length && remainingSeconds >= 0) {
      clearInterval(timerInterval);
      timerElement.textContent = remainingSeconds;
      playWinnerSound();
      winMessage.classList.remove("hidden-text");
      boardLocked = true;
    } else if (
      remainingSeconds <= 0 &&
      elements.length !== revealedCards.length
    ) {
      clearInterval(timerInterval);
      timerElement.textContent = 0;
      boardLocked = true;
      gameOverMessage.classList.remove("hidden-text");
      playGameOverSound();
    }
  }, 1000);
}

function playWinnerSound() {
  const audioPlayer = new AudioPlayer("winner");
  audioPlayer.playAudio();
}

function playGameOverSound() {
  const audioPlayer = new AudioPlayer("grustnyy-trombon");
  audioPlayer.playAudio();
}

const resetStart = () => {
  resetGame();
  setTimeout(() => {
    startGame();
  }, 200);
};

function resetGame() {
  cardsRemovedPlaying();
  boardLocked = false;
}

function shuffleCards() {
  cards.forEach((card) => {
    const randomIndex = Math.floor(Math.random() * cards.length);
    card.style.order = randomIndex;
  });
}

// Skins variables
class ImageClickHandler {
  constructor() {
    this.backFaces = document.querySelectorAll(".back-face");
    this.frontFaces = document.querySelectorAll(".front-face");
    this.surpriseImages = document.querySelectorAll(".surprise");
  }

  clickedSkin() {
    this.surpriseImages.forEach((surpriseImage) => {
      surpriseImage.addEventListener("click", () => {
        const clickedSrc = surpriseImage.src;
        this.backFaces.forEach((backFace) => {
          backFace.src = clickedSrc;
        });
      });
    });
  }
}

const imageClickHandler = new ImageClickHandler();
imageClickHandler.clickedSkin();
