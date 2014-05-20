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

io.sockets.on('connection', function (socket) {
	socket.on('client_join', clientJoinHandler);
	socket.on('client_update', clientUpdateHandler);
	socket.on('disconnect', clientDisconnectHandler);
});

function networkUpdate () {
	io.sockets.emit('server_update', {ships: ships});
}

function update() {
	for (var shipId in ships) {
		var ship = ships[shipId];
		ship.x += Math.cos(ship.angle * Math.PI / 180) * ship.speed;
		ship.y += Math.sin(ship.angle * Math.PI / 180) * ship.speed;
		ship.angle += ship.torque;

		ship.speed *= 0.9;
		ship.torque *= 0.9;
	}
}

function clientJoinHandler(data) {
	var socket = this;
	var id = data.id;
	socket.name = data.id;
	ships[id] = {};
	ships[id].x = 0;
	ships[id].y = 0;
	ships[id].angle = 0;
	ships[id].speed = 0;
	ships[id].torque = 0;
	console.log(data.id + " joined");
}

function clientUpdateHandler(data) {
	var socket = this;
	var id = socket.name;

	if(data.action == 'left') {
		ships[id].torque = -3;
	}
	else if (data.action == 'right') {
		ships[id].torque = 3;
	}
	else if (data.action == 'up') {
		ships[id].speed = 5;
	}
	else if (data.action == 'down') {
		ships[id].speed = -5;
	}
}

function clientDisconnectHandler() {
	var socket = this;
	var id = socket.name;
	delete ships[id];
	console.log(id + " left");
}

setInterval(update, 10);
setInterval(networkUpdate, 30);
console.log('view the example on http://127.0.0.1:3000');
