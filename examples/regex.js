const Telenode = require('../src/bot');
require('dotenv').config();

const bot = new Telenode({
	apiToken: process.env.API_TOKEN,
});

bot.createServer();

bot.onTextMessage(/asd/, async (messageBody) => {
	console.log(messageBody);
	await bot.sendTextMessage('Found a regex match!', messageBody.chat.id);
});
