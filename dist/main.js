/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Game)
/* harmony export */ });
/* harmony import */ var _board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _solver__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);




class Game {
    /* Public */
    static startGame() {
        this.initializeGame();
    }

    static newBoard() {
        //first delete the old board
        for(let i = 0; i < 9; i++) {
            this.table.deleteRow(0);
        }
        this.initializeGame();
    }

    static reset() {
        //first delete the old board
        for(let i = 0; i < 9; i++) {
            this.table.deleteRow(0);
        }

        this.gameBoard.setData(this.initialBoard);
        //create sudoku grid in table
        for(let i = 0; i < 9; i++) {
            let row = this.table.insertRow();
            for(let j = 0; j < 9; j++) {
                let cell = row.insertCell();
                if(this.initialBoard[i][j] == 0) {
                    cell.innerHTML = "&nbsp";
                }
                else {
                    cell.innerHTML = this.initialBoard[i][j].toString();
                }
                cell.onclick = this.changeActiveCell.bind(this);
            }
        }
    }

    static erase() {
        this.deleteCellValue();
    }

    static updateCell(value) {
        this.updateCellValue(value);
    }

    static checkSolution() {
        //Clear board colors

        let solved = true;
        const data = this.gameBoard.getData();
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                let cell = this.table.rows[i].cells[j];
                cell.style.background = _settings__WEBPACK_IMPORTED_MODULE_2__.default.BACKGROUND_COLOR;
                if(this.initialBoard[i][j] === 0) {
                    //player input value 
                    if(data[i][j] !== this.finishedGrid[i][j]) {
                        cell.style.background = _settings__WEBPACK_IMPORTED_MODULE_2__.default.INCORRECT_COLOR;
                        solved = false;
                    }
                    else {
                        cell.style.background = _settings__WEBPACK_IMPORTED_MODULE_2__.default.CORRECT_COLOR;
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
        // get difficulty settings
        let difficultyRadios = document.getElementsByName('difficulty');
        for(let i = 0; i < difficultyRadios.length; i++) {
            if(i === _settings__WEBPACK_IMPORTED_MODULE_2__.default.difficulty) {
                difficultyRadios[i].checked = true;
            }
            else {
                difficultyRadios[i].checked = false;
            }
        }

        // get show incorrect values settings
        let showIncorrectValuesCheckBox = document.getElementById('showIncorrectValues');
        showIncorrectValuesCheckBox.checked = _settings__WEBPACK_IMPORTED_MODULE_2__.default.showIncorrectValues;
    }

    static changeSettings() {
        // get difficulty settings
        let difficultyRadios = document.getElementsByName('difficulty');
        for(let i = 0; i < difficultyRadios.length; i++) {
            if(difficultyRadios[i].checked) {
                _settings__WEBPACK_IMPORTED_MODULE_2__.default.difficulty = i;
            }
        }

        // get show incorrect values settings
        let showIncorrectValuesCheckBox = document.getElementById('showIncorrectValues');
        _settings__WEBPACK_IMPORTED_MODULE_2__.default.showIncorrectValues = showIncorrectValuesCheckBox.checked;
        //color previous incorrect inputs
        let data = this.gameBoard.getData();
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j ++) {
                if(
                    this.initialBoard[i][j] == 0 &&
                    this.finishedGrid[i][j] !== data[i][j]) {
                        this.table.rows[i].cells[j].style.color = _settings__WEBPACK_IMPORTED_MODULE_2__.default.showIncorrectValues ? _settings__WEBPACK_IMPORTED_MODULE_2__.default.INCORRECT_INPUT_VALUE_COLOR : _settings__WEBPACK_IMPORTED_MODULE_2__.default.INPUT_VALUE_COLOR;
                }
            }
        }

    }

    /* Private */
    static table;
    static gameBoard;
    static initialBoard;
    static finishedGrid;

    static initializeGame() {
        this.table = document.getElementById("sudoku-table");

        //generate game board
        this.initialBoard = this.generateSudokuBoard();
        this.gameBoard = new _board__WEBPACK_IMPORTED_MODULE_0__.default();
        this.gameBoard.setData(this.initialBoard);

        //create sudoku grid in table
        for(let i = 0; i < 9; i++) {
            let row = this.table.insertRow();
            for(let j = 0; j < 9; j++) {
                let cell = row.insertCell();
                if(this.initialBoard[i][j] == 0) {
                    cell.innerHTML = "&nbsp";
                }
                else {
                    cell.innerHTML = this.initialBoard[i][j].toString();
                }
                cell.onclick = this.changeActiveCell.bind(this);
            }
        }

        //initialize key event listener
        document.addEventListener('keydown', this.handleInput.bind(this));
    }

