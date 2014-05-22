var website = require('./website');
var entity = require('./entity');

var io = require('socket.io').listen(website);
io.set("log level", 2);

var settings = {

	// game bounds
	bounds: { x: 20000, y: 20000 },

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
	io.sockets.emit('server_update', {ships: entity.Ships.all()});
}

function update() {
	entity.Ships.update(settings.dt);
}

function clientJoinRequestHandler(data) {
	var socket = this;
	var id = socket.id;
	var name = data.name;
	socket.emit('join_response', { id: socket.id, bounds: settings.bounds });
	entity.Ships.new(id, name);
}

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
}

function clientDisconnectHandler() {
	var socket = this;
	var id = socket.id;
	entity.Ships.del(id);
}

setInterval(update, 1000 / settings.tickRate);
setInterval(networkUpdate, 1000 / settings.updateRate);
console.log('view the example on http://127.0.0.1:3000');
