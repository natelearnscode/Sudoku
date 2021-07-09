import Board from './board';
import Solver from './solver';
import Settings from './settings';

export default class Game {
    /* Public */

    constructor() {
        this.table = null;
        this.gameBoard = new Board();
        this.sudokuSolver = new Solver();
        this.settings = new Settings();
        this.initialBoard = null;
        this.finishedGrid = null;
    }

    startGame() {
        this.initializeGame();
    }

    newBoard() {
        // first delete the old board
        for (let i = 0; i < 9; i++) {
            this.table.deleteRow(0);
        }
        this.initializeGame();
    }

    reset() {
        // first delete the old board
        for (let i = 0; i < 9; i++) {
            this.table.deleteRow(0);
        }

        this.gameBoard.setData(this.initialBoard);
        // create sudoku grid in table
        for (let i = 0; i < 9; i++) {
            const row = this.table.insertRow();
            for (let j = 0; j < 9; j++) {
                const cell = row.insertCell();
                if (this.initialBoard[i][j] === 0) {
                    cell.innerHTML = '&nbsp';
                } else {
                    cell.innerHTML = this.initialBoard[i][j].toString();
                }
                cell.onclick = this.changeActiveCell.bind(this);
            }
        }
    }

    erase() {
        this.deleteCellValue();
    }

    updateCell(value) {
        this.updateCellValue(value);
    }

