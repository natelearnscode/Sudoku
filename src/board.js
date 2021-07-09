export default class Board {
    /* Public */
    constructor() {
        this.data = [];
        this.activeRowIndex = 0;
        this.activeColumnIndex = 0;
    }

    getData() {
        return this.data;
    }

    setData(data) {
        this.data = data.map((inner) => inner.slice(0));
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
}