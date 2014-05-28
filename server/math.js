var point = function(x, y) {
	this.x = x;
	this.y = y;
}

point.prototype.add = function(p) {
	return new point(this.x + p.x, this.y + p.y);
}

point.prototype.sub = function(p) {
	return new point(this.x - p.x, this.y - p.y);
}

point.prototype.mul = function(s) {
	return new point(this.x * s, this.y * s);
}

point.prototype.length = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y);
}

point.prototype.lengthSquared = function() {
	return this.x * this.x + this.y * this.y;
}

point.prototype.normalize = function() {
	var length = this.length();
	return new point(this.x / length, this.y / length);
}

module.exports = {
	point: point,
};