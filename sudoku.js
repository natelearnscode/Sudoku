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
        this.#gameBoard = this.#generateSudokuBoard();

        //create Table
        this.#table = document.getElementById("sudoku-table");
        for(let i = 0; i < 9; i++) {
            let row = this.#table.insertRow();
            for(let j = 0; j < 9; j++) {
                let cell = row.insertCell();
                cell.innerHTML = this.#gameBoard[i][j];
                cell.onclick = this.#changeActiveCell.bind(this);
            }
        }

        //initialize event listener
        document.addEventListener('keydown', this.#handleInput.bind(this));
    }

    static #generateSudokuBoard() {
        console.log("generating sudoku board...");
        return new Array(9).fill("&nbsp").map(()=>new Array(9).fill("&nbsp;"));
    };

    static #handleInput(event) {
        //Only handle 1-9 keys and if a cell has been selected
        if (isFinite(event.key) && event.key != 0 && this.#activeCell != null) { 
            //1-9 keys only
            this.#activeCell.innerHTML = event.key.toString();
        }
    };

    static #changeActiveCell(e) {
        if (this.#activeCell != null) {
            //Reset background color to white before changing active cell
            this.#activeCell.style.background = "white";
        }
        this.#activeCell = e.path[0];
        //Give grey background to active cell
        this.#activeCell.style.background = "rgb(240,240,240)";
    }
}