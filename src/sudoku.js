import Board from './board';
import Solver from './solver';
import Settings from './settings';

export default class Game {
    /* Public */
    static startGame() {
        this.#initializeGame();
    }

    static newBoard() {
        //first delete the old board
        for(let i = 0; i < 9; i++) {
            this.#table.deleteRow(0);
        }
        this.#initializeGame();
    }

    static reset() {
        //first delete the old board
        for(let i = 0; i < 9; i++) {
            this.#table.deleteRow(0);
        }

        this.#gameBoard.setData(this.#initialBoard);
        //create sudoku grid in table
        for(let i = 0; i < 9; i++) {
            let row = this.#table.insertRow();
            for(let j = 0; j < 9; j++) {
                let cell = row.insertCell();
                if(this.#initialBoard[i][j] == 0) {
                    cell.innerHTML = "&nbsp";
                }
                else {
                    cell.innerHTML = this.#initialBoard[i][j].toString();
                }
                cell.onclick = this.#changeActiveCell.bind(this);
            }
        }
    }

    static erase() {
        this.#deleteCellValue();
    }

    static updateCell(value) {
        this.#updateCellValue(value);
    }

    static checkSolution() {
        //Clear board colors

        let solved = true;
        const data = this.#gameBoard.getData();
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                let cell = this.#table.rows[i].cells[j];
                cell.style.background = Settings.BACKGROUND_COLOR;
                if(this.#initialBoard[i][j] === 0) {
                    //player input value 
                    if(data[i][j] !== this.#finishedGrid[i][j]) {
                        cell.style.background = Settings.INCORRECT_COLOR;
                        solved = false;
                    }
                    else {
                        cell.style.background = Settings.CORRECT_COLOR;
                    }
                }
            }
        }

        if(solved) {
            alert("Correct solution!");
        }
        else {
            alert("Incorrect solution!");
        }
    }

    static closeSettings() {
        let difficultyRadios = document.getElementsByName('difficulty');
        for(let i = 0; i < difficultyRadios.length; i++) {
            if(i === Settings.difficulty) {
                difficultyRadios[i].checked = true;
            }
            else {
                difficultyRadios[i].checked = false;
            }
        }
    }

    static changeSettings() {
        let difficultyRadios = document.getElementsByName('difficulty');
        for(let i = 0; i < difficultyRadios.length; i++) {
            if(difficultyRadios[i].checked) {
                Settings.difficulty = i;
            }
        }
    }

    /* Private */
    static #table;
    static #gameBoard;
    static #initialBoard;
    static #finishedGrid;

    static #initializeGame() {
        this.#table = document.getElementById("sudoku-table");

        //generate game board
        this.#initialBoard = this.#generateSudokuBoard();
        this.#gameBoard = new Board();
        this.#gameBoard.setData(this.#initialBoard);

        //create sudoku grid in table
        for(let i = 0; i < 9; i++) {
            let row = this.#table.insertRow();
            for(let j = 0; j < 9; j++) {
                let cell = row.insertCell();
                if(this.#initialBoard[i][j] == 0) {
                    cell.innerHTML = "&nbsp";
                }
                else {
                    cell.innerHTML = this.#initialBoard[i][j].toString();
                }
                cell.onclick = this.#changeActiveCell.bind(this);
            }
        }

        //initialize key event listener
        document.addEventListener('keydown', this.#handleInput.bind(this));
    }

    static #generateSudokuBoard() {
        console.log("generating sudoku board...");
        //0 represents an empty space
        let emptyBoard = [
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0]
        ];

        this.#finishedGrid = Solver.solveEmptyBoard(emptyBoard, 0, 0);

        let grid = this.#finishedGrid.map(inner => inner.slice(0));

        //Remove cells from the finish grid as long as there is still only one solution
        let numRemovedCells = Settings.getNumberOfInitialEmptyCells();
        while(numRemovedCells > 0) {
            //Pick random row and column indices
            let rowIndex = Math.floor(Math.random() * 9);
            let columnIndex = Math.floor(Math.random() * 9);

            if(grid[rowIndex][columnIndex] == 0) {
                //already changed this to an empty cell
                continue;
            }

            //copy grid, remove cell, and find solutions
            let gridCopy = grid.map(inner => inner.slice(0));
            gridCopy[rowIndex][columnIndex] = 0;
            let solutions = [[[]]];
            Solver.solve(gridCopy, 0, 0, solutions);
            if(solutions.length == 2) {
                //only found one solution not including the empty array
                grid[rowIndex][columnIndex] = 0;
                numRemovedCells--;
                continue;
            }
        }
        return grid;
    }

    static #handleInput(event) {
        if(event.key == "Backspace" || event.key == "Delete"){
            this.#deleteCellValue();
        }
        else {
            this.#updateCellValue(event.key);
        }
    }

    static #updateCellValue(value) {
        const activeRowIndex = this.#gameBoard.getActiveRowIndex();
        const activeColumnIndex = this.#gameBoard.getActiveColumnIndex();
        if(
            activeRowIndex != null &&
            activeColumnIndex != null &&
            this.#initialBoard[activeRowIndex][activeColumnIndex] == 0
        ) {
            //only allow changing of cell value if not initially given cell
            if (isFinite(value) && value != 0) {
                //1-9 keys only
                if(this.#initialBoard[activeRowIndex][activeColumnIndex] == 0) {
                    //update table cells
                    let cell = this.#table.rows[activeRowIndex].cells[activeColumnIndex];
                    const intValue = parseInt(value);
                    cell.innerHTML = value;
                    if(Settings.showIncorrectValues && this.#finishedGrid[activeRowIndex][activeColumnIndex] !== this.#gameBoard.getData()[activeRowIndex][activeColumnIndex]) {
                        cell.style.color = Settings.INCORRECT_INPUT_VALUE_COLOR;
                    }
                    else {
                        cell.style.color = Settings.INPUT_VALUE_COLOR;
                    }
                    //update game board
                    this.#gameBoard.updateCurrentCellValue(intValue);
                }
            }
        }
    }

    static #deleteCellValue() {
        const activeRowIndex = this.#gameBoard.getActiveRowIndex();
        const activeColumnIndex = this.#gameBoard.getActiveColumnIndex();
        if(
            activeRowIndex != null &&
            activeColumnIndex != null &&
            this.#initialBoard[activeRowIndex][activeColumnIndex] == 0
        ) {
                this.#table.rows[activeRowIndex].cells[activeColumnIndex].innerHTML = "&nbsp";
                this.#gameBoard.deleteCurrentCellValue(this.#table);
        }
    }

    static #changeActiveCell(e) {
        let rowIndex = e.path[1].rowIndex;
        let cellIndex = e.path[0].cellIndex;
        this.#gameBoard.setActiveRowIndex(rowIndex);
        this.#gameBoard.setActiveColumnIndex(cellIndex);
        this.#highlightTable();        
    }

    static #highlightTable() {
        const activeRowIndex = this.#gameBoard.getActiveRowIndex();
        const activeColumnIndex = this.#gameBoard.getActiveColumnIndex();
        //reset all cells background color to default
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                this.#table.rows[i].cells[j].style.background = Settings.BACKGROUND_COLOR;
                this.#table.rows[i].cells[j].style.fontWeight = "normal";
            }
        }

        //change column and row color to lighter than the active cell
        for(let i = 0; i < 9; i++) {
            this.#table.rows[i].cells[activeColumnIndex].style.background = Settings.CELL_AFFECT_COLOR;
            this.#table.rows[activeRowIndex].cells[i].style.background = Settings.CELL_AFFECT_COLOR;
        }

        //changes 3 by 3 box of active cell to same color as active row and column
        let boxPos = Solver.getBoxPosition(activeRowIndex, activeColumnIndex);
        for(let i = boxPos.rowBegin; i < boxPos.rowEnd; i++) {
            for(let j = boxPos.columnBegin; j < boxPos.columnEnd; j++) {
                this.#table.rows[i].cells[j].style.background = Settings.CELL_AFFECT_COLOR;
            }
        }

        //give dark background to active cell and bold the text
        this.#table.rows[activeRowIndex].cells[activeColumnIndex].style.background = Settings.ACTIVE_CELL_COLOR;
        this.#table.rows[activeRowIndex].cells[activeColumnIndex].style.fontWeight = "bold";
    }
}