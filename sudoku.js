const board_border = 'black';
const board_background = "rgb(200,200,200)";

const board = document.getElementById("gameCanvas");
const board_ctx = board.getContext("2d");

board.style.border = "10px solid black"
board_ctx.fillStyle = board_background;
board_ctx.fillRect(0, 0, board.width, board.height);