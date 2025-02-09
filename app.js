
/** 
* @class
* @description Game class
* @param {int} - (optional) the number of pairs
*/
class MemoryGame {
	
 	mg_game_ID;
	mg_game_tiles;
	mg_game_score = 0;
	mg_game_active_player;
	mg_game_players = [];
	mg_game_entry_point = {};
	mg_game_tile_pairs = [];
	
	mg_game_tail_pair_number;
	
	constructor(tile_pair_number = 10) {
		this.mg_game_ID = Math.floor(Math.random() * 1000).toString();
		this.mg_game_tail_pair_number = tile_pair_number;
	};
	
	/**
	* @method
	* @description Get the Game instance ID
	* @return {number} - The Game's instance ID
	*/
	get ID() {
		return this.mg_game_ID;
	};
	
	/**
	* @method
	* @description Get the tile pairs
	* @return {array}
	*/
	get tilePairs() {
		return this.mg_game_tile_pairs;
	}
	
	/**
	* @method
	* @description Get the Game instance number of tiles
	* @return {number} - The number of tiles
	*/
	get tileNumber() {
		return this.mg_game_tail_pair_number
	};
	
	/**
	* @method
	* @description Get the Game entry point
	* @return {DOMElement} - The element in which the Game's interface is going to be running
	*/
	get entryPoint() {
		return this.mg_game_entry_point;
	};
	
	/**
	* @method
	* @description Get the active Player's ID
	* @return {string} - The active player's ID
	*/
	get activePlayer() {
		return this.mg_game_active_player;
	};
	
	/**
	* @method
	* @description Get the game players
	* @return {array} - An array of players
	*/
	get players() {
		return this.mg_game_players;
	}
	
	/**
	* @method
	* @description Set the acrive Player's ID
	* @param {PlayerInstance} - The Player's instance
	*/
	set activePlayer(player_instance) {
		this.mg_game_active_player = player_instance;
	};
	
	/**
	* @method
	* @description Set the Game players
	* @param {array} - The Player's instance
	*/
	set players(player_array) {
		this.mg_game_players = player_array;
	};
	
	/**
	* @method
	* @description Set Game entry point
	* @param {string} selector - The selector string
	*/
	setIn(selector) {
		if (selector && typeof selector === 'string') {
			this.mg_game_entry_point = document.querySelector(selector);
		} else {
			console.log('Must provide a valid DOM selector');
		}
	};
	
	/**
	* @method
	* @description Change the active player
	* @return {PlayerInstance}
	*/
	nextPlayer() {
		
		let active_player_index = this.mg_game_players.findIndex(player => {
			return player.ID === this.mg_game_active_player.ID;
		});
		
		let new_active_player = this.mg_game_players[active_player_index + 1];
		
		if(!new_active_player) {
			new_active_player = this.mg_game_players[0];
		};
		
		this.mg_game_active_player = new_active_player;
		
		return new_active_player;
	}
	
};

/**
* @class
* @description Barebones Reactivity System
*/
class Reactive {
	constructor (initialValue) {
		this._value = initialValue;
		this._subscribers = [];
	}
	
	/**
	* @method
	* @description Get the Reactive value
	* @return {number} - The Reactive Value
	*/
	get value() {
		return this._value;
	}
	
	/**
	* @method
	* @description Set the Reactive Value
	*/
	set value(newValue) {
		this._value = newValue;
		this._notify();
	}
	
	/**
	* @method
	* @description Subscribe the Resctive value
	* @return {callback} - The reactive value change
	*/
	subscribe(callback) {
		this._subscribers.push(callback);
		return () => {
			this._subscribers = this._subscribers.filter(cb => cb !== callback);
		}
	}
	
	/**
	* @method
	* @description Actualize the Reactive value
	*/
	_notify() {
		this._subscribers.forEach(callback => callback(this._value));
	}
}

/** 
* @class
* @description Player class
* @param {GameInstance} The Game Instance
* @param {string} The Player's Name
* @param {string} Any valid CSS color value
*/
class Player {
	
