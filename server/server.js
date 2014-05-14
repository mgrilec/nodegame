<<<<<<< HEAD
=======
// test
>>>>>>> 351076a0305c6427a6eeb1a6dc9d3c563e1a43cb
var io = require('socket.io').listen(3000);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});