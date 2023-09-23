const axios = require('axios');

const longPoll = async ({ bot, pollingDelay = 1000, url }) => {
	if (pollingDelay < 50) {
		throw new Error('Polling delay must be at least 50ms');
	}
	let offset = 0;
	while (true) {
		try {
			const res = await axios.get(url + '/getUpdates', {
				params: { offset },
			});
			const updates = res.data.result;
			updates.forEach(update => {
				bot.telenodeHandler(update);
				offset = update.update_id + 1;
			});
		} catch (err) {
			if (err.name === 'AxiosError') {
				console.error(
					'Request error in long polling:\n',
					err.message,
					'\n',
					err.response.data,
				);
			} else {
				// If the handlers throw an error and it is not async, it will be caught here
				console.error(err);
			}
		}
		await sleep(pollingDelay);
	}
};

module.exports = {
	longPoll,
};

const sleep = ms => new Promise(r => setTimeout(r, ms));
