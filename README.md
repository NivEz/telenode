# Telenode


Lightweight Telegram API framework for Node.js

![npm package](https://img.shields.io/badge/-grey?logo=telegram)
[![npm package](https://img.shields.io/npm/v/telenode-js?color=orange&logo=npm)](https://www.npmjs.org/package/telenode-js)
[![MIT licensed](https://img.shields.io/badge/license-MIT-green.svg)](https://raw.githubusercontent.com/NivEz/telenode/main/LICENSE)

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
const Telenode = require('telenode-js');
require('dotenv').config();

const bot = new Telenode({
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

---

### TODO's

- [ ] Regex matching on text messages
- [ ] Buttons support (sending & listening)
- [ ] Direct respond function in message handler without passing chat ID
- [ ] Chat ID handlers
- [ ] Arguments validations
- [ ] Add tests
