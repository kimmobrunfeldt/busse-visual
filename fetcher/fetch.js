var Promise = require('bluebird');
var requestGet = Promise.promisify(require('request').get);
var _ = require('lodash');
var fs = require('fs');

var Timer = require('../app/scripts/timer');
var config = require('../app/scripts/config');
var database = require('./database');

var dbCollection = null;

function main() {
    database.connect()
    .then(function(db) {
        console.log('Connected to mongo');
        dbCollection = db.collection('locations');
        startFetchLoop();
    });
}

function startFetchLoop() {
    var timer = new Timer(function() {
        return getAndWriteVehicles();
    }, {
        interval: 3 * 1000
    });
    timer.start();
}

function getAndWriteVehicles() {
    return requestGet(config.apiUrl)
    .then(function(response) {
        var data = JSON.parse(response[0].body);
        var smallVehicles = _.map(data.vehicles, function(vehicle) {
            return {
                id: vehicle.id,
                latitude: vehicle.latitude,
                longitude: vehicle.longitude,
                line: vehicle.line,
                rotation: vehicle.rotation
            };
        });

        var filePath = 'data/' + data.responseUnixTime + '.json';
        fs.writeFileSync(filePath, JSON.stringify(smallVehicles));
        //database.insert(dbCollection, smallVehicles)
        console.log('Wrote to', filePath);

    }).catch(function(err) {
        console.error('Error fetching');
        console.error(err);
    });
}

main();
