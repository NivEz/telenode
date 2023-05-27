const Telenode = require('../src/bot');

const bot = new Telenode({
	apiToken: process.env.API_TOKEN,
	secretToken: process.env.SECRET_TOKEN,
});

const unauthorizedCallback = () => {
	console.log('Unauthorized request!');
};

bot.createServer({
	unauthorizedCallback,
});

bot.onTextMessage('', messageBody => {
	bot.sendTextMessage(
		"If I respond you are authorized or you don't use the secret token",
		messageBody.chat.id,
	);
});
