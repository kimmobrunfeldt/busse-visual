var Promise = require('bluebird');
var mongo = require('mongodb');
Promise.promisifyAll(mongo);

var url = 'mongodb://localhost:27017/bussevisual';

function connect() {
    return mongo.MongoClient.connectAsync(url)
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
