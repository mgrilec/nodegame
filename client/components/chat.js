var Chat = function(game) {

	var self = this;

	// set properties
	Phaser.BitmapText.call(this, game, 5, 5, 'visitor', '', 16);
    this.fixedToCamera = true;
    this.log = [{ name: 'System', msg: 'Welcome!' }, ];
    this.chatInputElement = document.getElementById('chat_input');
    this.chatSendElement = document.getElementById('chat_send');

    // add to game
    game.add.existing(this);

    // submit on button press
    this.chatSendElement.onclick = function() {
        game.clientChatSay(self.chatInputElement.value);
        self.chatInputElement.value = "";
    }

    // submit on enter
    this.chatInputElement.onkeyup = function(e) {
        if (e.keyCode == 13) {
            game.clientChatSay(self.chatInputElement.value);
            self.chatInputElement.value = "";
        }
    }
}

// inherit from bitmap text
Chat.prototype = Object.create(Phaser.BitmapText.prototype);
Chat.prototype.constructor = Chat;

Chat.prototype.update = function() {
	var visibleEntries = this.log.slice(Math.max(0, this.log.length - 5));
	var text = '';
	for (var chatIndex in visibleEntries) {
	var chatEntry = visibleEntries[chatIndex];
	text += chatEntry.name + ": " + chatEntry.msg + '\n';
	}

	this.setText(text);
}