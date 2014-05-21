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
    game.load.bitmapFont('visitor', 'assets/fonts/visitor.png', 'assets/fonts/visitor.xml');
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
    socket.emit('join_request', { name: player.name });
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
    var serverIds = Object.keys(data.ships);

    // remove ships with non-existent server ids
    for (var id in ships) {
        if (serverIds.indexOf(id) < 0) {
            console.log('deleting: ' + ships[id].name);
            ships[id].label.destroy();
            ships[id].destroy();
            delete ships[id];
        }
    }

    // add ships with non-existent local ids
    for (var idIndex in serverIds) {
        var id = serverIds[idIndex];
        if (!ships[id]) {
            ships[id] = game.add.sprite(0, 0, 'ship');
            ships[id].x = data.ships[id].x;
            ships[id].y = data.ships[id].y;
            ships[id].rotation = data.ships[id].rotation;
            ships[id].name = data.ships[id].name;
            ships[id].anchor.setTo(0.5, 0.5);
            ships[id].label = game.add.bitmapText(0, -20, 'visitor', ships[id].name, 16);
            ships[id].label.owner = ships[id];
            if (id == player.id)
                ships[id].label.tint = 0xFF0000;
            ships[id].label.update = function() {
                this.x = this.owner.x - this.textWidth / 2;
                this.y = this.owner.y - 50;
            }
            console.log('added: ' + ships[id].name);
        }
    }

    // update ships
    for (var id in ships) {
        ships[id].x = data.ships[id].x;
        ships[id].y = data.ships[id].y;
        ships[id].rotation = data.ships[id].rotation;
        ships[id].label.update();
    }
}