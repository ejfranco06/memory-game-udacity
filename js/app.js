/**
 * Elements on the page
 *
 */
const deckElement = document.getElementsByClassName('deck')[0];
const movesElement = document.getElementsByClassName('moves')[0];
const modalElement = document.getElementsByClassName('modal-container')[0];
const starsElement = document.getElementsByClassName('stars')[0];
const timeElement = document.getElementsByClassName('time')[0];
const restartButton = document.getElementsByClassName('restart')[0];
const playAgainButton = document.getElementsByClassName('play-again-btn')[0];

/**
 * Game stats and statuses
 */
let timeController;
let gameStarted = false;
let matchedSets = 0;
let openCards = [];
let movesCounter = 0;
let time = 0;

const NUMBER_OF_STARS = 3;


/*
 * Create a list that holds all of your cards
 */
const cardList = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o',
  'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt',
  'fa-cube', 'fa-cube', 'fa-leaf', 'fa-leaf',
  'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'
];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/**
 * Populate the deck element with 16 cards facing down
 */
function populateGameBoard() {
  const randomList = shuffle(cardList);
  const fragment = document.createDocumentFragment();

  randomList.forEach((card) => {
    const newLiElement = document.createElement('li');
    newLiElement.classList.add('card');
    const newIElement = document.createElement('i');
    newIElement.classList.add('fa', card);
    newLiElement.appendChild(newIElement);
    fragment.appendChild(newLiElement);
  });
  deckElement.appendChild(fragment);

}

/**
 * Populate the score panel with stars
 */
function populateStarPanel() {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < NUMBER_OF_STARS; i++) {
    const newLiElement = document.createElement('li');
    const newIElement = document.createElement('i');
    newIElement.classList.add('fa', 'fa-star');
    newLiElement.appendChild(newIElement);
    fragment.appendChild(newLiElement);
  }
  starsElement.appendChild(fragment);
}

/**
 * Set up a new game
 */
function setupBoard() {
  populateGameBoard();
  populateStarPanel();
  movesElement.innerHTML = movesCounter.toString();
}

/**
 * Reset all stats and counter and start a new game
 */
function resetBoard() {
  movesCounter = 0;
  time = 0;
  matchedSets = 0;
  gameStarted = false;
  deckElement.innerHTML = '';
  starsElement.innerHTML = '';
  clearTimeout(timeController);
  timeElement.innerText = '00 :00';
  setupBoard();
}

/**
 * Flip a card form face down to face up and vice versa
 * @param card A card to flip
 */
function toggleCardDisplay(card) {
  card.classList.toggle('open');
  card.classList.toggle('show');
}

/**
 * Check if the two face up cards match
 * @returns {boolean} True if the match false otherwise
 */
function doCardsMatch() {
  const card1 = openCards[0];
  const card2 = openCards[1];
  return card1.firstElementChild.classList[1] === card2.firstElementChild.classList[1];
}

/**
 * Check if a card is face up
 * @param card A card to check
 * @returns {boolean} True if it's face up and false otherwise
 */
function isCardOpen(card) {
  return card.classList.contains('open');
}

/**
 * Set two matching cards to match
 */
function setCardsToMatch() {
  const card1 = openCards[0];
  const card2 = openCards[1];

  matchedSets++;

  card1.classList.add('match');
  card2.classList.add('match');
}

/**
 * Flip the two open cards face-down
 */
function hideCards() {
  const card1 = openCards[0];
  const card2 = openCards[1];
  card1.classList.toggle('mismatch');
  card2.classList.toggle('mismatch');

  setTimeout(() => {
    card1.classList.toggle('mismatch');
    card2.classList.toggle('mismatch');
    toggleCardDisplay(card1);
    toggleCardDisplay(card2);
  }, 800);

}

/**
 * Increase and update the score panel's moves element
 */
function increaseMovesCounter() {
  movesCounter++;
  movesElement.innerHTML = movesCounter.toString();
}

/**
 * Check and update how many stars the player currently deserves
 */
function evaluateStars() {
  if (movesCounter === 10 || movesCounter === 18)
    starsElement.removeChild(starsElement.children[0]);
}

/**
 * Format time to minutes and seconds
 * @param time The time in seconds
 * @returns {string} A time in 00:00 format
 */
function timeFormat(time) {
  let minutes = Math.floor(time / 60).toString().padStart(2, '0');
  let seconds = (time % 60).toString().padStart(2, '0');

  return `${minutes} : ${seconds}`;
}

/**
 * Update the current time played
 */
function updateTime() {
  timeElement.innerText = timeFormat(time);
  time++;

  timeController = setTimeout(updateTime, 1000);
}

/**
 * Gather final game statistic and populate the modal
 */
function populateScoreModal() {
  const timePlayed = document.getElementsByClassName('time-played')[0];
  const starRating = document.getElementsByClassName('star-rating')[0];
  const movesMade = document.getElementsByClassName('moves-made')[0];

  timePlayed.innerText = 'time played: ' + timeFormat(time);
  starRating.innerText = 'star rating: ' + document.getElementsByClassName('stars')[0].childElementCount.toString() + ' ★';
  movesMade.innerText = 'moves made: ' + movesCounter;
}

/**
 * Show or hide modal
 */
function toggleModal() {
  modalElement.classList.toggle("show-modal");
}

/**
 * Check if click target is a valid card
 * @param card Card to confirm
 * @returns {boolean} True if it's a valid card false otherwise
 */
function isValidCard(card) {
  return card.tagName === 'LI' &&
    !isCardOpen(card) &&
    openCards.length < 2
}

/**
 * Add a card to the open cards list
 * @param card A card to enter
 */
function addOpenCard(card) {
  if (!openCards.includes(card)) {
    openCards.push(card);
  }
}

/**
 * Check is the two open cards match
 */
function checkCardsMatch() {
  if (doCardsMatch()) {
    setCardsToMatch();
    checkWinningCondition();
  } else {
    hideCards();
  }
  openCards = [];
}

/**
 * Check is the player has matched all sets of cards
 */
function checkWinningCondition() {
  if (matchedSets === 8) {
    clearTimeout(timeController);
    populateScoreModal();
    toggleModal();
  }
}

/**
 * Listen for a click on a card element and flip a card
 */
deckElement.addEventListener('click', (event) => {
  let card = event.target;
  if (!gameStarted) {
    updateTime();
    gameStarted = true;
  }

  if (isValidCard(card)) {
    toggleCardDisplay(card);
    addOpenCard(card);
  }

  if (openCards.length === 2) {
    evaluateStars();
    increaseMovesCounter();
    checkCardsMatch();
  }

});

/**
 * Listen for the restart button and reset the game
 */
restartButton.addEventListener('click', resetBoard);

/**
 * Listen for the play again button and start a new game
 */
playAgainButton.addEventListener('click', () => {
  toggleModal();
  resetBoard();
});

setupBoard();
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
