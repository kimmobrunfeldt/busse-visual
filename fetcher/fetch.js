var Promise = require('bluebird');
var requestGet = Promise.promisify(require('request').get);
var _ = require('lodash');
var fs = require('fs');

var Timer = require('../app/scripts/timer');
var config = require('../app/scripts/config');
var database = require('./database');

function main() {
    database.connect()
    .then(function(db) {
        console.log('Connected to mongo');
        dbCollection = db.collection('locations');
        startFetchLoop(dbCollection);
    });
}

function startFetchLoop(dbCollection) {
    var timer = new Timer(function() {
        return getAndWriteVehicles(dbCollection);
    }, {
        interval: 3 * 1000
    });
    timer.start();
}

function getAndWriteVehicles(dbCollection) {
    return requestGet(config.apiUrl)
    .then(function(response) {
        var data = JSON.parse(response[0].body);
        var smallVehicles = _.map(data.vehicles, function(vehicle) {
            return {
                id: vehicle.id,
                latitude: vehicle.latitude,
                longitude: vehicle.longitude,
                line: vehicle.line,
                rotation: vehicle.rotation,
                origin: vehicle.origin,
                destination: vehicle.destination,
                operator: vehicle.operator,
                direction: vehicle.direction
            };
        });

        console.log(new Date(), 'Add ' + smallVehicles.length + ' vehicles to db');
        var doc = {
            vehicles: smallVehicles,
            responseDate: new Date(data.responseUnixTime)
        };

        database.insert(dbCollection, doc);
    }).catch(function(err) {
        console.error('Error fetching');
        throw err;
    });
}

main();
