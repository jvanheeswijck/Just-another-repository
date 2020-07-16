const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20]   
];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const showGameButton = document.getElementById('showGameButton');
const takeOverButton = document.getElementById('takeOverButton');
const mainMenuButton = document.getElementById('mainMenuButton');
const undoButton = document.getElementById('undoButton')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const losingMessageTextElement = document.querySelector('[data-losing-message-text]');
const peaceMessageTextElement = document.querySelector('[data-peace-message-text]');
let lastMarkPlaced = null;
let isCircleTurn = false;
let isGameEnd = false;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    setCircleTurnTo(false);
    cellElements.forEach(cell => {
        resetCell(cell);
      });
    winningMessageElement.classList.remove('show');
    undoButton.classList.add('show')
    isGameEnd = false;
    lastMarkPlaced = null;
}

function resetCell(cell) {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, {once: true});
}

function handleClick(e) {
    if (!isGameEnd) {
        const cell = e.target;
        const currentClass = isCircleTurn ? CIRCLE_CLASS : X_CLASS;
        placeMark(cell, currentClass);
        if (checkWin(currentClass)) {
            endGame();
        } else if (isDraw()) { 
            endGame();
        } else {
            swapTurns();
        }
    }
}

showGameButton.addEventListener('click', showGame);

function showGame() {
    winningMessageElement.classList.remove('show')   
}

 
function endGame() {
    showEndGameScreen();
    stopPlayerPlaying();
}

mainMenuButton.addEventListener('click', showEndGameScreen)

function showEndGameScreen() {
    setMainMenuElements();
    showMainMenu();
}

function showMainMenu() {
    winningMessageElement.classList.add("show");
}

function setMainMenuElements() {
    const currentClass = isCircleTurn ? CIRCLE_CLASS : X_CLASS;
    if (checkWin(currentClass)) {
        winningMessageTextElement.innerText = `${isCircleTurn ? "D's" : "X's"} Wins!`;
        losingMessageTextElement.innerText = `${isCircleTurn ? "X's" : "D's"} Loses!`;
        peaceMessageTextElement.innerText = ('Peace');
        takeOverButton.classList.add("show");
        restartButton.classList.add("show")
        undoButton.classList.remove("show")
    } else if (isDraw()) {
        winningMessageTextElement.innerText = ('Draw!');
        losingMessageTextElement.innerText = ('');
        peaceMessageTextElement.innerText = ('Peace');
        restartButton.classList.add("show")
        undoButton.classList.remove("show")
    } else if (gameInProgress()) {
        winningMessageTextElement.innerText = ('Game still in progress')
        losingMessageTextElement.innerText = ('')
        peaceMessageTextElement.innerText = ('Peace')
        restartButton.classList.remove("show")
        undoButton.classList.add("show")
    } else {
        winningMessageTextElement.innerText = ('Game started')
        losingMessageTextElement.innerText = ('')
        peaceMessageTextElement.innerText = ('Peace')
        takeOverButton.classList.remove("show")
        restartButton.classList.remove("show")
        undoButton.classList.add("show")
    }
}

function gameInProgress() {
    return [...cellElements].some(cell => {
        return cell.classList.contains(X_CLASS)
          ||  cell.classList.contains(CIRCLE_CLASS);
    })
}

undoButton.addEventListener('click', undoTurn)

function undoTurn() {
    resetCell(lastMarkPlaced);
    swapTurns();
}

takeOverButton.addEventListener('click', takeOverBoard)

function takeOverBoard() {
    if(!isCircleTurn) {
    cellElements.forEach( cell => {
        cell.classList.add(X_CLASS)
        cell.classList.remove(CIRCLE_CLASS)
      }) 
    } else {
        cellElements.forEach(cell=> {
            cell.classList.add(CIRCLE_CLASS)
            cell.classList.remove(X_CLASS)
        })
    }
}
function stopPlayerPlaying() {
    removeBoardHoverClasses();
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
    lastMarkPlaced = cell;
}

function setCircleTurnTo(shouldBeCircleTurn) {
    isCircleTurn = shouldBeCircleTurn;
    setBoardHoverClass();
}

function swapTurns() {
    setCircleTurnTo(!isCircleTurn);
}

function setBoardHoverClass() {
    removeBoardHoverClasses();
    if (isCircleTurn) {
        board.classList.add(CIRCLE_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function removeBoardHoverClasses() {
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);  
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
      return combination.every(index => {
        return cellElements[index].classList.contains(currentClass); 
      });
    });
}