	mg_player_ID;
	mg_player_color;
	mg_player_selection = [];
	mg_player_pairs_matched = [];
	mg_player_score;
	mg_player_score_element;
	mg_game_instance;
	
	constructor(game_instance, player_name, player_color) {
		this.mg_player_ID = game_instance.ID + '_' +  Math.floor(Math.random() * 1000).toString();
		this.mg_player_name = player_name;
		this.mg_player_color = player_color;
		this.mg_player_pairs_matched = [];
		this.mg_player_score = new Reactive(0);
		this.mg_player_score_element = null;
		this.mg_game_instance = game_instance;
	};
	
	/**
	* Get the Player ID
	* @return {string} - The Player's ID
	*/
	get ID() {
		return this.mg_player_ID;
	};
	
	/**
	* Get the Player name
	* @return {string} - The Player's Name
	*/
	get name() {
		return this.mg_player_name;
	};
	
	/**
	* Get the Player color
	* @return {string} - Any CSS-valid color value
	*/
	get color() {
		return this.mg_player_color;
	};
	
	/**
	* Get the Player's number of pairs matched
	* @return {int} - The number of pairs matched by the player
	*/
	get pairsMatched() {
		return this.mg_player_pairs_matched;
	};
	
	/**
	* Get the Player's score
	* @return {int} - The player's score
	*/
	get score() {
		return this.mg_player_score.value;
	}
	
	/**
	* Get the Player's score element
	* @return {DOMElement} - The player's score element
	*/
	get scoreElement() {
		return this.mg_player_score_element;
	}
	
	/**
	* Get the current game's instance
	* @return The Gane instance
	*/
	get game() {
		return this.mg_game_instance;
	}
	
	/**
	* Set the Player's score element
	* @param {DOMElement} - The new player's score element
	*/
	set scoreElement(element) {
		return this.mg_player_score_element = element;
	}
	
	/**
	* Sets the player score Reactively
	* @param {int} - The new player's score
	*/
	set score(score) {
		this.mg_player_score.value = score;
	}
	
	/**
	* @method
	* @description Add numbers of matched pairts to the Player's pairsMatched number
	* @param {string} - The matched pair instance ID
	* @param {array} - The number of matched pairs to add
	*/
	addMatchedPair(tile_instance_id, pair_matched) {
		let new_pair_matched = {};
		
		// pair_matched.forEach(tile => {
		// 	tile.element.classList.add("matched");
		// });
		
		new_pair_matched[tile_instance_id] = [...this.mg_player_pairs_matched, ...pair_matched];
		this.mg_player_pairs_matched.push(new_pair_matched);
		
		this.mg_player_score.value +=	1;
	};
	
	/**
	* @method
	* @description - Card flip functionality - It only changes the instance's state 
	* @param {TileInstance}
	*/
	flipCard(tile_instance, tile_element) {
		
		// Makee sure the selection is below 2
		if ( this.mg_player_selection.length < 2) {
			
			// Whilst the selection is below 2 keep pushing the selected tiles
			
				let new_player_selection = {};
				
				new_player_selection['tile_instance'] = tile_instance;
				new_player_selection['tile_element'] = tile_element
			this.mg_player_selection.push(new_player_selection);
		
			// When the soection hits 2 tiles, the proceed ti check whether the twi selected items are pairs
			if(this.mg_player_selection.length === 2) {
				
				if(this.mg_player_selection[0]["tile_instance"].ID == this.mg_player_selection[1]["tile_instance"].ID) {
					
				  this.mg_player_selection[0]["tile_element"].classList.add("matched");
					this.mg_player_selection[0]["tile_element"].style.backgroundColor = this.color;
					
					this.mg_player_selection[1]["tile_element"].classList.add("matched");
					this.mg_player_selection[1]["tile_element"].style.backgroundColor = this.color;
					
					this.addMatchedPair(tile_instance.ID, this.mg_player_selection);
					
					this.mg_player_selection = [];
					
					alert("Keep Going!");	
					
				} else {
					// Handle the Player switching ere'
					let next_player = this.mg_game_instance.nextPlayer();
					
					this.mg_player_selection = [];
					
					alert(`No match, dude! ${next_player.name}\'s turn!`);
				}
			};
		}
	}
	
};

