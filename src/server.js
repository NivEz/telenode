const express = require('express');
const server = express();
const port = 3000;

const runServer = bot => {
	server.use(express.json());

	server.post('/', (req, res) => {
		const secretToken = req.headers['x-telegram-bot-api-secret-token'];
		bot.telenodeHandler(req.body, secretToken, bot.unauthorizedHandler);
		res.end();
	});

	server.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});
};

module.exports = {
	runServer,
};
