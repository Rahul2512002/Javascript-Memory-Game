const cardsArray = [
    { name: 'A', img: 'A' },
    { name: 'B', img: 'B' },
    { name: 'C', img: 'C' },
    { name: 'D', img: 'D' },
    { name: 'E', img: 'E' },
    { name: 'F', img: 'F' },
    { name: 'G', img: 'G' },
    { name: 'H', img: 'H' }
];

const gameContainer = document.querySelector('.memory-game');
const timerElement = document.getElementById('timer');
const movesElement = document.getElementById('moves');
const restartBtn = document.getElementById('restart-btn');

let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matches = 0;
let startTime;
let timerInterval;

function shuffleCards() {
    const doubledCardsArray = [...cardsArray, ...cardsArray]; // Duplicate array to get pairs
    doubledCardsArray.sort(() => 0.5 - Math.random()); // Shuffle cards
    return doubledCardsArray;
}

function createBoard() {
    const shuffledCards = shuffleCards();
    shuffledCards.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.name = item.name;
        
        card.innerHTML = `
            <div class="front-face">${item.img}</div>
            <div class="back-face"></div>
        `;
        
        gameContainer.appendChild(card);
    });
    
    cards = document.querySelectorAll('.memory-card');
    cards.forEach(card => card.addEventListener('click', flipCard));
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    
    this.classList.add('flip');
    
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
    
    updateMoves();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    resetBoard();
    matches++;
    if (matches === cardsArray.length) {
        endGame();
    }
}

function unflipCards() {
    lockBoard = true;
    
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function updateMoves() {
    moves++;
    movesElement.textContent = moves;
}

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(() => {
        const elapsedTime = new Date(new Date() - startTime);
        const minutes = elapsedTime.getUTCMinutes();
        const seconds = elapsedTime.getUTCSeconds();
        timerElement.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function endGame() {
    stopTimer();
    alert(`Congratulations! You completed the game in ${moves} moves and ${timerElement.textContent} time.`);
}

function restartGame() {
    gameContainer.innerHTML = '';
    moves = 0;
    matches = 0;
    movesElement.textContent = moves;
    timerElement.textContent = '00:00';
    stopTimer();
    createBoard();
    startTimer();
}

restartBtn.addEventListener('click', restartGame);

// Initialize game on load
createBoard();
startTimer();
