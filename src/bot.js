const { runServer } = require('./server');
const { longPoll } = require('./longPolling');
const axios = require('axios');

class Telenode {
	#baseUrl;
	#secretToken;
	validChatActions = [
		'typing',
		'upload_photo',
		'record_video',
		'upload_video',
		'record_voice',
		'upload_voice',
		'upload_document',
		'choose_sticker',
		'find_location',
		'record_video_note',
		'upload_video_note',
	];

	constructor({ apiToken, secretToken }) {
		this.textHandlers = {};
		this.arrRegexHandlers = [];
		this.anyTextHandler = null;
		this.buttonHandlers = {};
		this.anyButtonHandler = null;
		this.#baseUrl = 'https://api.telegram.org/bot' + apiToken;
		this.#secretToken = secretToken;
		this.useLongPolling = false;
	}

	createServer({ port, unauthorizedCallback } = {}) {
		this.unauthorizedHandler = unauthorizedCallback;
		if (this.useLongPolling) {
			throw Error('Cannot start server while long polling is active');
		}
		runServer(this, port);
	}

	startLongPolling({ pollingDelay, cleanPreviousUpdates } = {}) {
		this.useLongPolling = true;
		longPoll({
			bot: this,
			pollingDelay,
			cleanPreviousUpdates,
			url: this.#baseUrl,
		});
	}

	telenodeHandler(reqBody, headersSecretToken, unauthorizedCallback) {
		// Note that if using long polling the secret token and unauthorizedCallback are irrelevant
		if (this.#secretToken && this.#secretToken !== headersSecretToken) {
			if (unauthorizedCallback) {
				unauthorizedCallback();
			}
			return;
		}
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
			return;
		}
		// Similar to the text message handler, this should be the final step to validate that no matches occurred
		if (this.anyButtonHandler) {
			this.anyButtonHandler(callbackQuery);
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
		if (typeof buttonDataTrigger !== 'string') {
			return;
		}
		if (buttonDataTrigger === '') {
			this.anyButtonHandler = handler;
		} else {
			this.buttonHandlers[buttonDataTrigger] = handler;
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

	async editInlineKeyboard(chatId, messageId, inlineMessageId, inlineKeyboard) {
		if (!inlineMessageId && (!chatId || !messageId)) {
			throw new Error(
				'inlineMessageId is required when chatId and messageId are not specified',
			);
		}
		const url = this.#baseUrl + '/editMessageReplyMarkup';
		return await axios.post(url, {
			chat_id: chatId,
			message_id: messageId,
			inline_message_id: inlineMessageId,
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

	async sendChatAction(chatId, chatAction) {
		if (!this.validChatActions.includes(chatAction)) {
			throw new Error(
				`Invalid chat action. Valid chat action should be one of: ${this.validChatActions.join(
					', ',
				)}`,
			);
		}
		const url = this.#baseUrl + '/sendChatAction';
		await axios.post(url, {
			chat_id: chatId,
			action: chatAction,
		});
	}
}

module.exports = Telenode;
