var targetMap;
var targetCircle;
var defaultPosition = {
  coords: {
    latitude: 55.76,
    longitude: 37.64
  }
};
var defaultRadius = 1000;
var API_COUNT_URL = 'https://httpbin.org/post';

document.addEventListener("DOMContentLoaded", function(event) {
  initMap();
});

var initMap = function() {
  ymaps.ready(init);
  function init() {

    targetMap = new ymaps.Map("map", {
      center: [
        defaultPosition.coords.latitude, defaultPosition.coords.longitude
      ],
      zoom: 14
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, function(error) {
        if (error.code == error.PERMISSION_DENIED)
          showPosition(defaultPosition);
        }
      );
    } else {
      showPosition(defaultPosition);
    }
    
  }
};

var showPosition = function(position) {
  targetMap.setCenter([position.coords.latitude, position.coords.longitude]);
  targetCircle = new ymaps.Circle([
    [
      position.coords.latitude, position.coords.longitude
    ],
    defaultRadius
  ], {
    balloonContent: "Радиус круга - 1 км",
    hintContent: "Подвинь меня"
  }, {
    draggable: true,
    fillColor: "#c1e1ec77",
    strokeColor: "#1973c2",
    strokeOpacity: 0.8,
    strokeWidth: 5
  });
  targetCircle.events.add(['dragend'], function(e) {
    var coords = targetCircle.geometry.getCenter();
    getCount(coords[0], coords[1]);
  });

  targetMap.geoObjects.add(targetCircle);
  getCount(position.coords.latitude, position.coords.longitude);
};

var getCount = function(lat, lng) {
  axios.post(API_COUNT_URL, {
    lat: lat,
    lng: lng
  }).then(function(response) {
    clientCount.innerHTML = response.count||0;
  }).catch(function(error) {
    clientCount.innerHTML = 0;
  });
}
