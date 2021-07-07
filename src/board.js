import {BACKGROUND_COLOR, ACTIVE_CELL_COLOR, CELL_AFFECT_COLOR} from './settings.js';

export class Board {
    /* Public */
    constructor() {
        this.#data = Array();
    }

    getData() {
        return this.#data;
    }

    setData(data) {
        this.#data = data.map(inner => inner.slice(0));
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

    draw(table) {
        //reset all cells background color to default
        for(let i = 0; i < this.#data.length; i++) {
            for(let j = 0; j < this.#data[i].length; j++) {
                table.rows[i].cells[j].style.background = BACKGROUND_COLOR;
                table.rows[i].cells[j].style.fontWeight = "normal";
            }
        }

        //change column and row color to lighter than the active cell
        for(let i = 0; i < this.#data.length; i++) {
            table.rows[i].cells[this.#activeColumnIndex].style.background = CELL_AFFECT_COLOR;
            table.rows[this.#activeRowIndex].cells[i].style.background = CELL_AFFECT_COLOR;
        }

        //changes 3 by 3 box of active cell to same color as active row and column
        let boxPos = this.#getBoxPosition(this.#activeRowIndex, this.#activeColumnIndex);
        for(let i = boxPos.rowBegin; i < boxPos.rowEnd; i++) {
            for(let j = boxPos.columnBegin; j < boxPos.columnEnd; j++) {
                table.rows[i].cells[j].style.background = CELL_AFFECT_COLOR;
            }
        }

        //give dark background to active cell and bold the text
        table.rows[this.#activeRowIndex].cells[this.#activeColumnIndex].style.background = ACTIVE_CELL_COLOR;
        table.rows[this.#activeRowIndex].cells[this.#activeColumnIndex].style.fontWeight = "bold";
    }

    updateCurrentCellValue(table, value) {
        if(this.#activeRowIndex != null && this.#activeColumnIndex != null){
            console.log(this.isValid(this.#activeRowIndex, this.#activeColumnIndex, value, this.#data));
            //update board data
            this.#data[this.#activeRowIndex][this.#activeColumnIndex] = value;
            //update table cells
            table.rows[this.#activeRowIndex].cells[this.#activeColumnIndex].innerHTML = value.toString();
            table.rows[this.#activeRowIndex].cells[this.#activeColumnIndex].style.color = this.isValid(this.#activeRowIndex, this.#activeColumnIndex, value, this.#data) ? "blue" : "red";
        }
    }

    deleteCurrentCellValue(table) {
        if(this.#activeRowIndex != null && this.#activeColumnIndex != null) {
            this.#data[this.#activeRowIndex][this.#activeColumnIndex] = 0;
            table.rows[this.#activeRowIndex].cells[this.#activeColumnIndex].innerHTML = "&nbsp";
        }
    }

    getRow(index) {
        return this.#data[index];
    }

    getColumn(index) {
        let column;
        this.#data.forEach(row => {
            column.push(row[index]);
        });
        return column;
    }

    isValid(rowIndex, columnIndex, value, data){
        //check if value is row and column valid
        for(let i = 0; i < 9; i++) {
            if((data[rowIndex][i] == value && i != columnIndex) || (data[i][columnIndex] == value && i != rowIndex)) {
                return false;
            }
        }

        //check if value is box valid
        let boxPos = this.#getBoxPosition(rowIndex, columnIndex);
        for(let i = boxPos.rowBegin; i < boxPos.rowEnd; i++) {
            for(let j = boxPos.columnBegin; j < boxPos.columnEnd; j++) {
                if(data[i][j] == value && i != rowIndex && j != columnIndex){
                    return false;
                }
            }
        }

        return true;
    }

    /* Private */
    #data;
    #activeRowIndex;
    #activeColumnIndex;

    #getTableRow(table, index) {
        return table.rows[index];
    }

    #getTableColumn(table, index) {
        let columns = Array();
        for(let i = 0; i < this.#data.length; i++) {
            columns.push(table.rows[index].cells[i]);
        }
        return columns;
    }

    #getBoxPosition(rowIndex, columnIndex) {
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

        return {
            rowBegin,
            rowEnd,
            columnBegin,
            columnEnd
        }
    }
}