const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 9, 13],
    [3, 6,, 9, 12]   
];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const showGameButton = document.getElementById('showGameButton');
const takeOverButton = document.getElementById('takeOverButton');
const mainMenuButton = document.getElementById('mainMenuButton');
const undoButton = document.getElementById('undoButton');
const doubleTurnButton = document.getElementById('powerUpButton');
const removeMarkButton = document.getElementById('removeMarkButton');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const losingMessageTextElement = document.querySelector('[data-losing-message-text]');
const peaceMessageTextElement = document.querySelector('[data-peace-message-text]');
const spiritRaisingTextElement = document.querySelector('[data-spirit-raising-text]');
let lastMarkPlaced = null;
let isCircleTurn = false;
let isGameEnd = false;
let isExtraTurn = false;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    setCircleTurnTo(false);
    cellElements.forEach(cell => {
        resetCell(cell);
      });
    winningMessageElement.classList.remove('show');
    undoButton.classList.add('show');
    doubleTurnButton.classList.add("show");
    removeMarkButton.classList.add("show");
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
        } else if (isExtraTurn) {
            isExtraTurn = false;
        } else {
            swapTurns();
        }
    }
}

removeMarkButton.addEventListener('click', removeMark)

function removeMark() {
   resetCell(lastMarkPlaced);
   removeMarkButton.classList.remove("show")
}

showGameButton.addEventListener('click', showGame);

function showGame() {
    winningMessageElement.classList.remove('show');   
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
        spiritRaisingTextElement.innerText = ('Everything is awesome!')
        showGameButton.innerText = ('Show game')
        takeOverButton.classList.add("show");
        restartButton.classList.add("show")
        undoButton.classList.remove("show")
        doubleTurnButton.classList.remove("show")
        removeMarkButton.classList.remove("show")
    } else if (isDraw()) {
        winningMessageTextElement.innerText = ('Draw!');
        losingMessageTextElement.innerText = ('');
        peaceMessageTextElement.innerText = ('Peace');
        spiritRaisingTextElement.innerText = ('Everything is awesome!')
        showGameButton.innerText = ('Show game')
        restartButton.classList.add("show")
        undoButton.classList.remove("show")
        doubleTurnButton.classList.remove("show")
        removeMarkButton.classList.remove("show")
    } else if (gameInProgress()) {
        winningMessageTextElement.innerText = ('Game still in progress')
        losingMessageTextElement.innerText = ('')
        peaceMessageTextElement.innerText = ('Peace')
        spiritRaisingTextElement.innerText = ('Everything is awesome!')
        showGameButton.innerText = ('Keep on playing')
        restartButton.classList.remove("show")
        undoButton.classList.add("show")
        removeMarkButton.classList.add("show")
    } else {
        winningMessageTextElement.innerText = ('Game started')
        losingMessageTextElement.innerText = ('')
        peaceMessageTextElement.innerText = ('Peace')
        spiritRaisingTextElement.innerText = ('Everything is awesome!')
        takeOverButton.classList.remove("show")
        showGameButton.innerText = ('Keep on playing')
        restartButton.classList.remove("show")
        undoButton.classList.add("show")
        removeMarkButton.classList.add("show")
    }
}

doubleTurnButton.addEventListener('click', doubleTurn)

function doubleTurn() {
    isExtraTurn = true;
    doubleTurnButton.classList.remove("show")
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
    doubleTurnButton.classList.add("show")
    removeMarkButton.classList.add("show")
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