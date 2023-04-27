// === GOOGLE MAPS API STUFF === 
var mapsBaseURL = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyCB3lXQUe3SeV0zKPvqYYzjp89i2YaNETA&origin=START_ADDRESS&destination=END_ADDRESS";

// === OPENBREWERYDB API STUFF === 
//LIST OF "BOILERPLATE" API Calls from OpenBreweryDB 
var breweryURL = "https://api.openbrewerydb.org/v1/breweries";
var byCityURL = "https://api.openbrewerydb.org/v1/breweries?by_city=san_diego&per_page=10";
var byTypeURL = "https://api.openbrewerydb.org/v1/breweries?by_type=micro&per_page=10";


// === DOM OBJECTS === 
var defaultSearch = document.querySelector("#default-search");
var searchButton = document.querySelector("#search-button");
var mapView = document.querySelector("#map-view");

// searchButton.addEventListener("click", function (event){
// event.preventDefault();
// console.log("button works!");
// console.log("SEARCH VALUE: " +defaultSearch.value);
// //searchByCity(defaultSearch.value);
// searchByType(defaultSearch.value);

// });




function searchByCity(cityString){
    //Take a string from somewhere and feed it into the city search API Call...
    var byCityURL = "https://api.openbrewerydb.org/v1/breweries?by_city="+cityString+"&per_page=10";
    

    fetch (byCityURL)
    .then(function (response){
    
    return response.json();
    
    })
    .then (function (data){
    

    var latitudeArray = [];
    var longitudeArray = [];
    for (i=0; i<data.length; i++){
        console.log(data);
        console.log("--------------");
        console.log("BREWERY NAME: " +data[i].name);
        console.log("ADDRESS: " +data[i].address_1); 
        console.log("CITY + STATE: " +data[i].city+ ", " +data[i].state);
        console.log("LATITUDE: " +data[i].latitude);
        latitudeArray.push(data[i].latitude);
        console.log("LONGITUDE: " +data[i].longitude);
        longitudeArray.push(data[i].longitude);
        console.log("");
        console.log("----------------");
        pullCoordinates(latitudeArray, longitudeArray);
    
    }
    
    })
    
}

function pullCoordinates(latitudeArray, longitudeArray){
    for (j=0; j<latitudeArray.length; j++){
        console.log("===== THIS IS FROM pullCoordinates Function! =====");
        console.log(latitudeArray[j]);
        console.log(longitudeArray[j]);
        console.log("===============================================");
    }

}

function searchByType(typeString){
    console.log(typeString);
    breweryTypes = ["micro", "nano", "regional", "brewpub", "large", "planning", "bar", "contract", "proprietor", "closed"];


    if (typeString !== "micro" && typeString !== "nano" && typeString !== "regional" && typeString !== "brewpub" && typeString !== "large" && typeString !== "planning" && typeString !== "bar" && typeString !== "contract" && typeString !== "proprietor" && typeString !== "closed"){
        console.log("That wasn't a type!");
        return; 
    }
    
    var byTypeURL = "https://api.openbrewerydb.org/v1/breweries?by_type=" +typeString+ "&per_page=10";


    fetch (byTypeURL)
    . then (function (response){
       return response.json();
    })
    .then (function (data){
        var latitudeArray = [];
        var longitudeArray = [];
        for (k=0; k < data.length; k++){
            console.log(data);
            console.log("=====================");
            console.log("BREWERY NAME: " +data[k].name);
            console.log("ADDRESS: " +data[k].address_1);
            console.log("BREWERY TYPE: " +data[k].brewery_type);
            console.log("CITY + STATE: " +data[k].city+ ", " +data[k].state);
            console.log("LATITUDE: " +data[k].latitude);
            latitudeArray.push(data[k].latitude);
            console.log("LONGITUDE: " +data[k].longitude);
            longitudeArray.push(data[k].longitude);
            console.log("=====================");

        }
        pullCoordinates(latitudeArray, longitudeArray);
    
    })


}

