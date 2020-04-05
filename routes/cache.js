/*
 Route containing endpoints related to the cache service
 */
const cache = require('../controllers/cache')
const messages = require('../services/messages')

// Route to check health of DB and EC2 instances
module.exports = function(app) {
    app.route('/cache/:keyName').get(async function(req, res) {
        try {
            const params = req.params
            const cacheData = await cache.getKeyValue(params)
            return res.json(cacheData)
        } catch (e) {
            res.status(400)
            return res.json(messages.getMessageDetails(e))
        }
    })

    app.route('/cache/allKeys').get(async function(req, res) {
        try {
            const cacheKeys = await cache.getAllKeys()
            return res.json(cacheKeys)
        } catch (e) {
            res.status(400)
            return res.json(messages.getMessageDetails(e))
        }
    })

    app.route('/cache/:keyName').put(async function(req, res) {
        try {
            const params = req.params
            const keyUpdate = await cache.updateKey(params)
            return res.json(keyUpdate)
        } catch (e) {
            res.status(422)
            return res.json(messages.getMessageDetails(e))
        }
    })

    app.route('/cache/:keyName').delete(async function(req, res) {
        try {
            const params = req.params
            const keyDelete = await cache.deleteKey(params)
            return res.json(keyDelete)
        } catch (e) {
            res.status(422)
            return res.json(messages.getMessageDetails(e))
        }
    })

    app.route('/cache/deleteAll').post(async function(req, res) {
        try {
            const keysDelete = await cache.deleteAllKeys()
            return res.json(keysDelete)
        } catch (e) {
            res.status(422)
            return res.json(messages.getMessageDetails(e))
        }
    })
}
