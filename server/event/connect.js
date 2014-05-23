var settings = require('../config/settings');
var entity = require('../entity');

function clientJoinRequestHandler(data) {
	console.log('clientJoinRequestHandler');
	var socket = this;
	var id = socket.handshake.id;
	var name = socket.name = data.name;

	entity.Ships.new(id, name)
	socket.emit('join_response', { id: id, bounds: settings.bounds });

	// 	socket.emit('reconnection', { });
}

function clientDisconnectHandler() {
	var socket = this;
	var id = socket.handshake.id;
	entity.Ships.del(id);
}

module.exports = {
	clientJoinRequestHandler: clientJoinRequestHandler,
	clientDisconnectHandler: clientDisconnectHandler
};