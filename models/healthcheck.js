/*
 This file makes call to DB to check health
 */
const db = require('../db/lib/mongoAdapter')

/*
 Ping the DB
 Input: ''
 Output: Success if query return results otherwise error
 */
const pingDB = () => {

    db.get().collection('health').find({}).toArray()
        .then(() => {
           return 'Ok'
        })
        .catch((err) => {
        return 'Error'
    })
}

module.exports = {
    pingDB: pingDB
}
