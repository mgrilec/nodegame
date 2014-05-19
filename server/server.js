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
		}
		
		if(data.key == 'left') {
			ships[data.id].x -= 5;
		}
		else if (data.key == 'right') {
			ships[data.id].x += 5;
		}
		else if (data.key == 'up') {
			ships[data.id].y -=5;
		}
		else if (data.key == 'down') {
			ships[data.id].y += 5;
		}
	});

	socket.on('disconnect', function () {
		for(var id in sockets) {
			if(sockets[id] == socket){
				console.log(id);
				delete ships[id];
			}
		}
	});
});

function networkUpdate () {
	io.sockets.emit('server_update', {ships: ships});
}

setInterval(networkUpdate, 30);

console.log('view the example on http://127.0.0.1:3001');
