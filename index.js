// const prompt = require('prompt');
const prompt = require('prompt-sync')();
const Minesweeper = require('./minesweeper');

let game;

//Define player methods

const gameStart = () => {
  let toPlay = prompt('Would you like to play a game? (Y/N): ')
  if (toPlay.toLowerCase() === 'y' ) {
    console.log('Beginning Easy (3,5) game')
    newGame();

  }

}

// const chooseMove

const newGame = () => {

  game = new Minesweeper(3,5);
  game.newGame();
  game.placeMines(4);

  while (game.alive || game.win) {
    //display state of game
    game.displayGame();
    game.displayBase();
  
    //give player choice
    console.log('Choose a coordinate to dig!')
    let row = prompt('row: ')
    let col = prompt('col: ')

    let [r,c] = [+row, +col]
    game.dig(r,c);


  }  

  if (game.win) {
    console.log('you won!')
  } else {
    game.displayGame();
    game.displayBase();
    console.log('You lost!')
  }
}


gameStart();