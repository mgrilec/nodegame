var io = require('../io');
var entity = require('../entity');
var settings = require('../config/settings');

function networkUpdate() {

	// create map
	var map = {};
	

	io.sockets.emit('server_update', {ships: entity.Ships.all(), bullets: entity.Bullets.all()});
}

function update() {
	entity.Ships.update(settings.dt);
	entity.Bullets.update(settings.dt);
}

module.exports = {
	network: networkUpdate,
	update: update
};