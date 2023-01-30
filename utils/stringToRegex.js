const stringToRegex = (str) => {
	const re = /\/(.+)\/([gim]?)/
	const match = str.match(re);
	if (match) {
		return new RegExp(match[1], match[2])
	}
}

module.exports = {
	stringToRegex
}
