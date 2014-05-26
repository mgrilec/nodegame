var entity = require('./');
var settings = require('../config/settings');

var Ship = function(name) {
	this.x = 0;
	this.y = 0;
	this.rotation = 0;
	this.speed = 0;
	this.torque = 0;
	this.name = name;
}

Ship.prototype.update = function(dt) {
	this.x += Math.cos(this.rotation) * this.speed * dt;
	this.y += Math.sin(this.rotation) * this.speed * dt;
	this.rotation += this.torque * dt;

	// drag the speed
	var moveDrag = settings.game.ship.moveDrag * dt;
	if (Math.abs(this.speed) < moveDrag) {
		this.speed = 0;
	} else {
		this.speed -= this.speed / Math.abs(this.speed) * moveDrag;
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
