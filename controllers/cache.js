/*
 Controller which consists of function related to cache operations
 */
const cacheModel = require('../models/cache')
const utilities = require('../services/utilities')


const getKeyValue = async function(params) {
    try {

        let value = await cacheModel.getKeyData(params.keyName)
        if(value <= 0){

            value = utilities.createRandomString();
            if(value == 0) {
                await cacheModel.setKeyData(params.keyName, value)
            }
            else {
                await cacheModel.updateValue(params.keyName, value)
            }
        }
        // Return the data to client
        return {value: value}
    } catch (e) {
        // Throw unhandled errors or exceptions
        throw e
    }
}

module.exports = {
    getKeyValue
}
