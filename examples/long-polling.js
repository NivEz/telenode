const Telenode = require('../src/bot');

const bot = new Telenode({
	apiToken: process.env.API_TOKEN,
});

bot.startLongPolling({ pollingDelay: 2000 }); // default is 1000ms

// The usage is the same as using the webhook

bot.onTextMessage('hello', async messageBody => {
	await bot.sendReplyKeyboard(
		messageBody.chat.id,
		'Click on one of the keyboard buttons...',
		inlineKeyboard,
		true,
	);
});

const inlineKeyboard = [
	[
		{
			text: 'Hi!',
		},
		{
			text: 'Bye!',
		},
	],
];

// After 30 seconds the long polling will stop
setTimeout(() => {
	bot.useLongPolling = false;
}, 30000);
