/*
 Route containing endpoints related to the cache service
 */
const cache = require('../controllers/cache')
const messages = require('../services/messages')

// Route to check health of DB and EC2 instances
module.exports = function(app) {
    app.route('/cache/key/:keyName').get(async function(req, res) {
        try {
            const params = req.params
            const cacheData = await cache.getKeyValue(params)
            return res.json(cacheData)
        } catch (e) {
            res.status(400)
            return res.json(messages.getMessageDetails(e))
        }
    })

}
