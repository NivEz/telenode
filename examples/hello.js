const TeleNode = require('../src/bot')

const bot = new TeleNode()

bot.createServer()

bot.onTextMessage('hello', () => {
	console.log('hello handler');
});
