import { MemoryGame, Player, Tile, makeTiles, startGame } from './app.js';

document.addEventListener("DOMContentLoaded", e => {
	
	let game = startGame("#game");

	alert(`${game.activePlayer.name}\'s Turn!`);
	// console.log("Game's Players Names are: ", game.players[0].name, game.players[1].name);
	// console.log("The active player is:  ", game.activePlayer.name);
	
});
