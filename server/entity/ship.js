var entity = require('./');
var settings = require('../config/settings');

var Ship = function(name) {
	this.x = 0;
	this.y = 0;
	this.rotation = 0;
	this.speed = { x: 0, y: 0 };
	this.torque = 0;
	this.name = name;
}

Ship.prototype.update = function(dt) {
	this.x += this.speed.x * dt;
	this.y += this.speed.y * dt;
	this.rotation += this.torque * dt;

	// drag the speed
	var speedLenght = Math.sqrt(this.speed.x * this.speed.x + this.speed.y * this.speed.y);
	var speedNormalized = { x: this.speed.x / speedLenght, y: this.speed.y / speedLenght };
	var moveDrag = settings.game.ship.moveDrag * dt;
	if (speedLenght < moveDrag) {
		this.speed.x = 0;
		this.speed.y = 0;
	} else {
		this.speed.x -= speedNormalized.x * moveDrag;
		this.speed.y -= speedNormalized.y * moveDrag;
	}

	// drag the rotation
	var turnDrag = settings.game.ship.turnDrag * dt;
	if (Math.abs(this.torque) < turnDrag) {
		this.torque = 0;
	} else {
		this.torque -= this.torque / Math.abs(this.torque) * turnDrag;
	}

};

Ship.prototype.fire = function() {
	return entity.Bullets.new(this);
};

module.exports = Ship;