    checkSolution() {
        // Clear board colors

        let solved = true;
        const data = this.gameBoard.getData();
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = this.table.rows[i].cells[j];
                cell.style.background = this.settings.BACKGROUND_COLOR;
                if (this.initialBoard[i][j] === 0) {
                    // player input value
                    if (data[i][j] !== this.finishedGrid[i][j]) {
                        cell.style.background = this.settings.INCORRECT_COLOR;
                        solved = false;
                    } else {
                        cell.style.background = this.settings.CORRECT_COLOR;
                    }
                }
            }
        }

        if (solved) {
            alert('Correct solution!');
        } else {
            alert('Incorrect solution!');
        }
    }

    // eslint-disable-next-line class-methods-use-this
    closeSettings() {
        // get difficulty settings
        const difficultyRadios = document.getElementsByName('difficulty');
        for (let i = 0; i < difficultyRadios.length; i++) {
            if (i === this.settings.difficulty) {
                difficultyRadios[i].checked = true;
            } else {
                difficultyRadios[i].checked = false;
            }
        }

        // get show incorrect values settings
        const showIncorrectValuesCheckBox = document.getElementById('showIncorrectValues');
        showIncorrectValuesCheckBox.checked = this.settings.showIncorrectValues;
    }

    changeSettings() {
        // get difficulty settings
        const difficultyRadios = document.getElementsByName('difficulty');
        for (let i = 0; i < difficultyRadios.length; i++) {
            if (difficultyRadios[i].checked) {
                this.settings.difficulty = i;
            }
        }

        // get show incorrect values settings
        const showIncorrectValuesCheckBox = document.getElementById('showIncorrectValues');
        this.settings.showIncorrectValues = showIncorrectValuesCheckBox.checked;
        // color previous incorrect inputs
        const data = this.gameBoard.getData();
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (
                    this.initialBoard[i][j] === 0
                    && this.finishedGrid[i][j] !== data[i][j]) {
                    this.table.rows[i].cells[j].style.color = this.settings.showIncorrectValues
                        ? this.settings.INCORRECT_INPUT_VALUE_COLOR
                        : this.settings.INPUT_VALUE_COLOR;
                }
            }
        }
    }

    initializeGame() {
        this.table = document.getElementById('sudoku-table');

        // generate game board
        this.initialBoard = this.generateSudokuBoard();
        this.gameBoard.setData(this.initialBoard);
        // create sudoku grid in table

        // First check if touch is supported, otherwise use click:
        const touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';
        for (let i = 0; i < 9; i++) {
            const row = this.table.insertRow();
            for (let j = 0; j < 9; j++) {
                const cell = row.insertCell();
                if (this.initialBoard[i][j] === 0) {
                    cell.innerHTML = '&nbsp';
                } else {
                    cell.innerHTML = this.initialBoard[i][j].toString();
                }
                // cell.onclick = this.changeActiveCell.bind(this);
                cell.addEventListener(touchEvent, this.changeActiveCell.bind(this));
            }
        }

        // initialize key event listener
        document.addEventListener('keydown', this.handleInput.bind(this));
    }

    generateSudokuBoard() {
        // 0 represents an empty space
        const emptyBoard = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];

        this.finishedGrid = this.sudokuSolver.solveEmptyBoard(emptyBoard, 0, 0);
        const grid = this.finishedGrid.map((inner) => inner.slice(0));

        // Remove cells from the finish grid as long as there is still only one solution
        let numRemovedCells = this.settings.getNumberOfInitialEmptyCells();
        while (numRemovedCells > 0) {
            // Pick random row and column indices
            const rowIndex = Math.floor(Math.random() * 9);
            const columnIndex = Math.floor(Math.random() * 9);

            if (grid[rowIndex][columnIndex] === 0) {
                // already changed this to an empty cell
                // eslint-disable-next-line no-continue
                continue;
            }

            // copy grid, remove cell, and find solutions
            const gridCopy = grid.map((inner) => inner.slice(0));
            gridCopy[rowIndex][columnIndex] = 0;
            const solutions = [[[]]];
            this.sudokuSolver.solve(gridCopy, 0, 0, solutions);
            if (solutions.length === 2) {
                // only found one solution not including the empty array
                grid[rowIndex][columnIndex] = 0;
                numRemovedCells--;
                // eslint-disable-next-line no-continue
                continue;
            }
        }
        return grid;
    }

    handleInput(event) {
        if (event.key === 'Backspace' || event.key === 'Delete') {
            this.deleteCellValue();
        } else {
            this.updateCellValue(event.key);
        }
    }

    updateCellValue(value) {
        const activeRowIndex = this.gameBoard.getActiveRowIndex();
        const activeColumnIndex = this.gameBoard.getActiveColumnIndex();
        if (
            activeRowIndex != null
            && activeColumnIndex != null
            && this.initialBoard[activeRowIndex][activeColumnIndex] === 0
        ) {
            // eslint-disable-next-line no-param-reassign
            value = parseInt(value, 10);
            // only allow changing of cell value if not initially given cell
            if (Number.isFinite(value) && value !== 0) {
                // 1-9 keys only
                if (this.initialBoard[activeRowIndex][activeColumnIndex] === 0) {
                    // update table cells
                    const cell = this.table.rows[activeRowIndex].cells[activeColumnIndex];
                    cell.innerHTML = value.toString();
                    if (this.settings.showIncorrectValues
                        && this.finishedGrid[activeRowIndex][activeColumnIndex] !== value
                    ) {
                        cell.style.color = this.settings.INCORRECT_INPUT_VALUE_COLOR;
                    } else {
                        cell.style.color = this.settings.INPUT_VALUE_COLOR;
                    }
                    // update game board
                    this.gameBoard.updateCurrentCellValue(value);
                }
            }
        }
    }

    deleteCellValue() {
        const activeRowIndex = this.gameBoard.getActiveRowIndex();
        const activeColumnIndex = this.gameBoard.getActiveColumnIndex();
        if (
            activeRowIndex != null
            && activeColumnIndex != null
            && this.initialBoard[activeRowIndex][activeColumnIndex] === 0
        ) {
            this.table.rows[activeRowIndex].cells[activeColumnIndex].innerHTML = '&nbsp';
            this.gameBoard.deleteCurrentCellValue();
        }
    }

    changeActiveCell(e) {
        console.log(e);
        e.path.forEach((element) => {
            console.log(element);
        });
        console.log(e.path);
        const { rowIndex } = e.path[1];
        const { cellIndex } = e.path[0];
        console.log(rowIndex, cellIndex);
        this.gameBoard.setActiveRowIndex(rowIndex);
        this.gameBoard.setActiveColumnIndex(cellIndex);
        this.highlightTable();
    }

    highlightTable() {
        const activeRowIndex = this.gameBoard.getActiveRowIndex();
        const activeColumnIndex = this.gameBoard.getActiveColumnIndex();
        // reset all cells background color to default
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.table.rows[i].cells[j].style.background = this.settings.BACKGROUND_COLOR;
                this.table.rows[i].cells[j].style.fontWeight = 'normal';
            }
        }

        // change column and row color to lighter than the active cell
        for (let i = 0; i < 9; i++) {
            // eslint-disable-next-line max-len
            this.table.rows[i].cells[activeColumnIndex].style.background = this.settings.CELL_AFFECT_COLOR;
            // eslint-disable-next-line max-len
            this.table.rows[activeRowIndex].cells[i].style.background = this.settings.CELL_AFFECT_COLOR;
        }

        // changes 3 by 3 box of active cell to same color as active row and column
        const boxPos = this.sudokuSolver.getBoxPosition(activeRowIndex, activeColumnIndex);
        for (let i = boxPos.rowBegin; i < boxPos.rowEnd; i++) {
            for (let j = boxPos.columnBegin; j < boxPos.columnEnd; j++) {
                this.table.rows[i].cells[j].style.background = this.settings.CELL_AFFECT_COLOR;
            }
        }

        // give dark background to active cell and bold the text
        // eslint-disable-next-line max-len
        this.table.rows[activeRowIndex].cells[activeColumnIndex].style.background = this.settings.ACTIVE_CELL_COLOR;
        this.table.rows[activeRowIndex].cells[activeColumnIndex].style.fontWeight = 'bold';
    }
}
