const express = require('express');
const https = require('https');
const port = 3000;
const app = express();
const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true})); //for parsing the 'post' request.

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post('/', (req,res) => {
  const cityQuery = req.body.cityName;
  const apiKey = "564b97386d69f639c4ce63441d51bacc";
  const units = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityQuery + "&appid=" + apiKey + "&units=" + units;
  https.get(url, (response) => {
    response.on("data", function(data) {
      var weatherData = JSON.parse(data);
      if(weatherData.cod === 200) {
        console.log(weatherData);
        const temp = weatherData.main.temp;
        const imageURL = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
        const weatherDescription = weatherData.weather[0].description;
        const weatherCity = weatherData.name;
        res.write(returnHTML(temp, imageURL, weatherDescription, weatherCity));
        res.send();
      }
      else { console.log("City name is not valid!"); }
    });
  });
});

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`);
});

function returnHTML(temp, imageURL, weatherDescription, weatherCity) {
  return `<html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Weather App</title>
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.min.css">
              <link rel="stylesheet" href="style.css">
            </head>
            <body>
            <div class="container" style="display: flex; justify-content: center;flex-direction: row">
              <div class="card" style="width:30rem; margin-left:10px; margin-top:10px">
                <div class="card-body">
                  <div class="newsletter-subscribe">
                    <div class="container">
                      <div class="intro" style="text-align:center">
                        <p class="text-center">The weather is currently: ` + weatherDescription + `</p>
                        <h2 class="text-center"> The temperature in ` + weatherCity + ` is ` + temp + ` degrees celcius</h2>
                        <img class="center" src="` + imageURL + `">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/js/bootstrap.bundle.min.js"></script>
          </body>
        </html>`;
}
