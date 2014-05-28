var entity = require('./');
var settings = require('../config/settings');
var math = require('../math');

var Ship = function(name) {
	this.x = 0;
	this.y = 0;
	this.rotation = 0;
	this.speed = new math.point(0, 0);
	this.torque = 0;
	this.name = name;
}

Ship.prototype.update = function(dt) {
	this.x += this.speed.x * dt;
	this.y += this.speed.y * dt;
	this.rotation += this.torque * dt;

	// drag the speed
	var speedLenght = this.speed.length();
	var speedNormalized = this.speed.normalize();
	var moveDrag = settings.game.ship.moveDrag * dt;
	if (speedLenght < moveDrag) {
		this.speed.x = 0;
		this.speed.y = 0;
	} else {
		this.speed = this.speed.sub(speedNormalized.mul(moveDrag));
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
