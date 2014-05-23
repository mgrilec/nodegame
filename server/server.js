var settings = require('./config/settings');
var entity = require('./entity');
var event = require('./event');
var io = require('./io');

io.sockets.on('connection', function (socket) {
	socket.on('join_request', event.connect.clientJoinRequestHandler);
	socket.on('client_update', event.action.clientUpdateHandler);
	socket.on('disconnect', event.connect.clientDisconnectHandler);
	socket.on('say', event.chat.clientSay);
});

setInterval(event.update.update, 1000 / settings.tickRate);
setInterval(event.update.network, 1000 / settings.updateRate);
