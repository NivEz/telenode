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
		}
	}

	onTextMessage(message, handler) {
		if (typeof message === 'string') {
			if (message === '') {
				this.anyTextHandler = handler;
			} else {
				this.textHandlers[message] = handler;
			}
		} else if (message instanceof RegExp) {
			this.arrRegexHandlers.push({
				pattern: message,
				handler,
			});
		}
	}

	async sendTextMessage(text, chatId) {
		const url = this.#baseUrl + '/sendMessage';
		await axios.post(url, {
			chat_id: chatId,
			text,
		});
	}

	async sendInlineKeyboard(chatId, text, inlineKeyboard) {
		if (!text) {
			throw Error('text parameter is required');
		}
		const url = this.#baseUrl + '/sendMessage';
		await axios.post(url, {
			chat_id: chatId,
			text,
			reply_markup: {
				inline_keyboard: inlineKeyboard,
			},
		});
	}
}

module.exports = Telenode;
