var _ = require('underscore');

function Ships() {
	this.list = {};
}

Ships.prototype.new = function(id, name) {
	// reconnection
	if (this.list[id]) {
		return;
	}

	// new connection
	this.list[id] = {};
	this.list[id].x = 0;
	this.list[id].y = 0;
	this.list[id].rotation = 0;
	this.list[id].speed = 0;
	this.list[id].torque = 0;
	this.list[id].name = name;
	
	console.log(name + " joined, id:" + id);
};

Ships.prototype.get = function(id) {
	return this.list[id];
};

Ships.prototype.del = function(id) {
	console.log(this.list[id].name + " left, id:" + id);
	delete this.list[id];
};

Ships.prototype.each = function(cb) {
	_.each(this.list, cb);
};

Ships.prototype.all = function() {
	return this.list;
};

module.exports = new Ships();