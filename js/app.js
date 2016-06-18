var parkData = [

{

    lat:"28.417823",
    lng:"-81.581203",
    address:"  ",
    name:"DisneyWorld"

},


{

    lat:"28.410515",
    lng:"-81.464874",
    address:"  ",
    name:"Seaworld"

},


{

    lat:"28.476747",
    lng:"-81.473222",
    address:"  ",
    name:"Universal Studios"

},

{

    lat:"28.033631",
    lng:"-82.420659",
    address:"  ",
    name:"Busch Gardens"

},

{

    lat:"28.460525",
    lng:"-81.462871",
    address:"  ",
    name:"Wet and Wild"

}

];


var map;
var infoWindow;

var initMap = function(){

var mapOptions = {
      center: new google.maps.LatLng(28.378110,-81.569366),
      zoom: 10,

}; //close mapOptions

 map = new google.maps.Map(document.getElementById('map'), mapOptions);

 infoWindow = new google.maps.InfoWindow();


//This will add these needed properties to each of the park data above
parkData.forEach(function(place){

     place.map = map;
     place.position = new google.maps.LatLng(place.lat,place.lng);
     place.title = place.name;
     place.animation = google.maps.Animation.DROP;

}); //close parkData

   ko.applyBindings(new ViewModel());

}; //close of InitMap



var ViewModel = function() {

	var self = this;
	var bounds = new google.maps.LatLngBounds();

    //var openWeatherMapurl ='';


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
});//close parkData


     self.toggleBounce=function(marker){
         if (marker.getAnimation() !==null) {
             marker.setAnimation(null);
         } else {

            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){marker.setAnimation(null); }, 1600);

             }; //close else

            };//close togglBounce


     self.generateContent = function(x,marker) {


      return function Content(){

             var openWeatherMapUrl = "http://api.openweathermap.org/data/2.5/weather?";
             openWeatherMapUrl += $.param({
            'lat': self.markerInfo()[x].lat,
            'lon': self.markerInfo()[x].lng,
            'units': "imperial",
            'APPID': "7b81fdc7f0841851f31a5461065c5bc5"

           }); //close openWeatherMapURL



             $.getJSON(openWeatherMapUrl, function(info) {

             	var temp = info.main.temp;
             	var condition = info.weather[0].description;
             	var humidity = info.main.humidity;
             	var windowContent = ('<p><b>Current Temperature is:</b> ' + temp.toString() +
                                      'F </P>' +'<p><b> Current Humidity is:</b> ' + humidity.toString() +
                                      '% </p>' +'<p><b> Weather Conditions is:</b> ' + condition
             		                 );

                self.toggleBounce(marker);

                infoWindow.setContent(windowContent);
        	    infoWindow.open(map,marker);

                });//close getJSON


       };//close Content

     }; //close generateContent


self.createMarkers = function() {



  for (var i = 0; i < self.markerInfo().length; i++) {

        var data = self.markerInfo()[i];
        var myLatlng = data.position;
        var marker = new google.maps.Marker(data);

        self.allParks.push(marker);
        bounds.extend(myLatlng);

        google.maps.event.addListener(marker, "click", self.generateContent(i,marker));


    };//close for loop

};//close createMarkes

self.createMarkers();


self.displayInfo = function(marker) {

 var index = self.markerInfo().indexOf(marker);
 var markerObject = self.allParks[index];

 self.generateContent(index,markerObject);

 self.toggleBounce(markerObject);

 console.log( markerObject.name+  " was clicked " + "the index is "+index);


}; //close displayInfo


self.markerFilter = function() {

	var searchInput = self.userInput().toLowerCase();
	self.markerInfo.removeAll();
	self.allParks.forEach(function(marker) {
         marker.setMap(null);

	});

	self.allParks = [];
	parkData.forEach(function(place) {

      if (place.name.toLowerCase().indexOf(searchInput) !== -1) {

      	     self.markerInfo.push(place);
      }


	});

	self.createMarkers();


};//close markerFilter


//listen for resizing if window and adjust map bounds
    window.addEventListener('resize', function(e) {
    map.fitBounds( bounds)
    });



}; //end of ViewModel function


