/*
This file is responsible for creating DB connections with master and slave hosts
Currently the master and slave hosts are same as we don't have master-slave infra. But we can have different endpoints in future
*/
const config = require('config')
const mongoClient = require('mongodb').MongoClient
const mongoDbUrl = `mongodb+srv://${config.db.username}:${config.db.password}@cluster0-oesvy.mongodb.net/test?retryWrites=true&w=majority`
const db = config.db.dbName
let mongodb;

function connect(callback){
    mongoClient.connect(mongoDbUrl, (err, client) => {
        mongodb = client.db(db)
        callback();
    });
}
function get(){
    return mongodb;
}

function close(){
    mongodb.close();
}

module.exports = {
    connect,
    get,
    close
};