    static generateSudokuBoard() {
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

        this.finishedGrid = _solver__WEBPACK_IMPORTED_MODULE_1__.default.solveEmptyBoard(emptyBoard, 0, 0);
        console.log(this.finishedGrid);
        let grid = this.finishedGrid.map(inner => inner.slice(0));

        //Remove cells from the finish grid as long as there is still only one solution
        let numRemovedCells = _settings__WEBPACK_IMPORTED_MODULE_2__.default.getNumberOfInitialEmptyCells();
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
            _solver__WEBPACK_IMPORTED_MODULE_1__.default.solve(gridCopy, 0, 0, solutions);
            if(solutions.length == 2) {
                //only found one solution not including the empty array
                grid[rowIndex][columnIndex] = 0;
                numRemovedCells--;
                continue;
            }
        }
        return grid;
    }

    static handleInput(event) {
        if(event.key == "Backspace" || event.key == "Delete"){
            this.deleteCellValue();
        }
        else {
            this.updateCellValue(event.key);
        }
    }

    static updateCellValue(value) {
        const activeRowIndex = this.gameBoard.getActiveRowIndex();
        const activeColumnIndex = this.gameBoard.getActiveColumnIndex();
        if(
            activeRowIndex != null &&
            activeColumnIndex != null &&
            this.initialBoard[activeRowIndex][activeColumnIndex] == 0
        ) {
            //only allow changing of cell value if not initially given cell
            if (isFinite(value) && value != 0) {
                //1-9 keys only
                if(this.initialBoard[activeRowIndex][activeColumnIndex] == 0) {
                    //update table cells
                    let cell = this.table.rows[activeRowIndex].cells[activeColumnIndex];
                    const intValue = parseInt(value);
                    cell.innerHTML = value;
                    if(_settings__WEBPACK_IMPORTED_MODULE_2__.default.showIncorrectValues && this.finishedGrid[activeRowIndex][activeColumnIndex] !== intValue) {
                        cell.style.color = _settings__WEBPACK_IMPORTED_MODULE_2__.default.INCORRECT_INPUT_VALUE_COLOR;
                    }
                    else {
                        cell.style.color = _settings__WEBPACK_IMPORTED_MODULE_2__.default.INPUT_VALUE_COLOR;
                    }
                    //update game board
                    this.gameBoard.updateCurrentCellValue(intValue);
                }
            }
        }
    }

    static deleteCellValue() {
        const activeRowIndex = this.gameBoard.getActiveRowIndex();
        const activeColumnIndex = this.gameBoard.getActiveColumnIndex();
        if(
            activeRowIndex != null &&
            activeColumnIndex != null &&
            this.initialBoard[activeRowIndex][activeColumnIndex] == 0
        ) {
                this.table.rows[activeRowIndex].cells[activeColumnIndex].innerHTML = "&nbsp";
                this.gameBoard.deleteCurrentCellValue(this.table);
        }
    }

    static changeActiveCell(e) {
        let rowIndex = e.path[1].rowIndex;
        let cellIndex = e.path[0].cellIndex;
        this.gameBoard.setActiveRowIndex(rowIndex);
        this.gameBoard.setActiveColumnIndex(cellIndex);
        this.highlightTable();        
    }

    static highlightTable() {
        const activeRowIndex = this.gameBoard.getActiveRowIndex();
        const activeColumnIndex = this.gameBoard.getActiveColumnIndex();
        //reset all cells background color to default
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                this.table.rows[i].cells[j].style.background = _settings__WEBPACK_IMPORTED_MODULE_2__.default.BACKGROUND_COLOR;
                this.table.rows[i].cells[j].style.fontWeight = "normal";
            }
        }

        //change column and row color to lighter than the active cell
        for(let i = 0; i < 9; i++) {
            this.table.rows[i].cells[activeColumnIndex].style.background = _settings__WEBPACK_IMPORTED_MODULE_2__.default.CELL_AFFECT_COLOR;
            this.table.rows[activeRowIndex].cells[i].style.background = _settings__WEBPACK_IMPORTED_MODULE_2__.default.CELL_AFFECT_COLOR;
        }

        //changes 3 by 3 box of active cell to same color as active row and column
        let boxPos = _solver__WEBPACK_IMPORTED_MODULE_1__.default.getBoxPosition(activeRowIndex, activeColumnIndex);
        for(let i = boxPos.rowBegin; i < boxPos.rowEnd; i++) {
            for(let j = boxPos.columnBegin; j < boxPos.columnEnd; j++) {
                this.table.rows[i].cells[j].style.background = _settings__WEBPACK_IMPORTED_MODULE_2__.default.CELL_AFFECT_COLOR;
            }
        }

        //give dark background to active cell and bold the text
        this.table.rows[activeRowIndex].cells[activeColumnIndex].style.background = _settings__WEBPACK_IMPORTED_MODULE_2__.default.ACTIVE_CELL_COLOR;
        this.table.rows[activeRowIndex].cells[activeColumnIndex].style.fontWeight = "bold";
    }
}

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Board)
/* harmony export */ });
class Board {
    /* Public */
    constructor() {
        this.data = Array();
    }

