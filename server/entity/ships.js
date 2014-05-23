var _ = require('underscore');
var Ship = require('./ship');

function Ships() {
	this.list = {};
}

Ships.prototype.new = function(id, name) {
	// reconnection
	if (this.list[id]) {
		console.log('reconnection!');
		return false;
	}

	// new connection
	this.list[id] = new Ship(name);
	console.log(name + " joined, id:" + id);
	return true;
};

Ships.prototype.get = function(id) {
	return this.list[id];
};

Ships.prototype.del = function(id) {
	var list = this.list;
	var ship = list[id];
	if (!ship) return;

	ship.disconnect = true;
	setTimeout(function() {
		if (ship.disconnect) {
			console.log(list[id].name + " left, id:" + id);
			delete list[id];
		}
	}, 10 * 1000);
};

Ships.prototype.each = function(cb) {
	_.each(this.list, cb);
};

Ships.prototype.update = function(dt) {
	this.each(function(ship, id) {
		ship.update(dt);
	});
}

Ships.prototype.all = function() {
	return this.list;
};

module.exports = new Ships();
