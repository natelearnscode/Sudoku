//Substitute for enums since javascript doesn't support enums
const difficulties = {
    EASY: 0,
    MEDIUM: 1,
    HARD: 2
}

export default class Settings {
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