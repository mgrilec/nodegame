var Bullet = function(owner) {
	this.x = owner.x;
	this.y = owner.y;
	this.rotation = owner.rotation;
	this.speed = 1000;
	this.range = 500;
	this.distance = 0;
	this.owner = owner;
	this.dead = false;
}

Bullet.prototype.update = function(dt) {
	this.x += Math.cos(this.rotation) * this.speed * dt;
	this.y += Math.sin(this.rotation) * this.speed * dt;
	this.distance += this.speed * dt;
	if (this.distance > this.range) {
		this.kill();
	}
}

Bullet.prototype.kill = function() {
	this.dead = true;
}

module.exports = Bullet;