const CROSS = 'X'
const ZERO = 'O'
const EMPTY = ' '

const container = document.getElementById('fieldWrapper')
let field = []; 
let curPlayer = CROSS; 
let isGameOver = false; 
let dimension = 3

startGame()
addResetListener()

function startGame () {
    const input = prompt("Введите размер поля:", "3")
    dimension = parseInt(input) || 3
    
    field = []
    for (let i = 0; i < dimension; i++) {
        field[i] = new Array(dimension).fill(EMPTY)
    }
    
    isGameOver = false
    curPlayer = CROSS
    renderGrid(dimension)
}

function renderGrid (dimension) {
    container.innerHTML = ''
    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr')
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td')
            cell.textContent = field[i][j] === EMPTY ? '' : field[i][j]
            cell.addEventListener('click', () => cellClickHandler(i, j))
            row.appendChild(cell)
        }
        container.appendChild(row)
    }
}

function cellClickHandler (row, col) {
    if (field[row][col] !== EMPTY || isGameOver) return

    executeMove(row, col)

    
    if (!isGameOver && curPlayer === ZERO) {
        setTimeout(aiMove, 200); 
    }
}

function executeMove(row, col) {
    field[row][col] = curPlayer
    renderSymbolInCell(curPlayer, row, col)

    const winData = checkWinner(); 
    if (winData) {
        isGameOver = true
        for (let coords of winData.cells) {
            renderSymbolInCell(winData.winner, coords[0], coords[1], 'red')
        }
        setTimeout(() => alert(`Победил ${winData.winner}!`), 50)
        return
    }

    if (isFieldFull()) {
        alert('Победила дружба')
        isGameOver = true
        return
    }

    if (countFilledCells() > (dimension * dimension) / 2) {
        expandField()
    }

    curPlayer = (curPlayer === CROSS) ? ZERO : CROSS
}

function aiMove() {
    let move = findWinningMove(ZERO)

    if (!move) {
        const emptyCells = []
        for (let r = 0; r < dimension; r++) {
            for (let c = 0; c < dimension; c++) {
                if (field[r][c] === EMPTY) emptyCells.push({r, c})
            }
        }
        if (emptyCells.length > 0) {
            move = emptyCells[Math.floor(Math.random() * emptyCells.length)]
        }
    }

    if (move) {
        executeMove(move.r, move.c)
    }
}

function findWinningMove(playerSymbol) {
    for (let r = 0; r < dimension; r++) {
        for (let c = 0; c < dimension; c++) {
            if (field[r][c] === EMPTY) {
                field[r][c] = playerSymbol
                const win = checkWinner()
                field[r][c] = EMPTY
                if (win) return {r, c}
            }
        }
    }
    return null
}


function expandField() {
    const newDim = dimension + 2
    const newField = []
    
    for (let i = 0; i < newDim; i++) {
        newField[i] = new Array(newDim).fill(EMPTY)
    }

    
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            newField[i + 1][j + 1] = field[i][j]
        }
    }

    field = newField
    dimension = newDim
    renderGrid(dimension)
}

function countFilledCells() {
    let count = 0
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (field[i][j] !== EMPTY) count++
        }
    }
    return count
}


function checkWinner() {
    for (let i = 0; i < dimension; i++) {
        if (field[i][0] !== EMPTY && field[i].every(cell => cell === field[i][0])) {
            let winCells = []
            for (let j = 0; j < dimension; j++) winCells.push([i, j])
            return { winner: field[i][0], cells: winCells }
        }
    }
    for (let j = 0; j < dimension; j++) {
        let column = []
        for (let i = 0; i < dimension; i++) column.push(field[i][j])
        if (column[0] !== EMPTY && column.every(cell => cell === column[0])) {
            let winCells = []
            for (let i = 0; i < dimension; i++) winCells.push([i, j])
            return { winner: column[0], cells: winCells }
        }
    }
    let diag1 = []
    for (let i = 0; i < dimension; i++) diag1.push(field[i][i])
    if (diag1[0] !== EMPTY && diag1.every(cell => cell === diag1[0])) {
        let winCells = []
        for (let i = 0; i < dimension; i++) winCells.push([i, i])
        return { winner: diag1[0], cells: winCells }
    }
    let diag2 = []
    for (let i = 0; i < dimension; i++) diag2.push(field[i][dimension - 1 - i])
    if (diag2[0] !== EMPTY && diag2.every(cell => cell === diag2[0])) {
        let winCells = []
        for (let i = 0; i < dimension; i++) winCells.push([i, dimension - 1 - i])
        return { winner: diag2[0], cells: winCells }
    }
    return null
}

function isFieldFull() {
    return countFilledCells() === dimension * dimension
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col)
    if (targetCell) {
        targetCell.textContent = symbol
        targetCell.style.color = color
    }
}

function findCell (row, col) {
    const rows = container.querySelectorAll('tr')
    if (!rows[row]) return null
    return rows[row].querySelectorAll('td')[col]
}

function addResetListener () {
    const resetButton = document.getElementById('reset')
    resetButton.addEventListener('click', resetClickHandler)
}

function resetClickHandler () {
    startGame()
}

function testWin () {
    clickOnCell(0, 2)
    clickOnCell(0, 0)
    clickOnCell(2, 0)
    clickOnCell(1, 1)
    clickOnCell(2, 2)
    clickOnCell(1, 2)
    clickOnCell(2, 1)
}

function testDraw () {
    clickOnCell(2, 0)
    clickOnCell(1, 0)
    clickOnCell(1, 1)
    clickOnCell(0, 0)
    clickOnCell(1, 2)
    clickOnCell(1, 2)
    clickOnCell(0, 2)
    clickOnCell(0, 1)
    clickOnCell(2, 1)
    clickOnCell(2, 2)
}
