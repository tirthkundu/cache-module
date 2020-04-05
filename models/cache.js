const db = require('../db/lib/mongoAdapter')
const utilities = require('../services/utilities')


const updateTTL = keyname => {
    return new Promise((resolve, reject) => {
        db.get().collection('cacheData').updateOne({key: keyname},{$set:{ "createdAt": new Date(Date.now()).toISOString()}})
            .then((data) => {
                resolve (true)
            })
            .catch((err) => {
                reject('Error')
            })
    })
}

const updateValue = (keyName,value) => {
    return new Promise((resolve, reject) => {
        db.get().collection('cacheData').updateMany({key: keyName},{$set:{value:value, "createdAt": new Date(Date.now()).toISOString()}},{multi: true})
            .then((data) => {
                resolve (true)
            })
            .catch((err) => {
                reject('Error')
            })
    })
}

const getKeyData =  keyName => {
    return new Promise((resolve, reject) => {
        db.get().collection('cacheData').find({key: keyName}).toArray()
            .then((data) => {
                if (data.length == 0) {
                    console.log('cache miss')
                   return resolve (0)
                } else {
                    // check for expiration
                    if(utilities.isExpired(data[0].createdAt)){
                        console.log('cache miss')
                        return resolve (-1)
                    }
                    console.log('cache hit')
                    updateTTL(keyName)
                    return resolve(data[0].value)
                }

            })
            .catch((err) => {
                return reject('Error')
            })
    })
}

const setKeyData =  (keyName,value) => {
    return new Promise((resolve, reject) => {
        db.get().collection('cacheData').insertOne({
            "key": keyName,
            "value": value,
            "createdAt": new Date(Date.now()).toISOString()
        })
            .then((data) => {
                resolve (true)
            })
            .catch((err) => {
                reject('Error')
            })
    })
}


module.exports = {
    getKeyData,
    setKeyData,
    updateValue,
    updateTTL
}