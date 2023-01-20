const { runServer } = require('./server');

class TeleNode {
	constructor() {
		this.textHandlers = {};
	}

	createServer() {
		runServer(this);
	}

	textMessageHandler(receivedMessage) {
		this.textHandlers[receivedMessage] && this.textHandlers[receivedMessage]();
	};

	onTextMessage(message, handler) {
		this.textHandlers[message] = handler;
	};
}

module.exports = TeleNode;
