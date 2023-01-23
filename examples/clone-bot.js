const TeleNode = require('../src/bot');
require('dotenv').config();

const bot = new TeleNode({
	apiToken: process.env.API_TOKEN,
});

bot.createServer();

bot.onTextMessage(undefined, async (messageBody) => {
	await bot.sendTextMessage(messageBody.text, messageBody.chat.id);
});
