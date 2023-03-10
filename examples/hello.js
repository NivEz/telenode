const Telenode = require('../src/bot');
require('dotenv').config();

const bot = new Telenode({
	apiToken: process.env.API_TOKEN,
	secretToken: process.env.SECRET_TOKEN,
});

bot.createServer();

bot.onTextMessage('hello', async messageBody => {
	await bot.sendTextMessage('hello back', messageBody.chat.id);
});
