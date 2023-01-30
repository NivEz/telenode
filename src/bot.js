const { runServer } = require('./server');
const axios = require('axios');
const { stringToRegex } = require('../utils/stringToRegex');

class Telenode {
	#baseUrl;

	constructor({ apiToken }) {
		this.textHandlers = {};
		this.regexHandlers = {};
		this.arrRegex = [];
		this.anyTextHandler = null;
		this.#baseUrl = 'https://api.telegram.org/bot' + apiToken;
	}

	createServer() {
		runServer(this);
	}

	messageHandler(receivedMessage) {
		const msg = receivedMessage.text;
		if (msg) {
			const textHandler = this.textHandlers[msg];
			if (textHandler) {
				textHandler(receivedMessage);
			} else if (this.arrRegex.length) {
				this.arrRegex.forEach(re => {
					if (msg.match(re.pattern)) {
						re.handler(receivedMessage);
					}
				});
			} else if (this.anyTextHandler) {
				this.anyTextHandler(receivedMessage);
			}
		}
	};

	onTextMessage(message, handler) {
		if (message === undefined) {
			this.anyTextHandler = handler;
		} else {
			if (message instanceof RegExp) {
				this.regexHandlers[message] = handler;
				this.arrRegex.push({
					pattern: message, handler,
				});
			} else {
				this.textHandlers[message] = handler;
			}
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


// else if (Object.keys(this.regexHandlers).length) {
// 	for (const key in this.regexHandlers) {
// 		console.log('-> key', key);
// 		const re = stringToRegex(key)
// 		console.log("-> re", re);
// 		const matches = msg.match(re);
// 		console.log("-> matches", matches);
// 		if (matches) {
// 			console.log('MATCH!!!!');
// 			const regexHandler = this.regexHandlers[key];
// 			regexHandler(receivedMessage);
// 			break;
// 		}
// 	}
// }
