var parkData = [

    {
        lat: "28.417823",
        lng: "-81.581203",
        name: "DisneyWorld"
    },

    {
        lat: "28.410515",
        lng: "-81.464874",
        name: "Seaworld"
    },

    {
        lat: "28.476747",
        lng: "-81.473222",
        name: "Universal Studios"
    },

    {
        lat: "28.033631",
        lng: "-82.420659",
        name: "Busch Gardens"
    },

    {
        lat: "28.460525",
        lng: "-81.462871",
        name: "Wet and Wild"
    },

    {
        lat: "28.355744",
        lng: "-81.403874",
        name: "Gatorland"
    },

    {
        lat: "29.228699",
        lng: "-81.007713",
        name: "Daytona Beach Boardwalk"
    },

    {
        lat: "28.523273",
        lng: "-80.68161",
        name: "Kennedy Space Center Visitor Complex"
    },

    {
        lat: "28.320007",
        lng: "-80.607551",
        name: "Cocoa Beach"
    }

];

var map;
var infoWindow;

var initMap = function() {

    var mapOptions = {
        center: new google.maps.LatLng(28.746693, -81.981354),
        zoom: 9,
        draggable: true,
        scrollwheel: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDoubleClickZoom: true,

    }; //close mapOptions

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    infoWindow = new google.maps.InfoWindow();

    //This will add these needed properties to each of the park data above
    parkData.forEach(function(place) {

        place.map = map;
        place.position = new google.maps.LatLng(place.lat, place.lng);
        place.title = place.name;
        place.animation = google.maps.Animation.DROP;

    }); //close parkData

    ko.applyBindings(new ViewModel());

}; //close of InitMap

var mapError = function() {

    alert("Oops. Sorry but a map loading error has occured");


}; //close mapError


var ViewModel = function() {

    var self = this;
    var bounds = new google.maps.LatLngBounds();

    // contains all marker objects
    self.allParks = [];

    // this observable will track what the user enters in text field box
    self.userInput = ko.observable('');

    //this observable array contains the information for all the parks
    self.markerInfo = ko.observableArray();

    // This observable array contains all the weather data returned from API call
    //self.weatherData = ko.observableArray();

    // loading array with the park information
    parkData.forEach(function(place) {
        self.markerInfo.push(place);
    }); //close parkData

    self.toggleBounce = function(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {

            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 2800);

        } //close else

    }; //close togglBounce


    //This function generates the infoWindow content. It generates the url for the openWeathermap
    //service. It calls the API and recieves JSON information. Three weather variables get
    //obtained and used for the infoWindow content.

    self.generateContent = function(x, marker) {

        return function Content() {

            var openWeatherMapUrl = "http://api.openweathermap.org/data/2.5/weather?";
            openWeatherMapUrl += $.param({
                'lat': self.markerInfo()[x].lat,
                'lon': self.markerInfo()[x].lng,
                'units': "imperial",
                'APPID': "7b81fdc7f0841851f31a5461065c5bc5"

            }); //close openWeatherMapURL

            infoWindow.open(map, marker);

            $.getJSON(openWeatherMapUrl, function(info) {

                var temp = info.main.temp;
                var condition = info.weather[0].description;
                var humidity = info.main.humidity;
                var windowContent = ('<p> Welcome to ' + self.markerInfo()[x].name +'<p>' +
                    '<p><b>Current Temperature is:</b> ' + temp.toString() +
                    'F </P>' + '<p><b> Current Humidity is:</b> ' + humidity.toString() +
                    '% </p>' + '<p><b> Weather Conditions is:</b> ' + condition + '<p>' +
                    '<p><i> Powered by OpenWeatherMap.org<i> <p>'
                );

                infoWindow.setContent(windowContent);
                map.panTo(marker.getPosition());
                self.toggleBounce(marker);

            }).fail(function(e) {

                map.panTo(marker.getPosition());
                windowContent = ('Error has occured. Weather data not available');
                self.toggleBounce(marker);
                infoWindow.setContent(windowContent);
                infoWindow.open(map, marker);

            }); //close getJSON

        }; //close Content

    }; //close generateContent

    //This funtion creates the markers.  It also calls the function that generates the InfoWindow
    //content if a marker is clicked
    self.createMarkers = function() {

        for (var i = 0; i < self.markerInfo().length; i++) {

            var data = self.markerInfo()[i];
            var myLatlng = data.position;
            var marker = new google.maps.Marker(data);

            self.allParks.push(marker);
            bounds.extend(myLatlng);

            google.maps.event.addListener(marker, "click", self.generateContent(i, marker));

        } //close for loop

    }; //close createMarkes

    self.createMarkers();
    map.fitBounds(bounds);

    //This funtion is called when user clicks a location on the drawer list. It obtains the
    //prope marker and uses an event trigger to simulate that the marker was clicked
    self.displayInfo = function(marker) {

        var index = self.markerInfo().indexOf(marker);
        var markerObject = self.allParks[index];

        google.maps.event.trigger(markerObject, "click", self.generateContent(index, markerObject));

    }; //close displayInfo

    //This funtion implements the filter property. It removes all markers from array and map
    //It then adds the appropiate markers back to array depending if there is a match. Then
    //markers are created and added to map
    self.markerFilter = function() {

        var searchInput = self.userInput().toLowerCase();
        self.markerInfo.removeAll();
        self.allParks.forEach(function(place) {
            place.setMap(null);
          });

        self.allParks = [];
        parkData.forEach(function(place) {

        if (place.name.toLowerCase().indexOf(searchInput) !== -1) {
                self.markerInfo.push(place);
        }

        });

        self.createMarkers();

    }; //close markerFilter

    //listen for resizing if window and adjust map bounds
    window.addEventListener('resize', function(e) {
        map.fitBounds(bounds);
    });

}; //end of ViewModel function