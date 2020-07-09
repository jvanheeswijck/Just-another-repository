const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]   
];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const showGameButton = document.getElementById('showGameButton');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const losingMessageTextElement = document.querySelector('[data-losing-message-text]');
let isCircleTurn = false;
let isGameEnd = false;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    setCircleTurnTo(false);
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, {once: true});
      });
    winningMessageElement.classList.remove('show');
    isGameEnd = false;
}

function handleClick(e) {
    if (!isGameEnd) {
        const cell = e.target;
        const currentClass = isCircleTurn ? CIRCLE_CLASS : X_CLASS;
        placeMark(cell, currentClass);
        if (checkWin(currentClass)) {
            endGame(false);
        } else if (isDraw()) { 
            endGame(true);
        } else {
            swapTurns();
        }
    }
}

showGameButton.addEventListener('click', showGame);

function showGame() { 
    winningMessageElement.classList.remove('show')   
}

 
function endGame(draw) {
    showEndGameScreen(draw);
    stopPlayerPlaying();
}

function showEndGameScreen(draw) {
    if (draw) {
        winningMessageTextElement.innerText = ('Draw!');
        losingMessageTextElement.innerText = ('');
    } else {
        winningMessageTextElement.innerText = `${isCircleTurn ? "D's" : "X's"} Wins!`;
        losingMessageTextElement.innerText = `${isCircleTurn ? "X's" : "D's"} Loses!`;
    }
    winningMessageElement.classList.add("show");
}

function stopPlayerPlaying() {
    //Prevent hover effect
    isGameEnd = true;
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS)
          ||  cell.classList.contains(CIRCLE_CLASS);
    })
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function setCircleTurnTo(shouldBeCircleTurn) {
    isCircleTurn = shouldBeCircleTurn;
    setBoardHoverClass();
}

function swapTurns() {
    setCircleTurnTo(!isCircleTurn);
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if (isCircleTurn) {
      board.classList.add(CIRCLE_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
      return combination.every(index => {
        return cellElements[index].classList.contains(currentClass); 
      });
    });
}