//function to process the search query and channel it to the correct output...
function processSearch(searchQuery){
    // ==== PROCESSING BREW TYPE SEARCHES === 
    //declares a variable that will hold the specific brew type, for searching purposes 
    var brewType; 
    //if the search was any of the following, then the user is doing a "type search"...so we'll run makeTypeGoogleMap()
    if (searchQuery === "micro" || searchQuery === "nano" || searchQuery === "regional" || searchQuery === "brewpub" || searchQuery === "large" || searchQuery === "contract" || searchQuery === "proprietor"){
        brewType = searchQuery;
        console.log("We are inside the if statement and brewType equals " +brewType);
        makeTypeGoogleMap(brewType);
        return; 
    }

   
    // === PROCESSING BREWERY NAME SEARCHES === 
    // NOTE FOR TEAM: there has to be a more sophisticated answer to how to do this lol 
    if (searchQuery.includes("brewery")){
        makeNameGoogleMap(searchQuery);
        return; 
    }
    
   
    // === PROCESSING CITY SEARCHES ===
    makeCityGoogleMap(searchQuery);


    // === PROCESSING BREWERY NAME SEARCHES === 
    
    


    console.log("----------------");
    console.log("Process Search() searchQuery= " +searchQuery);
    console.log("----------------");
    return searchQuery; 
}
/*NOTE FOR THURSDAY'S CLASS WITH THE TEAM...
It seems like Google Maps API is doing a lot of the heavy lifting for us when it comes to the maps...really the only info we  *might* need from the OpenBreweryDB API are names/addresses of breweries, but even that it might just be easier to feed the search query "breweries in [insert city name]"

OpenBreweryDB will still be helpful for outputting the cards, but I think we can drop the latitude and longitude stuff, honestly...unless there's a complication I"m overlooking. 


*/ 
//functions that creates an iframe dynamically and appends it to the correct region on screen 
//how to create an embedded Google Map based on a brewery type search query 
function makeTypeGoogleMap(brewType){
    var googleMap = document.createElement("iframe");
    googleMap.setAttribute("width", "100%");
    googleMap.setAttribute("height", "100%");
    googleMap.setAttribute("frameborder", "0");
    googleMap.setAttribute("style", "border:0");
    googleMap.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
    googleMap.setAttribute("src", "https://www.google.com/maps/embed/v1/search?key=AIzaSyCB3lXQUe3SeV0zKPvqYYzjp89i2YaNETA&q=" +brewType+ "breweries in USA");
    mapView.append(googleMap);
}
//how to create an embedded Google Map based on a city search query 
function makeCityGoogleMap(searchQuery){
    var googleMap = document.createElement("iframe");
    googleMap.setAttribute("width", "100%");
    googleMap.setAttribute("height", "100%");
    googleMap.setAttribute("frameborder", "0");
    googleMap.setAttribute("style", "border:0");
    googleMap.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
    googleMap.setAttribute("src", "https://www.google.com/maps/embed/v1/search?key=AIzaSyCB3lXQUe3SeV0zKPvqYYzjp89i2YaNETA&q=breweries in" +searchQuery);
    mapView.append(googleMap);
}

function makeNameGoogleMap(searchQuery){
    var googleMap = document.createElement("iframe");
    googleMap.setAttribute("width", "100%");
    googleMap.setAttribute("height", "100%");
    googleMap.setAttribute("frameborder", "0");
    googleMap.setAttribute("style", "border:0");
    googleMap.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
    googleMap.setAttribute("src", "https://www.google.com/maps/embed/v1/search?key=AIzaSyCB3lXQUe3SeV0zKPvqYYzjp89i2YaNETA&q=" +searchQuery+ "brewery");
    mapView.append(googleMap);
}



processSearch("Kansas City");


// Hamburger Menu Toggle
function toggleMenu() {
    var menu = document.getElementById('navbar-default');
    if (menu.classList.contains('hidden')){
        menu.classList.remove("hidden");
    } else {
        menu.classList.add('hidden');
    }
}