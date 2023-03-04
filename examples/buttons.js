const Telenode = require('../src/bot');
require('dotenv').config();

const bot = new Telenode({
	apiToken: process.env.API_TOKEN,
});

bot.createServer();

bot.onTextMessage('start', messageBody => {
	bot.sendInlineKeyboard(messageBody.chat.id, 'Menu', inlineKeyboard);
});

bot.onButton('start', callbackQuery => {
	bot.sendInlineKeyboard(callbackQuery.message.chat.id, 'Menu', inlineKeyboard);
});

bot.onButton('exit', callbackQuery => {
	const senderName = callbackQuery.from.first_name;
	bot.sendTextMessage(`Bye bye ${senderName}! See you next time`, callbackQuery.message.chat.id);
});

bot.onButton('welcome', callbackQuery => {
	const senderName = callbackQuery.from.first_name;
	bot.sendTextMessage(`Hello ${senderName}! How are you?`, callbackQuery.message.chat.id);
});

const inlineKeyboard = [
	[
		{
			text: 'Start',
			callback_data: 'start',
		},
	],
	[
		{
			text: 'Welcome',
			callback_data: 'welcome',
		},
		{
			text: 'Exit',
			callback_data: 'exit',
		},
	],
];
