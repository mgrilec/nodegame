var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update,
    //render: render
});

var socket;
var name;
var ships = {};

function preload() {
	game.load.image('ship', 'assets/ship.png');
}

function create() {
	socket = io.connect('http://box.mgrilec.com:3000');
	socket.on('server_update', function (data) {

		// get all server ship ids
		var serverIds = [];
		for(var id in data.ships) {
			serverIds.push(id);
		}

		// remove ships with non-existent server ids
		for (var id in ships) {
			if (serverIds.indexOf(id) < 0) {
				delete ships[id];
				console.log('deleted: ' + id);
			}
		}

		// add ships with non-existent local ids
		for (var idIndex in serverIds) {
			var id = serverIds[idIndex];
			if (!ships[id]) {
				ships[id] = game.add.sprite(0, 0, 'ship');
				ships[id].x = data.ships[id].x;
				ships[id].y = data.ships[id].y;
				console.log('added: ' + id);
			}
		}

		// update ships
		for (var id in ships) {
			ships[id].x = data.ships[id].x;
			ships[id].y = data.ships[id].y;
		}

	});

	// player enters name
	name = prompt('enter name');

	// set world bounds
	game.world.setBounds(-2000, -2000, 4000, 4000);
}

function update() {

	// get current player ship
	var player = ships[name];

	// camera follow player
	if (player) {
		game.camera.focusOn(player);
	}

	// controls
	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
	{
		socket.emit('client_update', { id: name, key: 'left' });
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
	{
		socket.emit('client_update', { id: name, key: 'right' });
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
	{
		socket.emit('client_update', { id: name, key: 'up' });
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
	{
		socket.emit('client_update', { id: name, key: 'down' });
	}
}