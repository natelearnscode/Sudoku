// Substitute for enums since javascript doesn't support enums
const DIFFICULTIES = {
    EASY: 0,
    MEDIUM: 1,
    HARD: 2,
};

export default class Settings {
    constructor() {
        this.BACKGROUND_COLOR = 'white'; // Color of the non-active cells
        this.ACTIVE_CELL_COLOR = 'rgb(200,200,210)'; // Color of the current active cell
        this.CELL_AFFECT_COLOR = 'rgb(230,230,240)'; // Color of the row, column, and box of active cell
        this.CORRECT_COLOR = 'rgb(220,255,220)'; // Color of the correct cells after checking solution
        this.INCORRECT_COLOR = 'rgb(255,220,220)'; // Color of the incorrect cells after checking solution
        this.INPUT_VALUE_COLOR = 'blue'; // Color of the input text
        this.INCORRECT_INPUT_VALUE_COLOR = 'red'; // Color of the input text if it is incorrect and show incorrect values is true
        this.difficulty = DIFFICULTIES.MEDIUM; // Difficulty of new generated puzzles
        this.showIncorrectValues = false; // Flag that if true show if an input is incorrect
    }

    getNumberOfInitialEmptyCells() {
        switch (this.difficulty) {
        case DIFFICULTIES.EASY:
            return 30;
        case DIFFICULTIES.MEDIUM:
            return 40;
        case DIFFICULTIES.HARD:
            return 50;
        default:
            return 30;
        }
    }
}
