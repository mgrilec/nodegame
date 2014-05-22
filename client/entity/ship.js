var Ship = function(game, id, data) {

	// set properties
	Phaser.Sprite.call(this, game, data.x, data.y, 'ship');
    this.rotation = data.rotation;
    this.name = data.name;
    this.anchor.setTo(0.5, 0.5);

    // kill label
    this.events.onKilled.add(function() {
    	this.label.kill();
    }, this);

    // add to game and group
    game.add.existing(this);
    groups.ships.add(this);

    // set label
    this.label = game.add.bitmapText(0, -20, 'visitor', this.name, 16);
    this.label.owner = this;
    if (id == player.id)
        this.label.tint = 0xFF0000;

    groups.labels.add(this.label);
    this.label.update = function() {
        this.x = this.owner.x - this.textWidth / 2;
        this.y = this.owner.y - 50;
    }
}

// inherit from sprite
Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;

Ship.prototype.update = function() {
    this.label.update();
}

Ship.prototype.server_update = function(data) {
	this.x = data.x;
    this.y = data.y;
    this.rotation = data.rotation;
    this.label.update();
}