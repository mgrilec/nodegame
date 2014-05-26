var settings = require('../config/settings');
var entity = require('../entity');

function clientJoinRequestHandler(data) {
	console.log('clientJoinRequestHandler');
	var socket = this;
	var id = socket.id;
	var name = socket.name = data.name;

	entity.Ships.new(id, name)
	socket.emit('join_response', { id: id, bounds: settings.game.bounds });

	// 	socket.emit('reconnection', { });
}

function clientDisconnectHandler() {
	var socket = this;
	var id = socket.id;
	entity.Ships.del(id);
}

module.exports = {
	clientJoinRequestHandler: clientJoinRequestHandler,
	clientDisconnectHandler: clientDisconnectHandler
};