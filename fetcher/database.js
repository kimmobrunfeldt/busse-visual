var Promise = require('bluebird');
var MongoClient = require('mongodb').MongoClient;
Promise.promisifyAll(MongoClient);

var url = 'mongodb://localhost:27017/bussevisual';

function connect() {
    return MongoClient.connectAsync(url)
    .then(function(db) {
        return db;
    })
    .catch(function(err) {
        console.error(err);
    });
}

function insert(collection, data) {
    return collection.insertAsync([data]);
}

module.exports = {
    connect: connect,
    insert: insert
};
