$(document).ready(function () {

    let searchForm = $('#search-form');
    const searchVal = $("#search-value");
    let forecastContainer = $(".forecast");
    const apiKey = "04c212983054ab4c56a6b85900e38902";
    const baseUrl = `https://api.openweathermap.org/data/2.5/weather?q=`;
    let iconBaseUrl = `http://openweathermap.org/img/wn/`;
    let forecastBaseUrl = `http://api.openweathermap.org/data/2.5/forecast?q=`;
    let searchArr = [];
    let citiesUl = $("ul");
    let userInput = '';

    const today = moment().format("(MM/DD/YY)");
    $("#date").text(today);

    searchForm.submit(function (event) {
        event.preventDefault();
        userInput = searchVal.val().trim();

        if (userInput === "") {
            return;
        };

        let li = $("<li>");
        li.click(function (event) {
            event.preventDefault();
            let value = $(this).text();
            console.log(value);
            currentCityWeather(value);
            fiveDayForecast(value);
        })
        searchArr.push(userInput);
        localStorage.setItem("Cities", JSON.stringify(searchArr));
        li.text(userInput);
        li.attr("class", "list-group-item list-group-item-action");
        citiesUl.append(li);
        console.log(userInput);
        currentCityWeather(userInput);
        fiveDayForecast(userInput);
    });

    function currentCityWeather(city) {
        $("#todayWeather").html("");
        let fullUrl = `${baseUrl}${city}&units=imperial&appid=${apiKey}`;
        console.log(fullUrl);
        fetch(fullUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let cityName = data.name;
                let temp = Math.round(data.main.temp);
                let humidity = data.main.humidity;
                let weather = data.weather; // will come back to this one
                let iconUrl = iconBaseUrl + weather[0].icon + '.png';
                let windSpeed = data.wind.speed;

                // Adding text/classes to the HTML elements based on the API values
                $("#dashboard").attr("class", "col-12 col-md-7 col-lg-9 p-5 show");
                $("#userCity").text(`${cityName} ${today}`).attr("class", "bogus-class");

                let weatherImg = $(`<img class='icon-name' src=${iconUrl}>`)

                $("#temp").text(`Temperature: ${temp} °F`);
                $("#humidity").text(`Humidity: ${humidity}%`);
                $("#wind").text(`Wind Speed: ${windSpeed} MPH`);
                $("#todayWeather").append(weatherImg);
            })
            .catch(error => {
                console.log(error);
            })
    };

    function fiveDayForecast(city) {
        let fullUrl = `${forecastBaseUrl}${city}&units=imperial&appid=${apiKey}`;
        fetch(fullUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data);

                // Collect 5 days of data
                $(".forecast").html("");

                for (let i = 0; i < data.list.length; i++) {
                    let isThreeOClock = data.list[i].dt_txt.search('15:00:00');

                    if (isThreeOClock > -1) {
                        let forecast = data.list[i]
                        let weather = forecast.weather;
                        let iconUrl = iconBaseUrl + weather[0].icon + '.png';
                        let temp = Math.round(forecast.main.temp);
                        let humidity = forecast.main.humidity;

                        let windSpeed = forecast.wind.speed;
                        let day = moment(forecast.dt_txt).format("MM/DD/YY")

                        let cardDiv = $("<div class='card p-2'>")
                        let dayDiv = $("<h5 class='day-name'>");
                        let tempDiv = $("<div class='temp-name'>");
                        let humidityDiv = $("<div class='temp-name'>");
                        let weatherImg = $(`<img class='icon-name' src=${iconUrl}>`);
                        let windDiv = $("<div class='wind-name'>");

                        dayDiv.text(day);
                        tempDiv.text(`Temp: ${temp} °F`);
                        humidityDiv.text(`Humidity: ${humidity}%`);
                        windDiv.text(`Wind: ${windSpeed} MPH`);

                        cardDiv.append(dayDiv);
                        cardDiv.append(weatherImg);
                        cardDiv.append(tempDiv);
                        cardDiv.append(humidityDiv);
                        cardDiv.append(windDiv);
                        forecastContainer.append(cardDiv);
                    }
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    function retreiveSearchHistory() {
        if (localStorage.getItem("Cities")) {
            searchArr = JSON.parse(localStorage.getItem('Cities'));
            for (let i = 0; i < searchArr.length; i++) {
                let searchLi = $("<li class='list-group-item list-group-item-action'>");
                searchLi.click(function (event) {
                    event.preventDefault();
                    let value = $(this).text();
                    console.log(value);
                    currentCityWeather(value);
                    fiveDayForecast(value);
                })
                searchLi.text(searchArr[i]);
                citiesUl.append(searchLi);
            }
        }
    }

    retreiveSearchHistory();

});