/** 
* @class
* @description Tile class 
*/
class Tile {

	#mg_tile_some_letters = ['a', 'b', 'c'];
	mg_tile_ID;
	mg_tile_icon;
	mg_tile_element;
	#mg_game_instance;
	
	constructor(game_instance, icon = null) {
		this.mg_tile_ID = game_instance.ID + '_' + this.#mg_tile_some_letters[Math.floor(Math.random() * this.#mg_tile_some_letters.length)] + Math.floor(Math.random() * 1000);
		this.mg_tile_icon = icon;
		this.#mg_game_instance = game_instance;
	};
	
	/**
	* Get the Tile ID
	* @return {string} - Get the Tile ID
	*/
	get ID() {
		return this.mg_tile_ID;
	};
	
	/**
	* Get the Tile icon
	* @return {string} - The icon string
	*/
	get icon() {
		return this.mg_tile_icon
	};
	
	/**
	* @method
	* @description Get the Tile Node
	* @return The Tile node
	*/
	get element() {
		return this.mg_tile_element;
	}

	/**
	* Get the Game instance
	* @return The Game instance
	*/
	get game() {
		return this.mg_game_instance;
	};
	
	/**
	* @method
	* @description Set the Tile element
	* @param {HTMLElement}
	*/
	set element(tile_element) {
		this.mg_tile_element = tile_element;
	}
	
};

/**
* @func
* @description Shuffle any given array
* @param {array} - The array to shuffle
*/
const shuffleArray = arr => {
	return arr.map(a => ({sort: Math.random(), value: a}))
	.sort((a,b) => a.sort - b.sort)
	.map(a => a.value);
}

/**
* @func
* @description Create a DOM Element
* @param {string} - The DOM Element to create ("div", "section", etc...)
* @param {array} - The class list for that element
*/
const makeElement = (element, classes=[]) => {
	let created_element;
	
	if(element && typeof element === "string") {
		created_element = document.createElement(element);
		
		if(classes.length > 0) {
			
			classes.forEach(className => {
				created_element.classList.add(className);
				
			});
		}
		
	} else {
		console.log("Input a valid element string");
	}
	
	return created_element;
}

/**
* @func
* @description Creates a Tile Node
* @param {TileInstance} - The Tile instance
+ @return (DOMElement) - The Tile Node
*/
const makeTile = (tile_instance) => {
	
	const tile_icon = tile_instance.icon;
	
	// Tile Container
	const tile_container = makeElement("div", ["tile"]);
	tile_container.setAttribute('data-item-id', `${tile_instance.ID}`);
	
	// Tile Front
	const tile_front = makeElement("div", ["tile--front"]);
	tile_container.appendChild(tile_front);
	
	// Tile Back
	const tile_back = makeElement("div", ["tile--back"]);
	const tile_back_content = document.createTextNode(tile_icon);
	tile_back.appendChild(tile_back_content);
	tile_container.appendChild(tile_back);
	
	tile_instance.element = tile_container;
	
	return tile_container;
}

