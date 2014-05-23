var website = require('./website');
var io = require('socket.io').listen(website);

// config io here
io.set("log level", 2);

// use connect.session.id
io.set('authorization', function(handshake, callback) {
	if (handshake.headers.cookie) {
		var signedCookies = require('express/node_modules/cookie').parse(handshake.headers.cookie);
		handshake.cookies = require('connect/lib/utils').parseSignedCookies(signedCookies, 'keyboard cat');
		handshake.id = handshake.cookies['connect.sid'];
	}
	callback(null, true);
});

module.exports = io;