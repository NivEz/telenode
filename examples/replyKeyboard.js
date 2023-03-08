const Telenode = require('../src/bot');
require('dotenv').config();

const bot = new Telenode({
	apiToken: process.env.API_TOKEN,
});

bot.createServer();

bot.onTextMessage('start', messageBody => {
	bot.sendReplyKeyboard(
		messageBody.chat.id,
		'Click on one of the keyboard buttons...',
		inlineKeyboard,
	);
});

bot.onTextMessage('one time keyboard', messageBody => {
	bot.sendReplyKeyboard(
		messageBody.chat.id,
		'Now the keyboard will be closed after each type (except for start button which initialize the buttons again)',
		inlineKeyboard,
		true,
	);
});

bot.onTextMessage('Remove', messageBody => {
	bot.removeReplyKeyboard(messageBody.chat.id, 'Removed keyboard...');
});

const inlineKeyboard = [
	[
		{
			text: 'start',
		},
		{
			text: 'one time keyboard',
		},
	],
	[
		{
			text: 'Say hello',
		},
		{
			text: 'Say bye',
		},
	],
	[
		{
			text: 'Remove',
		},
	],
];
