const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

//displays index.html of root path
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html")
});

//invoked after hitting go in the html form
app.post("/", function(req, res) {

    // takes in the id from the html form, display in // console. Takes in as string
        var id = String(req.body.cityIDInput);
        console.log(req.body.cityIDInput);

    //build up the URL for the JSON query, API Key is // secret and needs to be obtained by signup 
        const units = "imperial";
        const apiKey = process.env.weatherKey;
        const url = "https://api.openweathermap.org/data/2.5/weather?id=" + id +  "&units=" + units + "&APPID=" + apiKey;

    // this gets the data from Open WeatherPI
    https.get(url, function(response){
        console.log(response.statusCode);

        // gets individual items from Open Weather API
        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const city = weatherData.name;
            const humidity = weatherData.main.humidity;
            const wind = weatherData.wind.speed;
            const cloudiness = weatherData.clouds.value;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            // displays the output of the results
            res.write("<h1> The weather is " + weatherDescription + "</h1>");
            res.write("<h2>The Temperature in " + city + " is " + temp + " Degrees Fahrenheit</h2>");
            res.write("<h2>The Humidity in " + city + " is " + humidity + "%</h2>");
            res.write("<h2>The Wind Speed in " + city + " is " + wind + " MPH</h2>");
            res.write("<h2>The Cloudiness in " + city + " is " + cloudiness + "%</h2>");
            res.write("<img src=" + imageURL +">");
            res.send();
        });
    });
})


//Code will run on 3000 or any available open port
app.listen(process.env.PORT || 3000, function() {
console.log ("Server is running on port")
});