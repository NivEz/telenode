const express = require('express');
const server = express();
const port = 3000;

const runServer = (bot) => {
	server.use(express.json());

	server.post('/', (req, res) => {
		const message = req.body?.message;
		if (message) {
			bot.messageHandler(message);
		}
		res.end();
	});

	server.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});
};

module.exports = {
	runServer,
};
