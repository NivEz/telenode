const Telenode = require('../src/bot');

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

bot.onButton('hello', callbackQuery => {
	const senderName = callbackQuery.from.first_name;
	bot.sendTextMessage(`Hello ${senderName}! How are you?`, callbackQuery.message.chat.id);
});

bot.onButton('', callbackQuery => {
	bot.sendTextMessage(
		'The random button was pressed, it was targeted via the button handler with empty string parameter',
		callbackQuery.message.chat.id,
	);
});

bot.onButton('edit', callbackQuery => {
	inlineKeyboard.push([
		{
			text: 'New button - remove me',
			callback_data: 'remove',
		},
	]);
	bot.editInlineKeyboard(
		callbackQuery.message.chat.id,
		callbackQuery.message.message_id,
		null,
		inlineKeyboard,
	);
});

bot.onButton('remove', callbackQuery => {
	inlineKeyboard.pop();
	bot.editInlineKeyboard(
		callbackQuery.message.chat.id,
		callbackQuery.message.message_id,
		null,
		inlineKeyboard,
	);
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
			text: 'Say hello',
			callback_data: 'hello',
		},
		{
			text: 'Exit',
			callback_data: 'exit',
		},
	],
	[
		{
			text: 'Random button (onButton with empty string)',
			callback_data: 'random',
		},
	],
	[
		{
			text: 'Add button - edit (editMessageReplyMarkup)',
			callback_data: 'edit',
		},
	],
];
