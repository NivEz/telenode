const { runServer } = require('./server');

class TeleNode {
	#baseUrl;

	constructor({ apiToken }) {
		this.textHandlers = {};
		this.#baseUrl = 'https://api.telegram.org/bot' + apiToken;
	}

	createServer() {
		runServer(this);
	}

	messageHandler(receivedMessage) {
		if (receivedMessage.text) {
			const textHandler = this.textHandlers[receivedMessage.text];
			if (textHandler) textHandler(receivedMessage);
		}
	};

	onTextMessage(message, handler) {
		this.textHandlers[message] = handler;
	};
}

module.exports = TeleNode;