    getData() {
        return this.data;
    }

    setData(data) {
        this.data = data.map(inner => inner.slice(0));
    }

    getActiveRowIndex() {
        return this.activeRowIndex;
    }

    setActiveRowIndex(rowIndex) {
        this.activeRowIndex = rowIndex;
    }

    getActiveColumnIndex() {
        return this.activeColumnIndex;
    }

    setActiveColumnIndex(columnIndex) {
        this.activeColumnIndex = columnIndex;
    }

    updateCurrentCellValue(value) {
        if(this.activeRowIndex != null && this.activeColumnIndex != null){
            //update board data
            this.data[this.activeRowIndex][this.activeColumnIndex] = value;
        }
    }

    deleteCurrentCellValue(table) {
        if(this.activeRowIndex != null && this.activeColumnIndex != null) {
            this.data[this.activeRowIndex][this.activeColumnIndex] = 0;
        }
    }

    getRow(index) {
        return this.data[index];
    }

    getColumn(index) {
        let column;
        this.data.forEach(row => {
            column.push(row[index]);
        });
        return column;
    }

    /* Private */
    data;
    activeRowIndex;
    activeColumnIndex;
}

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Solver)
/* harmony export */ });
class Solver {
    /* Public */
    static solveEmptyBoard(data, rowIndex, columnIndex) {
        // we've reached the end of the board
        if (rowIndex > 8) {
            return data;
        }

        // reached the end of the row so go to new row
        if (columnIndex > 8) {
            rowIndex++;
            return this.solveEmptyBoard(data, rowIndex, 0);
        }

        // if current cell has a value go to next cell
        if (data[rowIndex][columnIndex] != 0) {
            columnIndex++;
            return this.solveEmptyBoard(data, rowIndex, columnIndex);
        }

        // for every digit 1-9 try placing it in the empty cell and recursively solve the board
        const possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const shuffle = (array) => array.sort(() => 0.5 - Math.random());
        shuffle(possibleValues);
        for (let i = 0; i < 9; i++) {
            if (this.isValid(rowIndex, columnIndex, possibleValues[i], data)) {
                // save old values in case they are needed again
                const oldCellVal = data[rowIndex][columnIndex];
                const oldRowIndex = rowIndex;
                const oldColumnIndex = columnIndex;

                // recursively solve using this cell value
                data[rowIndex][columnIndex] = possibleValues[i];
                columnIndex++;
                const result = this.solveEmptyBoard(data, rowIndex, columnIndex);
                if (result != null) {
                    // it has reached a solution
                    return result;
                }

                // no solution was found so set old values and try different cell value
                rowIndex = oldRowIndex;
                columnIndex = oldColumnIndex;
                data[rowIndex][columnIndex] = oldCellVal;
            }
        }

        // if all digits have been attempted then no solution is possible
        return null;
    }

