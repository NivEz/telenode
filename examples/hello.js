const Telenode = require('../src/bot');

const bot = new Telenode({
	apiToken: process.env.API_TOKEN,
});

bot.createServer();

bot.onTextMessage('hello', async messageBody => {
	await bot.sendTextMessage('hello back', messageBody.chat.id);
});
