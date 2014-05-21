var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

var socket;
var player = {};
var ships = {};
var groups = { background: '', ships: '', labels: '' };
var state = "joining";

function preload() {
    game.load.image('ship', 'assets/ship.png');
    game.load.image('background', 'assets/background.png');
    game.load.image('background_detail', 'assets/background_detail.png');
    game.load.bitmapFont('visitor', 'assets/fonts/visitor.png', 'assets/fonts/visitor.xml');
}

function create() {

    // init networking
    socket = io.connect(location.origin);

    // register handlers
    socket.on('join_response', joinResponseHandler);
    socket.on('server_update', serverUpdateHandler);

    // init groups
    for (var groupName in groups)
        groups[groupName] = game.add.group();

    // player enters name
    player.name = prompt('enter name');

    // send auth
    socket.emit('join_request', { name: player.name });
}

// sets up game based on initial join data
function initialize(data) {

    // set world bounds
    game.world.setBounds(-data.bounds.x / 2, -data.bounds.y / 2, data.bounds.x, data.bounds.y);

    // create background
    var background = game.add.tileSprite(-data.bounds.x / 2, -data.bounds.y / 2, data.bounds.x, data.bounds.y, 'background');
    var backgroundDetail = game.add.tileSprite(-data.bounds.x / 2, -data.bounds.y / 2, data.bounds.x, data.bounds.y, 'background_detail');
    groups.background.add(background);
    groups.background.add(backgroundDetail);

    state = "ingame";
}

function update() {

    if (state != "ingame")
        return;

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
    initialize(data);
}

function serverUpdateHandler(data) {
    // get all server ship ids
    var serverIds = Object.keys(data.ships);

    // remove ships with non-existent server ids
    for (var id in ships) {
        if (serverIds.indexOf(id) < 0) {
            console.log('deleting ship: ' + ships[id].name);
            ships[id].kill();
            delete ships[id];
        }
    }

    // add ships with non-existent local ids
    for (var idIndex in serverIds) {
        var id = serverIds[idIndex];
        if (!ships[id]) {
            console.log('adding ship: ' + ships[id].name);
            ships[id] = new Ship(game, id, data.ships[id]);
        }
    }

    // update ships
    for (var id in ships) {
        ships[id].server_update(data.ships[id]);
    }
}