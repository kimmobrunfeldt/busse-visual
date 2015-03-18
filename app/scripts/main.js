var _ = require('lodash');

var config = require('./config');
var utils = require('./utils');
var Timer = require('./timer');
var Map = require('./map');


function main() {
    var map = new Map('map');
    startFetchLoop(map);
}

function startFetchLoop(map) {
    var timer = new Timer(function() {
        return getAndUpdateVehicles(map);
    }, {
        interval: config.updateInterval
    });
    timer.start();
}

function getAndUpdateVehicles(map) {
    return utils.get(config.apiUrl).then(function(req) {
        var response = JSON.parse(req.responseText);

        var vehicles = response.vehicles;
        updateVehicles(map, vehicles);
    });
}

function updateVehicles(map, vehicles) {
    _.each(vehicles, function(vehicle) {
        map.addPoint(vehicle.id, vehicle.latitude, vehicle.longitude);
    });
}

main();
