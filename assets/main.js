// Display date next to city name
const today = moment().format("(MM/DD/YY)");
$("#date").text(today);

$("#day1").text(moment().add(1, 'days').format("MM/DD/YY")); // 1 day from now
$("#day2").text(moment().add(2, 'days').format("MM/DD/YY")); // 2 days from now
$("#day3").text(moment().add(3, 'days').format("MM/DD/YY")); // 3 days from now
$("#day4").text(moment().add(4, 'days').format("MM/DD/YY")); // 4 days from now
$("#day5").text(moment().add(5, 'days').format("MM/DD/YY")); // 5 days from now


const searchVal = $("#search-value");
const apiKey = "04c212983054ab4c56a6b85900e38902";
const baseUrl = `https://api.openweathermap.org/data/2.5/weather?q=`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?q=`;
const uvIndexUrl = `https://api.openweathermap.org/data/2.5/onecall?`
let citiesUl = $("ul");
let userInput = '';
let cityCoord = {};


searchArr = [];

$("#search-button").click(function (event) {
    event.preventDefault();
    userInput = searchVal.val().trim();

    if (userInput === ""){
        return;
    }

    let li = document.createElement("li")
    console.log(userInput);
    searchArr.push(userInput);
    localStorage.setItem("Cities", JSON.stringify(searchArr));
    li.textContent = userInput;
    li.setAttribute("class", "list-group-item list-group-item-action")
    li.setAttribute("id", "cityLi");
    citiesUl.append(li);

    currentWeatherFetch();
    forecastFetch();

});


function currentWeatherFetch() {
    const requestUrl = `${baseUrl}${userInput}&units=imperial&appid=${apiKey}`;

    fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // let temp = Math.round((data.main.temp - 273.15) * (9 / 5) + 32); // Convert temp from Kelvin to Farenheit
            let temp = Math.round(data.main.temp);
            let humidity = data.main.temp;
            let windSpeed = data.wind.speed;
            $("#dashboard").attr("class", "col-12 col-md-7 col-lg-9 p-5 show");
            $("#userCity").text(`${userInput} ${today}`);
            console.log(`Temp in F: ${temp} °F`);
            $("#temp").text(`Temperature: ${temp} °F`);
            $("#humidity").text(`Humidity: ${humidity}%`);
            $("#wind").text(`Wind Speed: ${windSpeed} MPH`);
            cityCoord = data.coord; // change the value of the lat and lon coordinates so the forecast can call it
            console.log(cityCoord);
        })
}


// Get the UV Index. Added a brief setTimeout function so the currentWeatherFetch function could run and allow the lon and lat coordinates to populate
function forecastFetch() {
    setTimeout(function () {
        const requestUrl = `${uvIndexUrl}lat=${cityCoord.lat}&lon=${cityCoord.lon}&units=imperial&appid=${apiKey}`;
        console.log(requestUrl);
        fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let uvIndex = data.current.uvi;
            $("#UV").text(`UV Index: ${uvIndex}`);

            $("#temp1").text(`Temp: ${Math.round(data.daily[1].temp.day)} °F`);
            $("#humidity1").text(`Humidity: ${Math.round(data.daily[1].humidity)}%`);

            $("#temp2").text(`Temp: ${Math.round(data.daily[2].temp.day)} °F`);
            $("#humidity2").text(`Humidity: ${Math.round(data.daily[2].humidity)}%`);

            $("#temp3").text(`Temp: ${Math.round(data.daily[3].temp.day)} °F`);
            $("#humidity3").text(`Humidity: ${Math.round(data.daily[3].humidity)}%`);

            $("#temp4").text(`Temp: ${Math.round(data.daily[4].temp.day)} °F`);
            $("#humidity4").text(`Humidity: ${Math.round(data.daily[4].humidity)}%`);

            $("#temp5").text(`Temp: ${Math.round(data.daily[5].temp.day)} °F`);
            $("#humidity5").text(`Humidity: ${Math.round(data.daily[5].humidity)}%`);

            // Populate weather icons for each day

            // let weatherConditionsArr = [];

            // weatherConditionsArr.push(firstDayWeather = data.daily[1].weather[0].main.toLowerCase());
            // weatherConditionsArr.push(firstDayWeather = data.daily[2].weather[0].main.toLowerCase());
            // weatherConditionsArr.push(firstDayWeather = data.daily[3].weather[0].main.toLowerCase());
            // weatherConditionsArr.push(firstDayWeather = data.daily[4].weather[0].main.toLowerCase());
            // weatherConditionsArr.push(firstDayWeather = data.daily[5].weather[0].main.toLowerCase());

            
            let firstDayWeather = data.daily[1].weather[0].main.toLowerCase();
            let secondDayWeather = data.daily[2].weather[0].main.toLowerCase();
            let thirdDayWeather = data.daily[3].weather[0].main.toLowerCase();
            let fourthDayWeather = data.daily[4].weather[0].main.toLowerCase();
            let fifthDayWeather = data.daily[5].weather[0].main.toLowerCase();

            console.log(firstDayWeather);

            if (firstDayWeather === "rain"){
                $("#day1Conditions").attr("class", "fas fa-cloud-rain");
            } else if (firstDayWeather === "clear sky"){
                $("#day1Conditions").attr("class", "fas fa-sun");
            } else if (firstDayWeather === "few clouds"){
                $("#day1Conditions").attr("class", "fas fa-cloud-sun");
            } else if (firstDayWeather === "scattered clouds"){
                $("#day1Conditions").attr("class", "fas fa-cloud");
            } else if (firstDayWeather === "broken clouds"){
                $("#day1Conditions").attr("class", "fas fa-cloud-sun");
            } else if (firstDayWeather === "shower rain"){
                $("#day1Conditions").attr("class", "fas fa-cloud-showers-heavy");
            } else if (firstDayWeather === "thunderstorm"){
                $("#day1Conditions").attr("class", "fas fa-bolt");
            } else if (firstDayWeather === "snow"){
                $("#day1Conditions").attr("class", "fas fa-snowflake");
            } else if (firstDayWeather === "mist"){
                $("#day1Conditions").attr("class", "fas fa-water");
            }
        })



    }, 200);
}




// function forecastFetch() {
//     const requestUrl = `${forecastUrl}${userInput}&cnt=5&appid=${apiKey}`;

//     fetch(requestUrl)
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);

//         })
// }


function displaySearchResults() {
    let storedCities = JSON.parse(localStorage.getItem("Cities")); // create variable to store the parsed stored data

    if (storedCities !== null) {
        searchArr = storedCities; // if the storedCities isn't null, then set our array to the parsed version
    }

    // Looping through each item in the array and displaying them 
    for (let i = 0; i < searchArr.length; i++) {
        let city = searchArr[i];
        let li = document.createElement("li");
        li.textContent = city;
        li.setAttribute("class", "list-group-item list-group-item-action");
        li.setAttribute("id", "cityLi");
        li.setAttribute("data-set", city)
        citiesUl.append(li);
    }
}











// Run the fetch when someone clicks one of the cities they've already searched. 
// Is currently only working for the first city in the Li.
function shortcut() {
    $("#cityLi").click(function () {
        let cityClicked = $(this).attr("data-set");
        const requestUrl = `${baseUrl}${cityClicked}&appid=${apiKey}`;
        console.log(cityClicked);
        fetch(requestUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
    })
}



displaySearchResults();
shortcut();

