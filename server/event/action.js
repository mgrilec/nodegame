var entity = require('../entity');

function clientUpdateHandler(data) {
	var socket = this;
	var id = socket.id;
	var ship = entity.Ships.get(id);

	if(data.action == 'left') {
		ship.torque = -5;
	}
	else if (data.action == 'right') {
		ship.torque = 5;
	}
	else if (data.action == 'up') {
		ship.speed = 200;
	}
	else if (data.action == 'down') {
		ship.speed = -200;
	}
	else if (data.action == 'fire') {
		// entity.Bullets.new(ship);
	}
}

module.exports = {
	clientUpdateHandler: clientUpdateHandler
};