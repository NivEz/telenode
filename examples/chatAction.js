const Telenode = require('../src/bot');

const bot = new Telenode({
	apiToken: process.env.API_TOKEN,
});

bot.createServer();

bot.onTextMessage('', async messageBody => {
	await bot.sendTextMessage(
		'I will be taking a random action for five seconds',
		messageBody.chat.id,
	);
	const randomIdx = Math.floor(Math.random() * bot.validChatActions.length);
	await bot.sendChatAction(messageBody.chat.id, bot.validChatActions[randomIdx]);
	await sleep(5000);
	await bot.sendTextMessage(
		'The following API call will end the chat action',
		messageBody.chat.id,
	);
});

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
