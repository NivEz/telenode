const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/', (req, res) => {
	if (req.body?.message?.text) {
		textMessageHandler(req.body.message.text);
	}
	res.end();
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

const textMessageHandler = (receivedMessage) => {
	textHandlers[receivedMessage] && textHandlers[receivedMessage]();
};

const textHandlers = {};

onTextMessage = (message, handler) => {
	textHandlers[message] = handler;
};

onTextMessage('hello', () => {
	console.log('hello handler');
});
