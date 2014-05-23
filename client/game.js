var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
    preload: this.preload,
    create: this.create,
    update: this.update,
    render: this.render
});

game.socket;
game.player = {};
game.ships = {};
game.groups = { background: '', ships: '', labels: '' };

function preload() {
    game.load.image('ship', 'assets/ship.png');
    game.load.image('background', 'assets/background.png');
    game.load.image('background_detail', 'assets/background_detail.png');
    game.load.bitmapFont('visitor', 'assets/fonts/visitor.png', 'assets/fonts/visitor.xml');
}

function create() {

    // init networking
    game.socket = io.connect(location.origin);

    // register handlers
    game.socket.on('join_response', game.joinResponseHandler);
    game.socket.on('server_update', game.serverUpdateHandler);
    game.socket.on('reconnection', game.reconnectionHandler);
    game.socket.on('say', game.serverChatSay);

    // init groups
    for (var groupName in game.groups)
        game.groups[groupName] = game.add.group();

    // init chat
    game.chat = new Chat(game);

    // player enters name
    game.player.name = prompt('enter name');

    // send auth
    game.socket.emit('join_request', { name: game.player.name });

    // fire
    game.socket.on('ship_fire', game.shipFireHandler);
}

// sets up game based on initial join data
game.initialize = function(data) {

    // set world bounds
    game.world.setBounds(-data.bounds.x / 2, -data.bounds.y / 2, data.bounds.x, data.bounds.y);

    // create background
    var background = game.add.tileSprite(-data.bounds.x / 2, -data.bounds.y / 2, data.bounds.x, data.bounds.y, 'background');
    var backgroundDetail = game.add.tileSprite(-data.bounds.x / 2, -data.bounds.y / 2, data.bounds.x, data.bounds.y, 'background_detail');
    game.groups.background.add(background);
    game.groups.background.add(backgroundDetail);
}

function update() {

    // get current player ship
    var playerShip = game.ships[game.player.id];

    // camera follow player
    if (playerShip) {
        game.camera.focusOn(playerShip);
    }

    // controls
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        game.socket.emit('client_update', {
            action: 'left'
        });
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        game.socket.emit('client_update', {
            action: 'right'
        });
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        game.socket.emit('client_update', {
            action: 'up'
        });
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
        game.socket.emit('client_update', {
            action: 'down'
        });
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        game.socket.emit('client_update', {
            action: 'fire'
        });
    }
}

function render() {
	
}

game.joinResponseHandler = function(data) {
    game.player.id = data.id;
    game.initialize(data);
}

game.serverUpdateHandler = function(data) {
    // get all server ship ids
    var serverIds = Object.keys(data.ships);

    // remove ships with non-existent server ids
    for (var id in game.ships) {
        if (serverIds.indexOf(id) < 0) {
            console.log('deleting ship: ' + game.ships[id].name);
            game.ships[id].kill();
            delete game.ships[id];
        }
    }

    // add ships with non-existent local ids
    for (var idIndex in serverIds) {
        var id = serverIds[idIndex];
        if (!game.ships[id]) {
            console.log('adding ship: ' + data.ships[id].name);
            game.ships[id] = new Ship(game, id, data.ships[id]);
        }
    }

    // update ships
    for (var id in game.ships) {
        game.ships[id].server_update(data.ships[id]);
    }
}

game.reconnectionHandler = function(data) {
    console.log(data);
    game.socket.close();
}

game.shipFireHandler = function(data) {
    console.log(data);
}

game.serverChatSay = function(data) {
    game.chat.log.push(data);
}

game.clientChatSay = function(content) {
    game.socket.emit('say', {
        msg: content
    });
}