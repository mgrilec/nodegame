var express = require('express');
var socketIo = require('socket.io');
var app = express();

app.use(express.static('../client'));
app.get('/', function(req, res) {
	res.redirect('/index.html');
});

var server = app.listen(3000);

var io = require('socket.io').listen(server);
io.set("log level", 2);
var ships = {};
var sockets = {};

io.sockets.on('connection', function (socket) {
	socket.on('client_update', function(data) {

		sockets[data.id] = socket;

		if(!ships[data.id]) {
			ships[data.id] = {};
			ships[data.id].x = 0;
			ships[data.id].y = 0;
			ships[data.id].angle = 0;
			ships[data.id].speed = 0;
			ships[data.id].torque = 0;
		}

		var ship = ships[data.id];
		
		if(data.key == 'left') {
			ship.torque = -3;
		}
		else if (data.key == 'right') {
			ship.torque = 3;
		}
		else if (data.key == 'up') {
			ship.speed = 5;
		}
		else if (data.key == 'down') {
			ship.speed = -5;
		}
	});

	socket.on('disconnect', function () {
		for(var id in sockets) {
			if(sockets[id] == socket){
				delete sockets[id];
				delete ships[id];
				break;
			}
		}
	});
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

setInterval(update, 10);
setInterval(networkUpdate, 30);
console.log('view the example on http://127.0.0.1:3001');
