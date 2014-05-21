var website = require('./website');
var Ships = require('./entity/ships');

var io = require('socket.io').listen(website);
io.set("log level", 2);

var server = {

	// update rate per second
	tickRate: 60,
	dt: 1 / 60,

	// network update rate per second
	updateRate: 30,
};

io.sockets.on('connection', function (socket) {
	socket.on('join_request', clientJoinRequestHandler);
	socket.on('client_update', clientUpdateHandler);
	socket.on('disconnect', clientDisconnectHandler);
});

function networkUpdate () {
	io.sockets.emit('server_update', {ships: Ships.all()});
}

function update() {
	Ships.update(server.dt);
}

function clientJoinRequestHandler(data) {
	var socket = this;
	var id = socket.id;
	var name = data.name;
	socket.emit('join_response', { id: socket.id });
	Ships.new(id, name);
}

function clientUpdateHandler(data) {
	var socket = this;
	var id = socket.id;
	var ship = Ships.get(id);

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
}

function clientDisconnectHandler() {
	var socket = this;
	var id = socket.id;
	Ships.del(id);
}

setInterval(update, 1000 / server.tickRate);
setInterval(networkUpdate, 1000 / server.updateRate);
console.log('view the example on http://127.0.0.1:3000');
