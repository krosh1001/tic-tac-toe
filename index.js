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
    
    renderGrid(dimension)
}

function renderGrid (dimension) {
    container.innerHTML = ''

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr')
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td')
            cell.textContent = EMPTY
            cell.addEventListener('click', () => cellClickHandler(i, j))
            row.appendChild(cell)
        }
        container.appendChild(row)
    }
}

function cellClickHandler (row, col) {
    if (field[row][col] !== EMPTY || isGameOver) {
        return
    }

    field[row][col] = curPlayer
    renderSymbolInCell(curPlayer, row, col)
    
    curPlayer = (curPlayer === CROSS) ? ZERO : CROSS

    console.log(`Clicked on cell: ${row}, ${col}`)
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col)

    targetCell.textContent = symbol
    targetCell.style.color = color
}

function findCell (row, col) {
    const targetRow = container.querySelectorAll('tr')[row]
    return targetRow.querySelectorAll('td')[col]
}

function addResetListener () {
    const resetButton = document.getElementById('reset')
    resetButton.addEventListener('click', resetClickHandler)
}

function resetClickHandler () {
    console.log('reset!')
    curPlayer = CROSS
    isGameOver = false
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

function clickOnCell (row, col) {
    findCell(row, col).click()
}

function cellClickHandler (row, col) {
    if (field[row][col] !== EMPTY || isGameOver) {
        return
    }

    field[row][col] = curPlayer
    renderSymbolInCell(curPlayer, row, col)

    if (isFieldFull()) {
        alert('Победила дружба')
        isGameOver = true
    }

    curPlayer = (curPlayer === CROSS) ? ZERO : CROSS

    console.log(`Clicked on cell: ${row}, ${col}`)
}

function isFieldFull() {
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (field[i][j] === EMPTY) {
                return false
            }
        }
    }
    return true
}
