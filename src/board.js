export default class Board {
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

    updateCurrentCellValue(value) {
        if(this.#activeRowIndex != null && this.#activeColumnIndex != null){
            //update board data
            this.#data[this.#activeRowIndex][this.#activeColumnIndex] = value;
        }
    }

    deleteCurrentCellValue(table) {
        if(this.#activeRowIndex != null && this.#activeColumnIndex != null) {
            this.#data[this.#activeRowIndex][this.#activeColumnIndex] = 0;
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