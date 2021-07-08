export const BACKGROUND_COLOR = 'white'; // Color of the non-active cells
export const ACTIVE_CELL_COLOR = 'rgb(200,200,210)'; // Color of the current active cell
export const CELL_AFFECT_COLOR = 'rgb(230,230,240)'; // Color of the row, column, and box of active cell

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
    static difficulty = difficulties.MEDIUM;
    static showIncorrectValues = false;
}