/**
* @func
* @description Generate the game tiles
* @param {GameInstance} - The Game instance
* @param {array} - The array of icons to use in the tiles (preferrably emojis)
* @return {array} - An array of Tile objects
*/
const makeTiles = (game_instance, icons_array = []) => {
	let tiles = [];
	const mg_maketiles_default_icons = [
	"💎",
	"🦠",
	"🥪",
	"❤️",
	"🧶",
	"🦐",
	"🌝",
	"✨",
	"🍓",
	"🍖"
	];
	
	if (icons_array.length === 0) {
		mg_maketiles_default_icons.forEach(icon => {
			let tile = new Tile(game_instance, `${icon}`);
			let tile_element = makeTile(tile);
			let tile_element_pair = makeTile(tile)
			
			let tile_data = {
				tile_instance: tile,
				tile_element: tile_element,
				tile_element_pair: tile_element_pair
			};
			
			tiles.push(tile_data);
			
		});
	} else {
		for (let i = 0; i <= game_instance.tileNumber; i++) {
			let tile = new Tile(game_instance, `${i}`);
			let tile_element = makeTile(tile);
			let tile_element_pair = makeTile(tile);
			
			let tile_data = {
				tile_instance: tile,
				tile_element: tile_element,
				tile_element_pair: tile_element_pair
			};
			
			tiles.push(tile_data);
			
		}
	}
	
	let shuffled_tile_elements = [];
	let shuffled_tiles = shuffleArray(tiles);
	let shuffled_tile_pairs = shuffleArray(tiles);
	
	tiles.forEach(tile => {
		
		tile.tile_element.addEventListener('click', e => {
			game_instance.activePlayer.flipCard(tile.tile_instance, tile.tile_element);
		});
		tile.tile_element_pair.addEventListener("click", e => {
			game_instance.activePlayer.flipCard(tile.tile_instance, tile.tile_element_pair);
		});
	});
	
	shuffled_tiles.forEach(tile => {
			shuffled_tile_elements.push(tile.tile_element);
		});
		
	shuffled_tile_pairs.forEach(tile => {
			shuffled_tile_elements.push(tile.tile_element_pair);
		});
	
	return {tiles, shuffled_tile_elements};
}

/**
* @func
* @description Create the Game's UI (active player, score, etc)
* @param {GameInstance} - The Game instance
*/
const makeUI = (game_instance) => {
	const players = game_instance.players;
	const active_player = game_instance.activePlayer;
	const game_entry_point = game_instance.entryPoint;
	
	let menu_wrapper = makeElement("div", ["menu_wrapper"]);
	
	// Players
	let menu_players = makeElement("div", ["menu_players"]);
	menu_wrapper.appendChild(menu_players);
	
	players.forEach(player => {
		
		let player_element = makeElement("div", ["player"]);
		
		// Player Name
		let player_p_tag = makeElement("p");
		let player_name = document.createTextNode(`${player.name}: `);
		player_p_tag.appendChild(player_name);
		player_element.appendChild(player_p_tag);
		
		// Scores
		let player_score = makeElement("div", ["player_score"]);
		player_score.style.backgroundColor = player.color;
		let player_score_text = document.createTextNode(player.score);
		player_score.appendChild(player_score_text);
		player_element.appendChild(player_score);
		
		player.scoreElement = player_score;
		
		player.mg_player_score.subscribe((newScore) => {
			player_score.textContent = newScore;
		})
		
		menu_players.appendChild(player_element);
	});
	
	// Tiles 
	let cards_container = makeElement("div", ["tiles_container"]);
	
	let tiles_elements = makeTiles(game_instance).shuffled_tile_elements;
	
	tiles_elements.forEach(tile_element => {
		cards_container.appendChild(tile_element);
	});
	game_entry_point.appendChild(cards_container);
	
	game_entry_point.appendChild(menu_wrapper);
	
};

/**
* @func
* @exports
* @description Start Game.
* @param {string} - The node selector where we want the game to run
* @param {array} - An array of players and their data (probably pulled from a form)
* @param {array} - An array of icons to display in the cards
*/
const startGame = (selector, players_array=[], icons_array=[]) => {
	
	let game;
	let players = [];
	
	// Generate a Game Instance
	if(icons_array.length === 0) {
		game = new MemoryGame();
	} else {
		game = new MemoryGame(icons_array.length);
	}

	game.setIn(selector);
	
	// Generate the Player instances
	if(players_array) {
		
		const p1 = new Player(game, 'P1', 'red');
		const p2 = new Player(game, 'P2', 'blue');
		players.push(p1);
		players.push(p2);
		
		// Set the Game players
		game.players = players;
		// Set the active player
		game.activePlayer = players[0];
		
	} else {
		players_array.forEach(player => {
			const player_instance = new Player(player.name, player.color);
			players.push(player_instance);
		});
	}
	
	makeUI(game);
	
	return game;
	
};


export { startGame };