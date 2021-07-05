import {Game} from './sudoku.js'

//Set onClick event functions
window.newBoard = (() => Game.newBoard());
window.reset = () => Game.reset();

//Start game as soon as window loads
window.onload = Game.startGame();
