# telenode-js


Lightweight Telegram API framework for Node.js

---

## Getting started

### Installation

```
npm install telenode-js
```

### Set webhook

In order to listen to updates from Telegram servers you have to set up a webhook.
<br>
The webhook url will be stored in a `.env` file in the root of your project as `WEBHOOK=https://your_amazing_webhook.com`.
<br>
Then you can execute the following command:

```
npm exec set-webhook
```

### Usage

```
const TeleNode = require('../src/bot');
require('dotenv').config();

const bot = new TeleNode({
	apiToken: process.env.API_TOKEN,
});

bot.createServer();

bot.onTextMessage('hello', async (messageBody) => {
	console.log(messageBody);
	await bot.sendTextMessage('hello back', messageBody.chat.id);
});
```

In this example the bot will listen only to 'hello' text messages and will respond to the user 'hello back'. Any other message will be ignored.


Additional examples can be found in the [examples folder](https://github.com/NivEz/telenode/tree/main/examples).
