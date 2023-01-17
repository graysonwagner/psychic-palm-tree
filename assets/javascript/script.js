var searchData = $(".search-data")
var listOfCities = []
var city
var APIKey = "0d1c8d9cebeec734941c584f7fa58850"

// set cities into local storage
function saveCities() {
        localStorage.setItem("cities", JSON.stringify(listOfCities));
}

// render buttons 
function renderButtons() {
    $(".buttons-view").empty();
    for (var i = 0; i < listOfCities.length; i++) {
        var a = $("<button>");
        a.addClass("btn btn-defult city-btn");
        a.attr("data-name", listOfCities[i]);
        a.text(listOfCities[i]);
        $(".buttons-view").prepend(a);
    }
}

// display current weather
function displayWeather() {
    //URL for AJAX Call - note: units=imperial
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey + "&units=imperial";
    //  AJAX Call
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
            $(".search-data").html("")
            //  div to store current weather data
            var newDiv = $("<div class='cityWeather'>")
            newDiv.html("<h2>Current Weather</h2><br>")
            searchData.prepend(newDiv)
            //  city name
            var cityName = response.name
            var pOne = $("<p>").html("<h4>" + cityName + "</h4>");
            newDiv.append(pOne)
            //  current date
            var currentDate = moment().format("LLLL")
            var pDate = $("<p>").html("<i>" + currentDate + "</i>");
            newDiv.append(pDate)
            //Call for windspeed (fixed to whole number)
            var windSpeed = response.wind.speed
            var pTwo = $("<p>").text("Wind Speed: " + windSpeed.toFixed(0) + " mph");
            newDiv.append(pTwo)
            //  humidity
            var humidity = response.main.humidity
            var pThree = $("<p>").text("Humidity: " + humidity.toFixed(0) + " %");
            newDiv.append(pThree)
            //  temperature 
            var temperature = response.main.temp
            var pFour = $("<p>").text("Temperature: " + temperature.toFixed(0) + " F");
            newDiv.append(pFour)
            //  image tag and icon image
            var iconImg = $("<img id = 'icon'>")
            $(".weather-icon").append(iconImg)
            var icon = response.weather[0].icon;
            var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
            $('#icon').attr('src', iconurl);
            //  longitude and latitude
            var lon = response.coord.lon
            var lat = response.coord.lat
            //URL for UV Index API
            var uvIndexUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon
            //  UV Index
            $.ajax({
                url: uvIndexUrl,
                method: "GET"
            }).then(function (response) {
                var uvIndex = response.value
                var pFive = $("<p id=uvIndex>").text("UV Index: " + uvIndex);
                newDiv.append(pFive)
            })
            
            if (listOfCities.includes(response.name) === false) {
                listOfCities.push(response.name)
            }
            
            renderButtons()
            saveCities()
            display5day()
        })
};

// display 5 day weather
function display5day() {
    //URL for 5 day forcast call
    var forcastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey
    //Added Header that displays with results
    $(".fiveDayHeader").html("<h3>5 Day Forecast</h3>")
   
    $.ajax({
        url: forcastURL,
        method: "GET"
    })
        .then(function (response) {

            var day1date = new Date(response.list[2].dt_txt)
            var day2date = new Date(response.list[10].dt_txt)
            var day3date = new Date(response.list[18].dt_txt)
            var day4date = new Date(response.list[26].dt_txt)
            var day5date = new Date(response.list[34].dt_txt)

            var day1temp = (response.list[2].main.temp * (9 / 5) - 459.67).toFixed(0)
            var day2temp = (response.list[10].main.temp * (9 / 5) - 459.67).toFixed(0)
            var day3temp = (response.list[18].main.temp * (9 / 5) - 459.67).toFixed(0)
            var day4temp = (response.list[26].main.temp * (9 / 5) - 459.67).toFixed(0)
            var day5temp = (response.list[34].main.temp * (9 / 5) - 459.67).toFixed(0)

            var day1hum = (response.list[2].main.humidity).toFixed(0)
            var day2hum = (response.list[10].main.humidity).toFixed(0)
            var day3hum = (response.list[18].main.humidity).toFixed(0)
            var day4hum = (response.list[26].main.humidity).toFixed(0)
            var day5hum = (response.list[34].main.humidity).toFixed(0)

            var day1icon = "http://openweathermap.org/img/w/" + response.list[2].weather[0].icon + ".png";
            var day2icon = "http://openweathermap.org/img/w/" + response.list[10].weather[0].icon + ".png";
            var day3icon = "http://openweathermap.org/img/w/" + response.list[18].weather[0].icon + ".png";
            var day4icon = "http://openweathermap.org/img/w/" + response.list[26].weather[0].icon + ".png";
            var day5icon = "http://openweathermap.org/img/w/" + response.list[34].weather[0].icon + ".png";

            $('.day1-icon').attr('src', day1icon);
            $('.day2-icon').attr('src', day2icon);
            $('.day3-icon').attr('src', day3icon);
            $('.day4-icon').attr('src', day4icon);
            $('.day5-icon').attr('src', day5icon);

            $(".day1").html("<br/>" + "<b>" + moment(day1date).format("ddd, MMM Do") + "</b>" + "</br>" + "Temp: " + day1temp + " F </br>" + "Humidity: " + day1hum + " %")
            $(".day2").html("<br/>" + "<b>" + moment(day2date).format("ddd, MMM Do") + "</b>" + "</br>" + "Temp: " + day2temp + " F </br>" + "Humidity: " + day2hum + " %")
            $(".day3").html("<br/>" + "<b>" + moment(day3date).format("ddd, MMM Do") + "</b>" + "</br>" + "Temp: " + day3temp + " F </br>" + "Humidity: " + day3hum + " %")
            $(".day4").html("<br/>" + "<b>" + moment(day4date).format("ddd, MMM Do") + "</b>" + "</br>" + "Temp: " + day4temp + " F </br>" + "Humidity: " + day4hum + " %")
            $(".day5").html("<br/>" + "<b>" + moment(day5date).format("ddd, MMM Do") + "</b>" + "</br>" + "Temp: " + day5temp + " F </br>" + "Humidity: " + day5hum + " %")
        })
}

//  event listener for search button
$("#run-search").on("click", function () {
    city = $("#search-term").val()
    displayWeather()
    display5day()
})

//  event listener for city buttons
$(document).on("click", ".city-btn", function () {
    city = $(this).attr("data-name");
    displayWeather()
    display5day()
})

//  event listener for clear search results button
$("#clear-search").on("click", function (){
localStorage.clear("cities")
listOfCities = []
$(".buttons-view").empty()
//refresh page
location.reload()
})

$(document).ready(function() {
    if(localStorage.getItem("cities") !== null) {
        var savedCity = localStorage.getItem("cities");
        var pushCities = JSON.parse(savedCity)
        listOfCities = listOfCities.concat(pushCities)
    }
   
    renderButtons()
    })