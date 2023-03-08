const { runServer } = require('./server');
const axios = require('axios');

class Telenode {
	#baseUrl;

	constructor({ apiToken }) {
		this.textHandlers = {};
		this.arrRegexHandlers = [];
		this.anyTextHandler = null;
		this.buttonHandlers = {};
		this.#baseUrl = 'https://api.telegram.org/bot' + apiToken;
	}

	createServer() {
		runServer(this);
	}

	telenodeHandler(reqBody) {
		// TODO - get message type and use switch case for the types
		if (!reqBody) {
			return;
		}
		if (reqBody.message) {
			this.textMessageHandler(reqBody.message);
		}
		if (reqBody.callback_query) {
			this.inlineMarkupHandler(reqBody.callback_query);
		}
	}

	textMessageHandler(receivedMsg) {
		const msg = receivedMsg.text;
		if (!msg) {
			return;
		}

		const textHandler = this.textHandlers[msg];
		if (textHandler) {
			textHandler(receivedMsg);
			return;
		}
		this.arrRegexHandlers.some(re => {
			const isMatch = msg.match(re.pattern);
			if (isMatch) {
				re.handler(receivedMsg);
				// Return true to stop the loop
				return true;
			}
		});
		// This should be the final step to validate that no matches occurred
		if (this.anyTextHandler) {
			this.anyTextHandler(receivedMsg);
		}
	}

	inlineMarkupHandler(callbackQuery) {
		const buttonData = callbackQuery.data;
		if (!buttonData) {
			return;
		}
		const buttonHandler = this.buttonHandlers[buttonData];
		if (buttonHandler) {
			buttonHandler(callbackQuery);
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

	onButton(buttonDataTrigger, handler) {
		if (!buttonDataTrigger || typeof buttonDataTrigger !== 'string') {
			return;
		}
		this.buttonHandlers[buttonDataTrigger] = handler;
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

	async sendReplyKeyboard(chatId, text, replyKeyboard, oneTimeKeyboard) {
		if (!text) {
			throw Error('text parameter is required');
		}
		const url = this.#baseUrl + '/sendMessage';
		await axios.post(url, {
			chat_id: chatId,
			text,
			reply_markup: {
				keyboard: replyKeyboard,
				one_time_keyboard: oneTimeKeyboard,
			},
		});
	}

	async removeReplyKeyboard(chatId, text) {
		const url = this.#baseUrl + '/sendMessage';
		await axios.post(url, {
			chat_id: chatId,
			text: text,
			reply_markup: {
				remove_keyboard: true,
			},
		});
	}
}

module.exports = Telenode;
