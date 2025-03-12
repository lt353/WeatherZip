

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

//app.use is a middleware function that allows us to use the body-parser 
app.use(bodyParser.urlencoded({extended: true}));

// sets up the root route ("/") to show the index.html file
// __dirname gives the path to the current folder
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html") // sends the HTML file to the browser
});

// handles what happens when someone submits the form
app.post("/", function(req, res) {
    // grabs the zip code input from the form and converts it to a string
    var zip = String(req.body.zipInput);
    // prints the zip code to the console to check if it works
    console.log(req.body.zipInput);

    // sets the temperature units to Fahrenheit
    const units = "imperial";
    // gets the API key from the environment variable I created using Secrets
    const apiKey = process.env['weatherKey'];
    /* builds the URL we’ll use to get weather info from OpenWeather
     * https://api.openweathermap.org is the base URL
     * /data/2.5/weather is the path to the API endpoint
     * ?zip=" + zip +  "&units=" + units + "&APPID=" + apiKey are the multiple query parameters which are key-value pairs. 
     */
    const url = "https://api.openweathermap.org/data/2.5/weather?zip=" + zip +  "&units=" + units + "&APPID=" + apiKey;
    
    // this gets the data from Open WeatherPI by making a GET request to the URL
    https.get(url, function(response){
    console.log(response.statusCode); // prints the status code on console
        
    // listens for chunks of data coming from the API
    response.on("data", function(data){
        const weatherData = JSON.parse(data); //Deserialization - meaning converting the data into a JavaScript object called weatherData
        const temp = weatherData.main.temp;
        const city = weatherData.name;
        const weatherDescription = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"; // creates the URL for the weather icon
            
            // displays the weather info on the page
            res.write("<h1> The weather is " + weatherDescription + "<h1>");
            res.write("<h2>The Temperature in " + city + " " + zip + " is " + temp + " Degrees Fahrenheit<h2>");
            res.write("<img src=" + imageURL +">");
            res.send();
        });
    });
})


//Code will run on 3000 or any available open port
app.listen(process.env.PORT || 3000, function() {
console.log ("Server is running on port")
});
