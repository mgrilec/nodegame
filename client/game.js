var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
    //preload: preload,
    create: create,
    update: update,
    //render: render
});

var socket;

function create() {
	socket = io.connect('http://localhost:3000');
	socket.on('server_update', function (data) {
		console.log(data);
	});
}

function update() {
	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
	{
		socket.emit('client_update', { id: 'me', key: 'left' });
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
	{
		socket.emit('client_update', { id: 'me', key: 'right' });
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
	{
		socket.emit('client_update', { id: 'me', key: 'up' });
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
	{
		socket.emit('client_update', { id: 'me', key: 'down' });
	}
}