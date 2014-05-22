var website = require('./website');
var io = require('socket.io').listen(website);

// config io here
io.set("log level", 2);

// prepare to use connect.session.id

module.exports = io;