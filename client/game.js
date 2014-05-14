var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
    //preload: preload,
    create: create,
    //update: update,
    //render: render
});

function create() {
	var socket = io.connect('http://localhost:3000');
	  socket.on('server_update', function (data) {
	    console.log(data);
	  });

	  socket.emit('client_update', { id: "me" });

	  console.log("hi");
}