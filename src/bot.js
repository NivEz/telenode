const { runServer } = require('./server');
const axios = require('axios');

class Telenode {
	#baseUrl;

	constructor({ apiToken }) {
		this.textHandlers = {};
		this.arrRegexHandlers = [];
		this.anyTextHandler = null;
		this.#baseUrl = 'https://api.telegram.org/bot' + apiToken;
	}

	createServer() {
		runServer(this);
	}

	messageHandler(receivedMessage) {
		const msg = receivedMessage.text;
		if (!msg) {
			return;
		}

		const textHandler = this.textHandlers[msg];
		if (textHandler) {
			textHandler(receivedMessage);
			return;
		}
		this.arrRegexHandlers.some(re => {
			const isMatch = msg.match(re.pattern);
			if (isMatch) {
				re.handler(receivedMessage);
				// Return true to stop the loop
				return true;
			}
		});
		// This should be the final step to validate that no matches occurred
		if (this.anyTextHandler) {
			this.anyTextHandler(receivedMessage);
			return;
		}
	};

	onTextMessage(message, handler) {
		if (message === undefined) {
			this.anyTextHandler = handler;
		} else if (message instanceof RegExp) {
			this.arrRegexHandlers.push({
				pattern: message,
				handler,
			});
		} else if (typeof message === 'string') {
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

