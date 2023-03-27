/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2

const playerTurn =  document.getElementById("player-turn");

function updatePlayerTurnText() {
  if (currPlayer === 2) {
    playerTurn.textContent = "Red's Turn";
    playerTurn.style.color = "red";
  } else 
  if (currPlayer === 1) {
    playerTurn.textContent = "Blue's Turn";
    playerTurn.style.color = "blue";
  }
}
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for (let y = 0; y < HEIGHT; y++) {
    let row = [];
    for (let x = 0; x < WIDTH; x++) {
      row.push(null);
    }
    board.push(row);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById('board');
  // TODO: add comment for this code
  var top = document.createElement("tr");   // creates top row for gameplay
  top.setAttribute("id", "column-top");    // labels top row column-top
  top.addEventListener("click", handleClick);  // listens for click

  for (var x = 0; x < WIDTH; x++) {
    var headCell = document.createElement("td"); // creates boxes for top row
    headCell.setAttribute("id", x);  // set is for each bpx in top row
    top.append(headCell); // add boxes to top row
  }
  htmlBoard.append(top);  // add top row to board

  // TODO: add comment for this code
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr"); // create 6 rows for the game
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td"); // creates boxes for each row
      cell.setAttribute("id", `${y}-${x}`); // gives id for each box (x,y)
      row.append(cell);  // add boxes to each row
    }
    htmlBoard.append(row); // add row to board
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  let y = HEIGHT - 1;
  while (y >= 0 && board[y][x]) {
    y--;
  }
  return y;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const cell = document.createElement("div");
  cell.classList.add("piece", `player${currPlayer}`);

  const slot = document.getElementById(`${y}-${x}`);
  slot.append(cell);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  setTimeout(() => {
    alert(msg);
    resetGame();
  }, 250);
}

function resetGame() {
  const topRow = document.getElementById("column-top");
  topRow.removeEventListener("click", handleClick);

  const cells  = document.querySelectorAll("td div");
  for (let cell of cells) {
    cell.classList.remove(`player${currPlayer}`);
    cell.remove();
  }

  topRow.addEventListener("click", handleClick);

  board =  new Array(HEIGHT);
  for (let i = 0; i < HEIGHT; i++) {
    board[i] = new Array(WIDTH).fill(null);
  }

  currPlayer = 1;
  playerTurn.textContent = "Red's Turn";
  playerTurn.style.color = "red";
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  updatePlayerTurnText();
  // get x from ID of clicked cell
  var x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  var y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  // TODO: add line to update in-memory board
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  function checkForTie() {
    for (let x = 0; x < WIDTH; x++) {
      if (board[0][x] === null) {
        return false;
      }
    }
    return true;
  }
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (checkForTie()) {
    return endGame(`Tie!`);
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = (currPlayer === 1) ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
