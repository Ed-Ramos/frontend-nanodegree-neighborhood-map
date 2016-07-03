##Front End Web Developer- Neighborhood Map Project

This project is to create a google map of an area of interest.  The map should have animated markers on at least five locations. For these locations, a non-google API service should be called which provides some infomation.  The information should be displayed in infowindows. These locations should also be shown in a list.  A filter input box should be implemented. The project is to use knockout.js as a framework to bind the view to the data.

###The Map
The Google map is loaded when clicking the index.html file.  The map is centered on the Central Florida Area. Upon loading, nine markers will drop from above.  These locations are for various Central Florida theme parks and a few beaches which are popular with tourist.  When you click on a marker, it will bounce and an InfoWindow will open showing current weather data. The map is reponsive and as such will adjust to various screen sizes. For a better user experience, the doubleclick to zoom turned off.

###The Weather API
The site OpenWeatherMap.org is used to get current weather data. Using the Lat/Lon from the locations, an API call is used to get the weather data in JSON format.  The data is parsed and the current temperature, current humidity, and weather condition is extracted and placed in InfoWindow.
If the API call fails, an error message is populated in InfoWindow indicating that weather data is not available.

###The List
The locations can also be seen by clicking the hamburger menu icon in the upper right corner.  When menu is clicked, a slider drawer shows up on left hand side with a list of the locations.  When the mouse is moved over a location, the location is highlighted.  When a location is clicked from list, it will cause the corresponding marker to bounce and InfoWindow to open. Clicking the menu if the slider drawer is open will cause it to close.

###The Filter
A filter box is placed above the list. As you enter letters in the filter box, the list will only show those locations that contain those letter(s) segments. The markers for the shown list items will repopulate map and will be the only ones shown.


