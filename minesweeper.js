let Minesweeper = function(row,col) {
  this.rows = row;
  this.cols = col;
  this.board;
  this.view;
  this.alive = true;
  this.win = false;
  this.bombs = [];
  this.piecesLeft = row * col;
}

const BOMB = '*'
const BLANK = '_'
const EMPTY = ' '

/**
 * generates a random coordinate
 * 
 * @param {int} max row value
 * @param {int} max col value
 * @returns {int[]} array representing random coordinate [row, col]
 */
Minesweeper.prototype.randomCoord = function(row,col) {
  return [Math.floor(Math.random() * row), Math.floor(Math.random() * col)]
}

/**
 * generate a row x col size board filled with 0's'
 * 
 */
Minesweeper.prototype.newGame = function() {
  this.board = [];
  this.view = [];
  for (let i = 0; i < this.rows; i++) {
    this.board[i] = new Array(this.cols).fill(0);
    this.view[i] = new Array(this.cols).fill(BLANK)
  }
}


/**
 * checks if a coordinate is on the board
 * 
 * @param {int} row coordinate r
 * @param {int} col coordinate c
 * @returns {bool} whether coordinate is on board
 */
Minesweeper.prototype.isValidCoord = function(r, c) {
  return (r >= 0 && r < this.rows) && 
         (c >= 0 && c < this.cols); 
}

Minesweeper.prototype.isBomb = function(r, c) {
  return this.board[r][c] === BOMB;
}

/**
 * randomly places mines on the board using 9 as value
 * 
 * @param {int} number of mines to place
 * @returns {int[]} board with all updates 
 */
Minesweeper.prototype.placeMines = function(mines){
 
  while (mines > 0) {
    let [r,c] = this.randomCoord(this.rows,this.cols)
    if (this.board[r][c] !== BOMB) {
      this.board[r][c] = BOMB;
      this.bombs.push([r,c]);
      this.updateCount(r,c);
      mines--;
    }
  }
}

/**
 * 1 2 3
 * 4 X 5
 * 6 7 8
 * 
 * update counters for bombs around a coordinate
 * 
 * @param {int} coordinate row r
 * @param {int} coordinate col c
 */
Minesweeper.prototype.updateCount = function(r,c) {
  //check 1, 2, 3
  if (this.isValidCoord(r-1, c-1) && !this.isBomb(r-1, c-1)) this.board[r-1][c-1]++;
  if (this.isValidCoord(r-1, c) && !this.isBomb(r-1, c)) this.board[r-1][c]++;
  if (this.isValidCoord(r-1, c+1) && !this.isBomb(r-1, c+1)) this.board[r-1][c+1]++;
  //check 4, 5
  if (this.isValidCoord(r, c-1) && !this.isBomb(r, c-1)) this.board[r][c-1]++;
  if (this.isValidCoord(r, c+1) && !this.isBomb(r, c+1)) this.board[r][c+1]++;
  //check 6, 7, 8
  if (this.isValidCoord(r+1, c-1) && !this.isBomb(r+1, c-1)) this.board[r+1][c-1]++;
  if (this.isValidCoord(r+1, c) && !this.isBomb(r+1, c)) this.board[r+1][c]++;
  if (this.isValidCoord(r+1, c+1) && !this.isBomb(r+1, c+1)) this.board[r+1][c+1]++;

}

/**
 * Prints to the console the current players view of the game
 */
Minesweeper.prototype.displayGame = function() {
  let line = '-' + new Array(this.cols * 4).fill('-').join('') + ('\n')
  let border = '|' + new Array(this.cols).fill('---').join('|') + '|\n';

  let rowBoard = this.view.map(row => {
    return '| ' + row.join(' | ') + ' |\n'
  })

  let result = line + rowBoard.join(border) + line
  console.log(result)
}

/**
 * Prints to the console the underlying  view of the game
 */
Minesweeper.prototype.displayBase = function() {
  let line = '-' + new Array(this.cols * 4).fill('-').join('') + ('\n')
  let border = '|' + new Array(this.cols).fill('---').join('|') + '|\n';

  let rowBoard = this.board.map(row => {
    return '| ' + row.join(' | ') + ' |\n'
  })

  let result = line + rowBoard.join(border) + line
  console.log(result)
}

Minesweeper.prototype.uncoverBlank = function(r,c) {

  //check if valid coord
  if (!this.isValidCoord(r,c)) return;
  //check if number
  if (this.board[r][c] !== 0) {
    this.view[r][c] = this.board[r][c];
    this.piecesLeft--
    return;
  }
  if (this.board[r][c] == 0 && this.view[r][c] !== EMPTY) {
    console.log('uncovering ', r, c)
    
    this.view[r][c] = EMPTY;
    this.piecesLeft--;

    this.uncoverBlank(r-1,c-1)
    this.uncoverBlank(r-1,c)
    this.uncoverBlank(r-1,c+1)
    this.uncoverBlank(r,c-1)
    this.uncoverBlank(r,c+1)
    this.uncoverBlank(r+1,c-1)
    this.uncoverBlank(r+1,c)
    this.uncoverBlank(r+1,c+1)
  }

}

Minesweeper.prototype.checkWin = function() {
  //check if # of uncovered pieces left is same as # of bomb
  if (this.piecesLeft !== this.bombs.length) return;

  //if so, check all pieces
  for (let i = 0; i < this.bombs.length; i++) {
    let [r,c] = this.bombs[i];
    if (this.view[r][c] !== BLANK) {
      this.alive = false;
      return;
    }
  }
}

Minesweeper.prototype.dig = function(r,c) {
  if (!this.isValidCoord(r,c)) {
    console.log('Invalid coordinate, try again!')
    return;
  }

  let value = this.board[r][c];
  //if bomb, end game
  if (value === BOMB) {
    console.log('BOOM')
    this.alive = false;
    this.bombs.forEach((pos) => {
      let [rb,cb] = pos;
      this.view[rb][cb] = BOMB;
    })
  }
  //if check if base is number, reveal just number
  else if (value > 0 && value < 9) {
    console.log('revealing number')
    this.view[r][c] = value;
    this.piecesLeft--;
  }
  //if empty, uncover all empty
  else if (value == 0) {
    console.log('hit a 0')
    this.uncoverBlank(r,c)
  }

  //check for win state
  if (!this.win) this.checkWin();

}

module.exports = Minesweeper;