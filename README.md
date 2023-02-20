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
npx set-webhook
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

## Local development:

Each feature of `Telenode` is demonstrated in an example file inside the `examples` folder.

For local development you need to set a webhook as well with the `set-webhook` command. How you execute the command is slightly different from using the installed package like explained above. Instead of `npx` just use `npm run`:
```
npm run set-webhook
```
The webhook url should be presented in the `.env` file or be exported as an environment variable.

In order to develop a new feature or to run an existing one you should use the `dev` command from the `package.json` with the `--file` flag like so:
```
npm run dev --file=<example>
```


## Features

✅ Explicit messages handlers
<br>
✅ Fallback messages handler (empty string)
<br>
✅ Regex matching on text messages

## TODO's

- [ ] Buttons support (sending & listening)
- [ ] Direct respond function in message handler without passing chat ID
- [ ] Chat ID handlers
- [ ] Arguments validations
- [ ] Add tests
