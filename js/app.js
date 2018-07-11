const deck = document.getElementsByClassName('deck')[0];
let openCards = [];
const movesElement = document.getElementsByClassName('moves')[0];
let movesCounter = 0;
const restartButton = document.getElementsByClassName('restart')[0];
const starsList = document.getElementsByClassName('stars')[0];
let mismatchCounter = 0;
const stars = document.getElementsByClassName('stars')[0];
const NUMBER_OF_STARS = 3;
let timeView = document.getElementById('time');
let time = 0;
let timeController;
let gameStarted = false;


/*
 * Create a list that holds all of your cards
 */
const cardList = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o',
  'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt',
  'fa-cube', 'fa-cube', 'fa-leaf', 'fa-leaf',
  'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function setupBoard() {
  const randomList = shuffle(cardList);
  let fragment = document.createDocumentFragment();

  randomList.forEach((card) => {
    const newLiElement = document.createElement('li');
    newLiElement.classList.add('card');
    const newIElement = document.createElement('i');
    newIElement.classList.add('fa', card);
    newLiElement.appendChild(newIElement);
    fragment.appendChild(newLiElement);
  });
  deck.appendChild(fragment);

  fragment = document.createDocumentFragment();
  for(let i = 0; i < NUMBER_OF_STARS; i ++) {
    const newLiElement = document.createElement('li');
    const newIElement = document.createElement('i');
    newIElement.classList.add('fa', 'fa-star');
    newLiElement.appendChild(newIElement);
    fragment.appendChild(newLiElement);
  }
  stars.appendChild(fragment);
  movesElement.innerHTML = movesCounter.toString();
}
function toggleCardDisplay(card) {
  card.classList.toggle('open');
  card.classList.toggle('show');
}

function doCardsMatch(card1, card2) {
  return card1.firstElementChild.classList[1] === card2.firstElementChild.classList[1];
}
function isCardOpen(card) {
  return card.classList.contains('open');
}

function setCardsToMatch(cards){
  cards[0].classList.remove('open');
  cards[0].classList.add('match');

  cards[1].classList.remove('open');
  cards[1].classList.add('match');
}

function hideCards(cards) {
  toggleCardDisplay(cards[0]);
  toggleCardDisplay(cards[1]);
}
function increaseMovesCounter() {
  movesCounter++;
  movesElement.innerHTML = movesCounter.toString();
}

function evaluateStars() {
    if(mismatchCounter === 5 || mismatchCounter === 10)
      starsList.removeChild(starsList.children[0]);
}

function timeFormat(time) {
  let minutes = Math.floor(time / 60).toString().padStart(2, '0');
  let seconds = (time % 60).toString().padStart(2, '0');

  return `${minutes} : ${seconds}`;
}
function updateTime() {
  timeView.innerText = timeFormat(time);
  time++;

  timeController = setTimeout(updateTime, 1000);
}



deck.addEventListener('click', (event) => {
  let card = event.target;
  if(!gameStarted) {
      updateTime();
      gameStarted = true;
  }

  if(card.tagName !== 'LI'){
    console.log('found an error' + card.tagName);
    return;
  }
  if(!isCardOpen(card) && openCards.length < 2) {
    toggleCardDisplay(card);
    openCards.push(card);
  }
  if(openCards.length === 2) {
     window.setTimeout(() => {
       increaseMovesCounter();
       if(doCardsMatch(openCards[0], openCards[1])) {
         setCardsToMatch(openCards)
       } else {
         mismatchCounter++;
         evaluateStars();
         hideCards(openCards);
       }
       openCards = [];
     } , 800);
  }
});

restartButton.addEventListener('click', () =>{
  movesCounter = 0;
  deck.innerHTML = '';
  stars.innerHTML = '';
  clearTimeout(timeController);
  timeView.innerText= '00 :00';
  gameStarted = false;
  time = 0;
  setupBoard();
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
