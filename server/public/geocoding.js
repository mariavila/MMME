  var pos_ini = {};
  var pos_fi = {};

  function sendInitRoute() {
    console.log(pos_ini);

    var xhr1 = new XMLHttpRequest();
    xhr1.open('GET', 'http://localhost:3000/login' + "?id=estevetarra");
    //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr1.onload = function() {
      var result = JSON.parse(xhr1.responseText);
      console.log('initreturn' + result);
      var xhr2 = new XMLHttpRequest();
      var query = "pos_ini_lat=" + pos_ini.latitude + "&pos_ini_lng=" + pos_ini.longitude +
        "&pos_fi_lat=" + pos_fi.latitude + "&pos_fi_lng=" + pos_fi.longitude + "&id=estevetarra"
      xhr2.open('GET', 'http://localhost:3000/initRoute' + "?" + query);
      //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr2.onload = function() {
        var result = JSON.parse(xhr2.responseText);
      }

      xhr2.send();
    }
    xhr1.send();
  }


  function placeMarkerAndPanTo(latLng, map) {
    var marker = new google.maps.Marker({
      position: latLng,
      map: map
    });
    map.panTo(latLng);
  }

  function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: {lat: -34.397, lng: 150.644}
    });
    map.addListener('click', function(e) {
      //console.log(e.latLng.lat());
        pos_fi.latitude = e.latLng.lat();
        pos_fi.longitude = e.latLng.lng();
        placeMarkerAndPanTo(e.latLng, map);
        sendInitRoute();
    });

    var infoWindow = new google.maps.InfoWindow({map: map});
    var geocoder = new google.maps.Geocoder();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        pos_ini.latitude = position.coords.latitude;
        pos_ini.longitude = position.coords.longitude;

        infoWindow.setPosition(pos);
        infoWindow.setContent('Your Location');
        map.setCenter(pos);
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }

    document.getElementById('submit').addEventListener('click', function() {
      geocodeAddress(geocoder, map);
    });
  }

  function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        pos_fi.latitude = results[0].geometry.location.lat();
        pos_fi.longitude = results[0].geometry.location.lng();

        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        });
                    sendInitRoute();

      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
