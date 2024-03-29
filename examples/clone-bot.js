const Telenode = require('../src/bot');

const bot = new Telenode({
	apiToken: process.env.API_TOKEN,
});

bot.createServer();

bot.onTextMessage('', async messageBody => {
	await bot.sendTextMessage(messageBody.text, messageBody.chat.id);
});
