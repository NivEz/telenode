const Telenode = require('../src/bot');

const bot = new Telenode({
	apiToken: process.env.API_TOKEN,
});

bot.createServer();

bot.onTextMessage(/pattern/, async messageBody => {
	await bot.sendTextMessage('Found a regex match!', messageBody.chat.id);
});

// The string handler will receive more precedence than the regex handler
bot.onTextMessage('/pattern/', msgBody => {
	bot.sendTextMessage(
		'The regex pattern should be matched but string handlers have more precedence',
		msgBody.chat.id,
	);
});
