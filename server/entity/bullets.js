var _ = require('underscore');
var Bullet = require('./bullet');

function Bullets() {
	this.list = [];
}

// add new bullet
Bullets.prototype.new = function(owner) {
	this.list.push(new Bullet(this, owner));	
};

Bullets.prototype.del = function(index) {
	delete this.list[index];
};

Bullets.prototype.each = function(cb) {
	_.each(this.list, cb);
};

Bullets.prototype.update = function(dt) {
	this.each(function(bullet, index) {
		bullet.update(dt);
		if (bullet.dead) {
			this.manager.del(index);
		}
	});
}

Bullets.prototype.all = function() {
	return this.list;
};

module.exports = new Bullets();