var _ = require('underscore');
var Bullet = require('./bullet');

function Bullets() {
	this.list = [];
}

// add new bullet
Bullets.prototype.new = function(owner) {
	var bullet = new Bullet(owner);
	this.list.push(bullet);
	return bullet;
};

Bullets.prototype.del = function(index) {
	delete this.list[index];
};

Bullets.prototype.each = function(cb) {
	_.each(this.list, cb);
};

Bullets.prototype.update = function(dt) {
	for (var bulletIndex in this.list) {
		var bullet = this.list[bulletIndex];
		bullet.update(dt);
		if (bullet.dead) {
			this.del(bulletIndex);
		}
	}
};

Bullets.prototype.all = function() {
	return this.list;
};

module.exports = new Bullets();
