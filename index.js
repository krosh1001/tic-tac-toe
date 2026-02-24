const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');
let field = []; 
let curPlayer = CROSS; 
let isGameOver = false; 
let dimension = 3;

startGame();
addResetListener();

function startGame () {
    const input = prompt("Введите размер поля:", "3");
    dimension = parseInt(input) || 3;
    
    field = [];
    for (let i = 0; i < dimension; i++) {
        field[i] = new Array(dimension).fill(EMPTY);
    }
    
    renderGrid(dimension);
}

function renderGrid (dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler (row, col) {
    if (field[row][col] !== EMPTY || isGameOver) {
        return;
    }

    field[row][col] = curPlayer;
    renderSymbolInCell(curPlayer, row, col);

    const winData = checkWinner(); 
    if (winData) {
        isGameOver = true;
        for (let coords of winData.cells) {
            renderSymbolInCell(winData.winner, coords[0], coords[1], 'red');
        }
        setTimeout(() => alert(`Победил ${winData.winner}!`), 50);
        return;
    }

    if (isFieldFull()) {
        alert('Победила дружба');
        isGameOver = true;
        return;
    }

    curPlayer = (curPlayer === CROSS) ? ZERO : CROSS;
}

function checkWinner() {
    for (let i = 0; i < dimension; i++) {
        if (field[i][0] !== EMPTY && field[i].every(cell => cell === field[i][0])) {
            let winCells = [];
            for (let j = 0; j < dimension; j++) winCells.push([i, j]);
            return { winner: field[i][0], cells: winCells };
        }
    }

    for (let j = 0; j < dimension; j++) {
        let column = [];
        for (let i = 0; i < dimension; i++) column.push(field[i][j]);
        
        if (column[0] !== EMPTY && column.every(cell => cell === column[0])) {
            let winCells = [];
            for (let i = 0; i < dimension; i++) winCells.push([i, j]);
            return { winner: column[0], cells: winCells };
        }
    }

    let diag1 = [];
    for (let i = 0; i < dimension; i++) diag1.push(field[i][i]);
    
    if (diag1[0] !== EMPTY && diag1.every(cell => cell === diag1[0])) {
        let winCells = [];
        for (let i = 0; i < dimension; i++) winCells.push([i, i]);
        return { winner: diag1[0], cells: winCells };
    }

    let diag2 = [];
    for (let i = 0; i < dimension; i++) diag2.push(field[i][dimension - 1 - i]);
    
    if (diag2[0] !== EMPTY && diag2.every(cell => cell === diag2[0])) {
        let winCells = [];
        for (let i = 0; i < dimension; i++) winCells.push([i, dimension - 1 - i]);
        return { winner: diag2[0], cells: winCells };
    }

    return null;
}

function isFieldFull() {
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (field[i][j] === EMPTY) {
                return false;
            }
        }
    }
    return true;
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);
    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell (row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    curPlayer = CROSS;
    isGameOver = false;
    startGame();
}

function clickOnCell (row, col) {
    const cell = findCell(row, col);
    if (cell) cell.click();
}