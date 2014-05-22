var io = require('../io');
var entity = require('../entity');
var settings = require('../config/settings');

function networkUpdate() {
	io.sockets.emit('server_update', {ships: entity.Ships.all()});
}

function shipsUpdate() {
	entity.Ships.update(settings.dt);
}

module.exports = {
	network: networkUpdate,
	ships: shipsUpdate
};