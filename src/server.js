const express = require('express');
const server = express();
const port = 3000;

const runServer = (bot) => {
	server.use(express.json());

	server.post('/', (req, res) => {
		if (req.body?.message?.text) {
			bot.textMessageHandler(req.body.message.text);
		}
		res.end();
	});

	server.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});
};

module.exports = {
	runServer
}
