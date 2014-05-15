var io = require('socket.io').listen(3000);

var ships = {};

io.sockets.on('connection', function (socket) {
	socket.on('client_update', function(data) {

		if(!ships[data.id]) {
			ships[data.id] = {};
			ships[data.id].x = 0;
			ships[data.id].y = 0;
		}
		
		if(data.key == 'left') {
			ships[data.id].y -= 5;
		}
		else if (data.key == 'right') {
			ships[data.id].y += 5;
		}
		else if (data.key == 'up') {
			ships[data.id].x -=5;
		}
		else if (data.key == 'down') {
			ships[data.id].x += 5;
		}


	});
});

function update () {
	io.sockets.emit('server_update', {ships: ships});
}

setInterval(update, 1000);