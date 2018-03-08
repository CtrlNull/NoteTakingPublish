(function () {
	'use strict'
	angular.module(APPNAME)
		.component('noteEditorGoogleMaps', {
			templateUrl: '/Scripts/components/note-google-map/main.html',
			controller: 'NoteEditorGoogleMapsController',
			bindings: {
				note: '<',
				noteControls: '<'
			}
		});

	angular.module(APPNAME)
		.controller('NoteEditorGoogleMapsController', NoteEditorGoogleMapsController);

	NoteEditorGoogleMapsController.$inject = ['$element']


	function NoteEditorGoogleMapsController($element) {
		var vm = this;

		var savePosition = {
			lat: 33.988568,
			lng: -118.384538
		}

		var resultsMap = new google.maps.Map($element.find('.map')[0], {
			center: savePosition,
			zoom: 18
		});

		var infoWindow = new google.maps.InfoWindow;
		var geocoder = new google.maps.Geocoder();

		vm.geoCodeAddress = _geoCodeAddress;
		function _geoCodeAddress() {
			var address = vm.note.title;
			vm.noteControls.save();
			geocoder.geocode({ 'address': address }, function (results, status) {
				if (status === 'OK') {
					resultsMap.setCenter(results[0].geometry.location);
					var marker = new google.maps.Marker({
						map: resultsMap,
						position: results[0].geometry.location
					});
				} else {
					alert('Geocode was not successful for the following reason: ' + status);
				}
			});



			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (position) {
					var savedposition = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					};

					infoWindow.setPosition(savedposition);
					infoWindow.setContent('Your Current Location.');
					infoWindow.open(resultsMap);
					resultsMap.setCenter(savedposition);
				}, function () {
					handleLocationError(true, infoWindow, resultsMap.getCenter());
				});
			} else {
				handleLocationError(false, infoWindow, resultsMap.getCenter());
			}
		}

		function handleLocationError(browserHasGeolocation, infoWindow, savedposition) {
			infoWindow.setPosition(savedposition);
			infoWindow.setContent(browserHasGeolocation ?
				'Error: The Geolocation service failed.' :
				'Error: Your browser doesn\'t support geolocation.');
			infoWindow.open(resultsMap);
		}
	}
})();
