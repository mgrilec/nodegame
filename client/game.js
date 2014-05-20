var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

var socket;
var player = {};
var ships = {};

function preload() {
    game.load.image('ship', 'assets/ship.png');
}

function create() {

    // init networking
    socket = io.connect(location.origin);

    // register handlers
    socket.on('join_response', joinResponseHandler);
    socket.on('server_update', serverUpdateHandler);

    // set world bounds
    game.world.setBounds(-10000, -10000, 20000, 20000);

    // player enters name
    player.name = prompt('enter name');

    // send auth
    socket.emit('join_request', { name: name });
}

function update() {

    // get current player ship
    var playerShip = ships[player.id];

    // camera follow player
    if (playerShip) {
        game.camera.focusOn(playerShip);
    }

    // controls
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        socket.emit('client_update', {
            action: 'left'
        });
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        socket.emit('client_update', {
            action: 'right'
        });
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        socket.emit('client_update', {
            action: 'up'
        });
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
        socket.emit('client_update', {
            action: 'down'
        });
    }
}

function render() {
	
}

function joinResponseHandler(data) {
    player.id = data.id;
}

function serverUpdateHandler(data) {
    // get all server ship ids
    var serverIds = [];
    for (var id in data.ships) {
        serverIds.push(id);
    }

    // remove ships with non-existent server ids
    for (var id in ships) {
        if (serverIds.indexOf(id) < 0) {
            ships[id].destroy();
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
            ships[id].angle = data.ships[id].angle;
            ships[id].anchor.setTo(0.5, 0.5);
            console.log('added: ' + id);
        }
    }

    // update ships
    for (var id in ships) {
        ships[id].x = data.ships[id].x;
        ships[id].y = data.ships[id].y;
        ships[id].angle = data.ships[id].angle;
    }
}