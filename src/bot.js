const { runServer } = require('./server');
const axios = require('axios');

class Telenode {
	#baseUrl;

	constructor({ apiToken }) {
		this.textHandlers = {};
		this.anyTextHandler = null;
		this.#baseUrl = 'https://api.telegram.org/bot' + apiToken;
	}

	createServer() {
		runServer(this);
	}

	messageHandler(receivedMessage) {
		if (receivedMessage.text) {
			const textHandler = this.textHandlers[receivedMessage.text];
			if (textHandler) {
				textHandler(receivedMessage);
			} else if (this.anyTextHandler) {
				this.anyTextHandler(receivedMessage);
			}
		}
	};

	onTextMessage(message, handler) {
		if (message === undefined) {
			this.anyTextHandler = handler;
		} else {
			this.textHandlers[message] = handler;
		}
	};

	async sendTextMessage(text, chatId) {
		const url = this.#baseUrl + '/sendMessage';
		await axios.post(url, {
			chat_id: chatId,
			text,
		});
	}
}

module.exports = Telenode;
