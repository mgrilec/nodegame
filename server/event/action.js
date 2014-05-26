var entity = require('../entity');
var settings = require('../config/settings');

function clientUpdateHandler(data) {
	var socket = this;
	var id = socket.id;
	var ship = entity.Ships.get(id);

	if (!ship) {
		socket.emit('error', { level: 1, msg: 'ship not found' });
		return;
	}

	if(data.action == 'left') {
		ship.torque = -settings.game.ship.turnSpeed;
	}
	else if (data.action == 'right') {
		ship.torque = settings.game.ship.turnSpeed;
	}
	else if (data.action == 'up') {
		ship.speed = settings.game.ship.moveSpeed;
	}
	else if (data.action == 'down') {
		ship.speed = -settings.game.ship.moveSpeed;
	}
	else if (data.action == 'fire') {
		var bullet = ship.fire();
		socket.emit('ship_fire', { id: socket.id, bullet: bullet });
	}

	ship.disconnect = false;
}

module.exports = {
	clientUpdateHandler: clientUpdateHandler
};