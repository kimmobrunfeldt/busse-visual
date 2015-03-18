var Promise = require('bluebird');
var _ = require('lodash');

var config = require('./config');
var utils = require('./utils');


function Map(containerId) {
    // Options shared across providers
    var sharedMapOptions = {
        zoomControl: false,
        attributionControl: false
    };

    var attribution;
    if (config.mapProvider === 'mapbox') {
        L.mapbox.accessToken = config.mapBoxKey;

        this._map = L.mapbox.map(containerId, config.mapBoxMapId, sharedMapOptions);

        attribution = '<a href="https://www.mapbox.com/about/maps/"';
        attribution += 'target="_blank">&copy; Mapbox &copy; OpenStreetMap</a>';
    } else if (config.mapProvider === 'here') {
        var tileLayer = L.tileLayer.provider('HERE.normalDayGrey', {
            app_id: config.hereMapsAppId,
            app_code: config.hereMapsAppCode
        });

        this._map = L.map(containerId, sharedMapOptions);
        this._map.addLayer(tileLayer);
    } else {
        throw new Error('Unknown map provider: ' + config.mapProvider);
    }

    var credits = L.control.attribution({position: 'topright'}).addTo(this._map);
    credits.addAttribution(attribution);

    this._map.setView([
        config.initialPosition.latitude,
        config.initialPosition.longitude],
        config.initialZoom
    );

    this._heat = L.heatLayer([], {maxZoom: 18}).addTo(this._map);
}

Map.prototype.addHeat = function addHeat(latitude, longitude) {
    // Init marker
    var pos = new L.LatLng(latitude, longitude);
    this._heat.addLatLng(pos);
};

Map.prototype.removeMarker = function removeMarker(id) {
    throw new Error('Not implemented');
};


module.exports = Map;
