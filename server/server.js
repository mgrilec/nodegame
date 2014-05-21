var express = require('express');
var socketIo = require('socket.io');
var _ = require('underscore');
var app = express();

app.use(express.static('../client'));
app.get('/', function(req, res) {
	res.redirect('/index.html');
});

var server = app.listen(3000);

var io = require('socket.io').listen(server);
io.set("log level", 2);

var ships = {};
var server = {

	// server update rate per second
	tickRate: 60,
	dt: 1 / 60,

	// server network update rate per second
	updateRate: 30,
}

io.sockets.on('connection', function (socket) {
	socket.on('join_request', clientJoinRequestHandler);
	socket.on('client_update', clientUpdateHandler);
	socket.on('disconnect', clientDisconnectHandler);
});

function networkUpdate () {
	io.sockets.emit('server_update', {ships: ships});
}

function update() {
	for (var shipId in ships) {
		var ship = ships[shipId];
		ship.x += Math.cos(ship.rotation) * ship.speed * server.dt;
		ship.y += Math.sin(ship.rotation) * ship.speed * server.dt;
		ship.rotation += ship.torque * server.dt;

		ship.speed *= 0.9;
		ship.torque *= 0.9;
	}
}

function clientJoinRequestHandler(data) {
	var socket = this;
	var id = socket.id;
	var name = socket.name = data.name;
	socket.emit('join_response', { id: socket.id });

	ships[id] = {};
	ships[id].x = 0;
	ships[id].y = 0;
	ships[id].rotation = 0;
	ships[id].speed = 0;
	ships[id].torque = 0;
	ships[id].name = name;
	console.log(name + " joined, id:" + id);
}

function clientUpdateHandler(data) {
	var socket = this;
	var id = socket.id;

	if(data.action == 'left') {
		ships[id].torque = -5;
	}
	else if (data.action == 'right') {
		ships[id].torque = 5;
	}
	else if (data.action == 'up') {
		ships[id].speed = 200;
	}
	else if (data.action == 'down') {
		ships[id].speed = -200;
	}
}

function clientDisconnectHandler() {
	var socket = this;
	var id = socket.id;
	var name = socket.name;
	delete ships[id];
	console.log(name + " left, id:" + id);
}

setInterval(update, 1000 / server.tickRate);
setInterval(networkUpdate, 1000 / server.updateRate);
console.log('view the example on http://127.0.0.1:3000');
