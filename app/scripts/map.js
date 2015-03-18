var _ = require('lodash');
var config = require('./config');

var lineOptions = {
    opacity: 0.5,
    weight: 2,
    color: '#4bb5c1',
    clickable: false
};

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
    this._lines = {};
}

Map.prototype.addPoint = function addPoint(id, latitude, longitude) {
    if (!id) {
        this.createSingleLine(latitude, longitude);
        return;
    }

    // Init marker
    if (!_.has(this._lines, id)) {
        this.createLine(id);
    }

    var pos = new L.LatLng(latitude, longitude);
    this._lines[id].addLatLng(pos);
};

Map.prototype.removeLine = function removeLine(id) {
    this._map.removeLayer(this._lines[id]);
    delete this._lines[id];
};

Map.prototype.createLine = function createLine(id) {
    var polyline = L.polyline([], lineOptions);
    polyline.addTo(this._map);
    this._lines[id] = polyline;
    return polyline;
};

Map.prototype.createSingleLine = function createSingleLine(latitude, longitude) {
    var pos = new L.LatLng(latitude, longitude);
    var polyline = L.polyline([pos], lineOptions);

    polyline.addTo(this._map);
};


module.exports = Map;
