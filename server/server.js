var io = require('socket.io').listen(3000);

io.sockets.on('connection', function (socket) {
  
});



function update () {
	io.sockets.emit('sever_update', { hello: 'world'});
}

setInterval(update, 1000);