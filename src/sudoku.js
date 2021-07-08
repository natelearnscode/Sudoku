import { Board } from './board';
import { Solver } from './solver';

export class Game {
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
        if(
            this.#gameBoard.getActiveRowIndex() != null &&
            this.#gameBoard.getActiveColumnIndex() != null &&
            this.#initialBoard[this.#gameBoard.getActiveRowIndex()][this.#gameBoard.getActiveColumnIndex()] == 0
        ) {
            this.#gameBoard.deleteCurrentCellValue(this.#table);
        }
    }

    static updateCell(value) {
        if(
            this.#gameBoard.getActiveRowIndex() != null &&
            this.#gameBoard.getActiveColumnIndex() != null &&
            this.#initialBoard[this.#gameBoard.getActiveRowIndex()][this.#gameBoard.getActiveColumnIndex()] == 0
        ) {
            this.#gameBoard.updateCurrentCellValue(this.#table, value);
        }
    }

    /* Private */
    static #table;
    static #gameBoard;
    static #initialBoard;

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

        let finishedGrid = Solver.solveEmptyBoard(emptyBoard, 0, 0);

        let grid = finishedGrid.map(inner => inner.slice(0));

        //Remove cells from the finish grid as long as there is still only one solution
        let numRemovedCells = 30;
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
        if(
            this.#gameBoard.getActiveRowIndex() != null &&
            this.#gameBoard.getActiveColumnIndex() != null &&
            this.#initialBoard[this.#gameBoard.getActiveRowIndex()][this.#gameBoard.getActiveColumnIndex()] == 0
        ) {
            //only allow changing of cell value if not initially given cell
            if (isFinite(event.key) && event.key != 0) {
                //1-9 keys only
                console.log(event.key);
                if(this.#initialBoard[this.#gameBoard.getActiveRowIndex()][this.#gameBoard.getActiveColumnIndex()] == 0) {
                    this.#gameBoard.updateCurrentCellValue(this.#table, parseInt(event.key));
                }
            }
            else if(event.key == "Backspace" || event.key == "Delete"){
                this.#gameBoard.deleteCurrentCellValue(this.#table);
            }
        }

    }

    static #changeActiveCell(e) {
        let rowIndex = e.path[1].rowIndex;
        let cellIndex = e.path[0].cellIndex;
        this.#gameBoard.setActiveRowIndex(rowIndex);
        this.#gameBoard.setActiveColumnIndex(cellIndex);
        this.#gameBoard.draw(this.#table);
    }
}