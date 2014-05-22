var settings = require('./config/settings');
var website = require('./website');
var entity = require('./entity');
var event = require('./event');

var io = require('socket.io').listen(website);
io.set("log level", 2);

io.sockets.on('connection', function (socket) {
	socket.on('join_request', event.connect.clientJoinRequestHandler);
	socket.on('client_update', event.action.clientUpdateHandler);
	socket.on('disconnect', event.connect.clientDisconnectHandler);
});

function networkUpdate () {
	io.sockets.emit('server_update', {ships: entity.Ships.all()});
}

function update() {
	entity.Ships.update(settings.dt);
}

setInterval(update, 1000 / settings.tickRate);
setInterval(networkUpdate, 1000 / settings.updateRate);
