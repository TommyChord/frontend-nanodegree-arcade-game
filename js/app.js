"use strict";
// Enemies our player must avoid
var Enemy = function() {
	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
	this.sprite = 'images/enemy-bug.png';

	// Sets the initial positions of the enemies.
	// The y position is randomly over the three "tracks"
	this.x = -101;
	this.y = getRandom(3,0) * 85 + 135;
	this.width = 100;
	this.height = 76;
	// Sets the initial enemy speed
	this.maxSpeed = 100;
	this.speed = getRandom(this.maxSpeed, this.maxSpeed - 50);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	// The player movement is multiplied the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.

	// If the player have more than 0 lives, move the enemies
	if(player.lives > 0) {
		this.x += dt * this.speed;
		// If the enemy is outside the border it will re-appear on the left
		// with a new random speed, and on a random "track"
		if(this.x > 505){
			this.x = -101;
			this.speed = getRandom(this.maxSpeed, this.maxSpeed - 50);
			this.y = getRandom(3,0) * 85 + 135;
		}

		// Collision detection and handling
		if (((this.x + 10 < player.x + player.width - 10)  && (this.x + this.width - 10  > player.x + 10)) &&
			((this.y + 10 < player.y + player.height - 20) && (this.y + this.height - 10 > player.y + 20))) {
			// Collision detected so reset player and take a life
			player.takeLife();
			player.reset();
		}
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Define the player
var Player = function(x, y) {
	// Set the player image
	this.sprite = 'images/char-boy.png';
	// Set the initial player position and speed
	this.x = x;
	this.y = y;
	this.direction = 'none';
	this.speed = 200;
	this.width = 71;
	this.height = 95;
	// At game start player has 3 lives and the score is 0
	this.lives = 3;
	this.score = 0;
	// Lock the player movement when it reaches the water.
	// The user has to release the arrow key and press it again to start moving
	this.locked = false;
};

Player.prototype.update = function(dt) {
	// Move player based on pressed key if not locked and lives left
	if((this.lives > 0) && (this.locked === false)) {
		switch (this.direction) {
			case 'left':
				if (this.x > 5) {
					this.x -= dt * this.speed;
				}
				break;
			case 'up':
				if (this.y > 50) {
					this.y -= dt * this.speed;
				}
				break;
			case 'right':
				if (this.x < 425) {
					this.x += dt * this.speed;	
				}
				break;
			case 'down':
				if (this.y < 490) {
					this.y += dt * this.speed;
				}
				break; 	
		}
	}
	
	// If the player reach the water-> Add score and reset player
	if (this.y <=50) {
			this.scores();
			this.reset();
		}
};

// Handle the keyboard input
Player.prototype.handleInput = function(key){
	this.direction = (key) ? key : '';
	// if this is a new game, reset speeds, lives and score
	if((this.lives === 0) && (key == 'enter')){
		this.locked = false;
		this.lives = 3;
		this.score = 0;
		setEnemyMaxSpeed(100);
	}
};

// Render the player and statistics
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	if (this.lives === 0) {
		drawText("Game Over", 80, 50, 280);
		drawText("Hit Enter to play again!", 30, 90, 350);
	}
	// Update lives and score statistics
	drawText("Lives: " + this.lives, 30, 380, 570);
	drawText("Score: " + this.score, 30, 10, 570);
};

// Subtract one life from the player
Player.prototype.takeLife = function() {
	if(this.lives > 0){
		this.lives -= 1;
	}
};

// Add score
Player.prototype.scores = function() {
	this.score += 100;
	// Each time the score passes a thousand points, increase enemy speed
	if (this.score % 1000 === 0){
		setEnemyMaxSpeed();
	}
	// Each time the player reaches 4000 points, grant a new life to player
	if(this.score % 4000 === 0){
		this.lives += 1;
	}
};

// Set the player to initial position
Player.prototype.reset = function() {
	this.x = 215;
	this.y = 470;
	this.locked = true;
};

// Now instantiate your objects.
var player = new Player(215, 470);

var enemy1 = new Enemy();
var enemy2 = new Enemy();
var enemy3 = new Enemy();

var allEnemies = [enemy1, enemy2, enemy3]; 

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
	var allowedKeys = {
		13: 'enter',
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};
	player.handleInput(allowedKeys[e.keyCode]);
});

// Stop the player from moving when key is no longer pressed
document.addEventListener('keyup', function() {
	player.locked = false;
	player.handleInput('none');
	});

// Generate a random number
function getRandom(max, min){
	return Math.floor(Math.random() * (max - min)) + min;
}

// Draw text on the canvas
function drawText (text, size, x,y) {
	ctx.font = size + "px Comic Sans MS";
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 5;
	ctx.strokeText(text, x, y);
	ctx.fillStyle = "yellow";
	ctx.fillText(text, x, y);	
}

// Set the enemy speed. If speed is not defined, increase speed by 20
function setEnemyMaxSpeed(maxSpeed){
	if (typeof maxSpeed === "undefined" || maxSpeed === null) {
		allEnemies.forEach(function(enemy) {
			enemy.maxSpeed += 20;
		});
	} else {
		allEnemies.forEach(function(enemy) {
			enemy.maxSpeed = maxSpeed;
		});
	}
}