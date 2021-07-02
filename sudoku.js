const BACKGROUND_COLOR = "white"; //Color of the non-active cells
const ACTIVE_CELL_COLOR = "rgb(200,200,210)"; //Color of the current active cell
const CELL_AFFECT_COLOR = "rgb(230,230,240)"; //Color of the row, column, and box of active cell

class Board {
    /* Public */
    constructor() {
        this.#data = Array();
    }

    getData() {
        return this.#data;
    }

    setData(data) {
        this.#data = data;
    }

    getActiveRowIndex() {
        return this.#activeRowIndex;
    }

    setActiveRowIndex(rowIndex) {
        this.#activeRowIndex = rowIndex;
    }

    getActiveColumnIndex() {
        return this.#activeColumnIndex;
    }

    setActiveColumnIndex(columnIndex) {
        this.#activeColumnIndex = columnIndex;
    }

    draw() {
        //reset all cells background color to default
        for(let i = 0; i < this.#data.length; i++) {
            for(let j = 0; j < this.#data[i].children.length; j++) {
                this.#data[i].children[j].style.background = BACKGROUND_COLOR;
                this.#data[i].children[j].style.fontWeight = "normal";
            }
        }

        //change column and row color to lighter than the active cell
        for(let i = 0; i < this.#data.length; i++) {
            this.#data[i].children[this.#activeColumnIndex].style.background = CELL_AFFECT_COLOR;
            this.#data[this.#activeRowIndex].children[i].style.background = CELL_AFFECT_COLOR;
        }

        let boxCells = this.#getBox(this.#activeRowIndex, this.#activeColumnIndex);
        console.log(boxCells);
        boxCells.forEach(row => {
            row.forEach(cell => {
                cell.style.background = CELL_AFFECT_COLOR;
            });
        });

        //give dark background to active cell and bold the text
        this.#data[this.#activeRowIndex].children[this.#activeColumnIndex].style.background = ACTIVE_CELL_COLOR;
        this.#data[this.#activeRowIndex].children[this.#activeColumnIndex].style.fontWeight = "bold";
    }

    updateCurrentCellValue(value) {
        if(this.#activeRowIndex != null && this.#activeColumnIndex != null){
            this.#data[this.#activeRowIndex].children[this.#activeColumnIndex].innerHTML = value;
        }
    }

    /* Private */
    #data;
    #activeRowIndex;
    #activeColumnIndex;

    #getRow(rowIndex) {
        return this.#data[rowIndex];
    }

    #getColumn(columnIndex) {
        let columns = Array();
        for(let i = 0; i < this.#data.length; i++) {
            columns.push(this.#data[this.#activeRowIndex].children[i]);
        }
        return columns;
    }

    #getBox(rowIndex, columnIndex) {
        let box = Array();
        let rows;
        let rowBegin;
        let rowEnd;
        let columnBegin;
        let columnEnd;
        //find where the row begins and ends
        if(rowIndex < 3) {
            //one of the 3 boxes from the top row
            rowBegin = 0;
            rowEnd = 3;
        }
        else if(rowIndex >= 3 && rowIndex < 6) {
            //one of the 3 boxes from the middle row
            rowBegin = 3;
            rowEnd = 6;
        }
        else if(rowIndex > 5) {
            //one of the 3 boxes from the bottom row
            rowBegin = 6;
            rowEnd = 9;
        }

        //find where the column begins and ends
        if(columnIndex < 3) {
            //one of the 3 boxes in the left column
            columnBegin = 0;
            columnEnd = 3;
        }
        else if(columnIndex >= 3 && columnIndex < 6) {
            //one of the 3 boxes in the middle column
            columnBegin = 3;
            columnEnd = 6;
        }
        else if(columnIndex > 5) {
            //one of the 3 boxes in the right column
            columnBegin = 6;
            columnEnd = 9;
        }

        rows = this.#data.slice(rowBegin,rowEnd);
        rows.forEach(row => {
            box.push(Array.from(row.children).slice(columnBegin, columnEnd));
        });

        return box;
    }

    #isSolved() {
        false;
    }
}

class Game {
    /* Public */
    static startGame() {
        this.#initializeGame();
    }

    /* Private */
    static #table;
    static #gameBoard;
    static #sudokuSolver;
    static #activeCell;

    static #initializeGame() {
        //generate game board
        let initialBoard = this.#generateSudokuBoard();
        this.#gameBoard = new Board();

        //create sudoku grid in table
        this.#table = document.getElementById("sudoku-table");
        for(let i = 0; i < 9; i++) {
            let row = this.#table.insertRow();
            for(let j = 0; j < 9; j++) {
                let cell = row.insertCell();
                cell.innerHTML = initialBoard[i][j];
                cell.onclick = this.#changeActiveCell.bind(this);
            }
            this.#gameBoard.getData().push(row);
        }
        //initialize key event listener
        document.addEventListener('keydown', this.#handleInput.bind(this));
    }

    static #generateSudokuBoard() {
        console.log("generating sudoku board...");
        return new Array(9).fill("&nbsp").map(()=>new Array(9).fill("&nbsp;"));
    };

    static #handleInput(event) {
        //Only handle 1-9 keys and if a cell has been selected
        if (isFinite(event.key) && event.key != 0) {
            //1-9 keys only
            this.#gameBoard.updateCurrentCellValue(event.key.toString());
        }
    };

    static #changeActiveCell(e) {
        let rowIndex = e.path[1].rowIndex;
        let cellIndex = e.path[0].cellIndex;
        this.#gameBoard.setActiveRowIndex(rowIndex);
        this.#gameBoard.setActiveColumnIndex(cellIndex);
        this.#gameBoard.draw();
    }
}