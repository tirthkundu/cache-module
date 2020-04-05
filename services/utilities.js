/*
 This file consists of various utility functions
 */
const config = require('config')

module.exports = {
	// Generate random string
	createRandomString: keyName => {
		return 'BK' + (Number(new Date()) + Math.ceil(Math.random() * 10000))
	},
	isExpired: datetime => {
		let diff = new Date(Date.now()) - new Date(datetime)
		if (Math.floor(diff / 1e3) > config.cacheTTL) {
			return true
		}
		return false
	}
}
