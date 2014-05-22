var settings = require('../config/settings');
var entity = require('../entity');

function clientJoinRequestHandler(data) {
	var socket = this;
	var id = socket.id;
	var name = socket.name = data.name;
	socket.emit('join_response', { id: socket.id, bounds: settings.bounds });
	entity.Ships.new(id, name);
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