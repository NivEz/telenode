#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config();

const apiToken = process.env.API_TOKEN;
const webhook = process.env.WEBHOOK;

const url = `https://api.telegram.org/bot${apiToken}/setWebhook`;

(async () => {
	try {
		const res = await axios.post(url, {}, {
			params: {
				url: webhook,
			},
		});
		if (res.status === 200) {
			console.log(res.data.description);
		}
	} catch (e) {
		console.log('Failed setting webhook! Maybe the api token or the webhook are invalid');
		console.log(e?.message);
		console.log(e?.code);
	}
})();

