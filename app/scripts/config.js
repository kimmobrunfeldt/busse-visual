var config = {
    updateInterval: 3 * 1000,
    apiUrl: 'http://lissu-api.herokuapp.com',
    mapBoxKey: 'pk.eyJ1Ijoia2ltbW9icnVuZmVsZHQiLCJhIjoiX21FOWpGbyJ9.PeLVL2Rm1OZHJPYBM0lymA',
    mapBoxMapId: 'kimmobrunfeldt.lgb7ai7g',
    hereMapsAppId: 'lon2CLqSu9qYoH6SnBkQ',
    hereMapsAppCode: 'sAiLnBBj5Q4S7PLHSrY9vw',

    // Supported values: mapbox, here
    mapProvider: 'mapbox',

    initialPosition: {latitude: 61.487881, longitude: 23.7810259},
    initialZoom: 12,
    zoomOnLocated: 16,
    hideMarkersAfterAmount: 20,
    markerHideDebounce: 500
};

module.exports = config;

