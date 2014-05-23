var entity = require('./');

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

	this.speed *= 0.9;
	this.torque *= 0.9;
};

Ship.prototype.fire = function() {
	return entity.Bullets.new(this);
};

module.exports = Ship;