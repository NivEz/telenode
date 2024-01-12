#!/usr/bin/env node

const axios = require('axios');

try {
	require('dotenv').config();
} catch (e) {
	if (e.code === 'MODULE_NOT_FOUND') {
		console.log(
			'[] dotenv is not installed, trying with environment variables or command line arguments.',
		);
	}
}

const apiToken = process.env.API_TOKEN || process.env.npm_config_apiToken;

const url = `https://api.telegram.org/bot${apiToken}/deleteWebhook`;

(async () => {
	try {
		const res = await axios.post(url);
		console.log('[] Deleting webhook');
		if (res.status === 200) {
			console.log('[]', res.data.description);
		}
	} catch (e) {
		console.log('[] Failed deleting webhook! Maybe the api token is invalid');
		console.log('  ', e?.message);
		console.log('  ', e?.code);
	}
})();
