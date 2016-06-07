var parkData = [

{

    lat:"28.417823",
    lng:"-81.581203 ",
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

    lat:" 28.476747 ",
    lng:"-81.473222",
    address:"  ",
    name:" Universal Studios"

},

{

    lat:"28.033631",
    lng:"-82.420659",
    address:"  ",
    name:" Busch Gardens"

},

{

    lat:" 28.460525  ",
    lng:" -81.462871 ",
    address:"  ",
    name:" Wet and Wild"

}

];


//var  map;

initMap = function(){

var mapOptions = {
      center: new google.maps.LatLng(28.378110,-81.569366),
      zoom: 10

}; //close mapOptions

 map = new google.maps.Map(document.getElementById('map'), mapOptions);

infoWindow = new google.maps.InfoWindow({
                 content: " test data "

}); //close infoWindow

//This will add these two needed properties to each of the park data above
parkData.forEach(function(place){

     place.map = map;
     place.position = new google.maps.LatLng(place.lat,place.lng);

}); //close parkData

   ko.applyBindings(new ViewModel());

}; //close of InitMap


var ViewModel = function() {

	var self = this;

// contains all marker objects
    self.allParks = [];

// this observable will track what the user enters in text field box
    self.userInput = ko.observable('');

//this observable array contacin the information for all the parks
    self.markerInfo = ko.observableArray();

// loading array with the park information
    parkData.forEach(function(place) {
        self.markerInfo.push(place);

    });//close parkData

//create markers and place on map
self.createMarkers = function() {

  for (var i = 0; i < self.markerInfo().length; i++) {

           var marker = new google.maps.Marker( self.markerInfo()[i]);

      self.allParks.push(marker);

  };//close for loop


};//close createMarkes

self.createMarkers();



self.markerFilter = function() {

	var searchInput = self.userInput().toLowerCase();
	self.markerInfo.removeAll();
	self.allParks.forEach(function(marker) {
         marker.setMap(null);

	});

	self.allParks = [];
	parkData.forEach(function(place) {

      if (place.title.toLowerCase().indexOf(searchInput) !== -1) {

      	     self.markerInfo.push(place);
      }


	});

	self.createMarkers();


};//close markerFilter


}; //end of ViewModel function