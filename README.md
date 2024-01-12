# Telenode

Lightweight Telegram API framework for Node.js

![npm package](https://img.shields.io/badge/-grey?logo=telegram)
[![npm package](https://img.shields.io/npm/v/telenode-js?color=orange&logo=npm)](https://www.npmjs.org/package/telenode-js)
[![MIT licensed](https://img.shields.io/badge/license-MIT-green.svg)](https://raw.githubusercontent.com/NivEz/telenode/main/LICENSE)

---

## Features

✅ Explicit messages handlers
<br>
✅ Fallback messages handler (empty string - any messages)
<br>
✅ Regex matching on text messages
<br>
✅ Buttons support (inline keyboard, reply keyboard and remove reply keyboard)
<br>
✅ Fallback handler for any button (empty string - button callback_data)
<br>
✅ Edit inline keyboards
<br>
✅ Secret token support
<br>
✅ Long polling support

## Getting started

### Installation

```
npm install telenode-js
```

### Install dependencies

In order to reduce the `node_modules` size `dotenv` (for environment variables) and `express` (for local development /
deployment) packages are defined as `devDependencies`.

You don't have to use these packages if you don't want to, and you can use them only for local development if you choose
so.
<br>
If you do choose to work with these packages, install them manually:

```
npm install express dotenv
```

Or for serverless deployments install express as a dev dependency (to use in your local development environment)
instead:

```
npm install express --save-dev
```

### Set webhook

In order to listen to updates from Telegram servers you have to set up a webhook.
<br>
To use the `npx set-webhook` command you should provide the webhook parameter and api token.
You can do that by:

1. Setting the `WEBHOOK` and `API_TOKEN` environment variables (`SECRET_TOKEN` is optional).
2. Storing them in `.env` file (`SECRET_TOKEN` is optional).
3. Use the `--apiToken` and `--webhook` command arguments (`--secretToken` is optional).

You also can provide the secret token parameter if you choose to.

Then you can execute the following command:

```
npx set-webhook
```

* If you want to delete a webhook use the command:

```
npx delete-webhook
```

### Long polling

If you prefer to use long polling method over creating a server with webhook you can use the `startLongPolling` method instead of `createServer`. If you have a webhook set up already, you need to delete it, you can use the `npx delete-webhook` command to delete it.

<br>
The method accepts `pollingDelay` - a number that represents milliseconds (must be at least 50ms).
<br>
By default the long polling mechanism will ignore all previous updates (`cleanPreviousUpdates` by default is `true`). You can toggle off `cleanPreviousUpdates` if you want to by setting it as `false` when you call `startLongPolling`.
<br>
You also can stop the long polling while it's running by setting `bot.useLongPolling` to `false`.
<br>
You can view an example of long polling usage [here](https://github.com/NivEz/telenode/tree/main/examples/long-polling.js).

Note that long polling is usually not recommended and webhook is preferred for most use cases.

### Usage

```
const Telenode = require('telenode-js');
require('dotenv').config();

const bot = new Telenode({
	apiToken: process.env.API_TOKEN,
});

bot.createServer(); // spins up an express server

bot.onTextMessage('hello', async (messageBody) => {
	console.log(messageBody);
	await bot.sendTextMessage('hello back', messageBody.chat.id);
});
```

In this example the bot will listen only to 'hello' text messages and will respond to the user 'hello back'. Any other
message will be ignored.

- Note that `bot.createServer()` method requires express, and we are using `dotenev` as well which both are not
  installed automatically with `Telenode`.

Additional examples can be found in the [examples folder](https://github.com/NivEz/telenode/tree/main/examples).

### Webhook security with secret token

You can secure your webhook with a secret token via the `setWebhook` method. You can do that by creating
a `SECRET_TOKEN` variable in the `.env` file of your project (or environment variable) and run the `npx set-webhook`
command. The command will
tell Telegram servers to send the secret token in each request to your webhook as `x-telegram-bot-api-secret-token`
header.

In order for the bot to use the secret token you need to pass to the `Telenode` class you instanciate the `secretToken`
parameter.

You will have to pass a `secretToken` parameter to the `telenodeHandler` method as well.

You can pass a third parameter called `unauthorizedCallback` - a callback that will fire in case the request wasn't
authorized.

You can find the example in
the [secretToken.js example](https://github.com/NivEz/telenode/tree/main/examples/secretToken.js) and the implementation
in [src/server.js](https://github.com/NivEz/telenode/tree/main/src/server.js) as well.

---

## Run feature examples:

After you have set your webhook you can play and test the `Telenode` features.

Each feature of `Telenode` is demonstrated in an example file inside the `examples` folder (inside `node_modules` if you
installed `Telenode`).
<br>
You can run an example from the `telenode-js` directory inside `node_modules` by using the command:

```
npm run dev --file=<example>
```

You might need `nodemon` and `dotenv` installed as dev dependencies to run the examples with the command above.

---

## Deployment:

Since these days it is common to use serverless backend services, you can choose how the bot will work - or
with `express` or with the `HTTP` engine of the serverless provider.

In order to spin up an express server you should use the command `bot.createServer()` - this is useful for deployments
on VMs / containers / on-premise.

You can pass an object as options for `createServer`. Currently, it supports `port` and `unauthorizedCallback` (if you
use secret token) - e.g:

```
bot.createServer({ port: 4000 }) // the default is 3000
```

In the other hand, if you want to deploy on serverless backend you need to use `bot.telenodeHandler` method and pass to
it the request object.
You will probably have something like this:

```
functions.https.onCall((req, res) => {
    const secretToken = req.headers['x-telegram-bot-api-secret-token'];
    bot.telenodeHandler(req.body, secretToken, unauthorizedHandler);
    res.end();
});
```

Note that on serverless you should extract by your own the `secretToken` since every serverless service might process
the `req` object differently.

---

## Contributions:

If you want to develop a new feature you should create an example file under the examples' folder that demonstrates how
to use the feature.

---

## TODO's

- [ ] Direct respond function in message handler without passing chat ID
- [ ] Chat ID handlers
- [ ] Arguments validations
- [ ] Optimize Telegram API requests
- [ ] Add extra security with query params token
- [ ] Add tests
