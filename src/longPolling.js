const axios = require('axios');

const longPoll = async ({ bot, pollingDelay = 1000, cleanPreviousUpdates = true, url }) => {
	if (pollingDelay < 50) {
		throw new Error('Polling delay must be at least 50ms');
	}
	let offset = 0;
	if (cleanPreviousUpdates) {
		const recentUpdates = await getUpdates(url, -1);
		offset = recentUpdates[0]?.update_id + 1 || 0;
	}
	while (bot.useLongPolling) {
		try {
			const updates = await getUpdates(url, offset);
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
	console.log('Long polling stopped...');
};

const getUpdates = async (url, offset) => {
	const res = await axios.get(url + '/getUpdates', {
		params: { offset },
	});
	return res.data.result;
};

module.exports = {
	longPoll,
};

const sleep = ms => new Promise(r => setTimeout(r, ms));