    static solve(data, rowIndex, columnIndex, solutions) {
        // we've reached the end of the board
        if (rowIndex > 8) {
            return data;
        }

        // reached the end of the row so go to new row
        if (columnIndex > 8) {
            rowIndex++;
            return this.solve(data, rowIndex, 0, solutions);
        }

        // if current cell has a value go to next cell
        if (data[rowIndex][columnIndex] != 0) {
            columnIndex++;
            return this.solve(data, rowIndex, columnIndex, solutions);
        }

        // for every digit 1-9 try placing it in the empty cell and recursively solve the board
        const possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let i = 0; i < 9; i++) {
            if (this.isValid(rowIndex, columnIndex, possibleValues[i], data)) {
                // save old values
                // let oldCellVal = data[rowIndex][columnIndex];
                const oldRowIndex = rowIndex;
                const oldColumnIndex = columnIndex;
                const oldData = data.map((inner) => inner.slice(0));

                // recursively solve using this cell value
                data[rowIndex][columnIndex] = possibleValues[i];
                columnIndex++;
                const result = this.solve(data, rowIndex, columnIndex, solutions);
                if (result != null) {
                    // it has reached a solution
                    solutions.push(data);
                    // return result;
                }

                // set old values and try different cell value
                rowIndex = oldRowIndex;
                columnIndex = oldColumnIndex;
                // data[rowIndex][columnIndex] = oldCellVal;
                data = oldData.map((inner) => inner.slice(0));
            }
        }
        // if all digits have been attempted then return
        return null;
    }

    static isValid(rowIndex, columnIndex, value, data) {
        // check if value is row and column valid
        for (let i = 0; i < 9; i++) {
            if (
                (data[rowIndex][i] == value && i != columnIndex)
                || (data[i][columnIndex] == value && i != rowIndex)
            ) {
                return false;
            }
        }

        // check if value is box valid
        const boxPos = this.getBoxPosition(rowIndex, columnIndex);
        for (let i = boxPos.rowBegin; i < boxPos.rowEnd; i++) {
            for (let j = boxPos.columnBegin; j < boxPos.columnEnd; j++) {
                if (data[i][j] == value && i != rowIndex && j != columnIndex) {
                    return false;
                }
            }
        }

        return true;
    }

    static isSolved(data) {
        // go through board and check if every cell is valid
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (!this.isValid(i, j, data[i][j], data)) {
                    return false;
                }
            }
        }
        return true;
    }

    static getBoxPosition(rowIndex, columnIndex) {
        let rowBegin;
        let rowEnd;
        let columnBegin;
        let columnEnd;
        // find where the row begins and ends
        if (rowIndex < 3) {
            // one of the 3 boxes from the top row
            rowBegin = 0;
            rowEnd = 3;
        } else if (rowIndex >= 3 && rowIndex < 6) {
            // one of the 3 boxes from the middle row
            rowBegin = 3;
            rowEnd = 6;
        } else if (rowIndex > 5) {
            // one of the 3 boxes from the bottom row
            rowBegin = 6;
            rowEnd = 9;
        }

        // find where the column begins and ends
        if (columnIndex < 3) {
            // one of the 3 boxes in the left column
            columnBegin = 0;
            columnEnd = 3;
        } else if (columnIndex >= 3 && columnIndex < 6) {
            // one of the 3 boxes in the middle column
            columnBegin = 3;
            columnEnd = 6;
        } else if (columnIndex > 5) {
            // one of the 3 boxes in the right column
            columnBegin = 6;
            columnEnd = 9;
        }

        return {
            rowBegin,
            rowEnd,
            columnBegin,
            columnEnd,
        };
    }
}


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Settings)
/* harmony export */ });
//Substitute for enums since javascript doesn't support enums
const difficulties = {
    EASY: 0,
    MEDIUM: 1,
    HARD: 2
}

class Settings {
    static BACKGROUND_COLOR = 'white'; // Color of the non-active cells
    static ACTIVE_CELL_COLOR = 'rgb(200,200,210)'; // Color of the current active cell
    static CELL_AFFECT_COLOR = 'rgb(230,230,240)'; // Color of the row, column, and box of active cell
    static CORRECT_COLOR = 'rgb(220,255,220)'; // Color of the correct cells after checking solution
    static INCORRECT_COLOR = 'rgb(255,220,220)'; // Color of the incorrect cells after checking solution
    static INPUT_VALUE_COLOR = 'blue'; // Color of the input text
    static INCORRECT_INPUT_VALUE_COLOR = 'red'; //Color of the input text if it is incorrect and show incorrect values is true
    static difficulty = difficulties.MEDIUM; //Difficulty of new generated puzzles
    static showIncorrectValues = false; //Flag that allows the player to see if an input is incorrect if flag is set to true

    static getNumberOfInitialEmptyCells() {
        switch(this.difficulty) {
            case difficulties.EASY:
                return 30;
            case difficulties.MEDIUM:
                return 40;
            case difficulties.HARD:
                return 50;
        }
    }


}

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sudoku__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


window.Game = _sudoku__WEBPACK_IMPORTED_MODULE_0__.default;
})();

/******/ })()
;