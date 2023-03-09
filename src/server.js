const express = require('express');
const server = express();
const port = 3000;

const runServer = bot => {
	server.use(express.json());

	server.post('/', (req, res) => {
		bot.telenodeHandler(req.body);
		res.end();
	});

	server.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});
};

module.exports = {
	runServer,
};
