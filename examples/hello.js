const TeleNode = require('../src/bot');
require('dotenv').config();

const bot = new TeleNode({
	apiToken: process.env.API_TOKEN,
});

bot.createServer();

bot.onTextMessage('hello', async (messageBody) => {
	console.log(messageBody);
});
