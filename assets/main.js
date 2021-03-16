// Display date next to city name
const today = moment().format("(MM/DD/YY)");
$("#date").text(today);

const searchVal = $("#search-value");
const apiKey = "04c212983054ab4c56a6b85900e38902";
const baseUrl = `https://api.openweathermap.org/data/2.5/weather?q=`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?q=`;
let citiesUl = $("ul");
let userInput = '';
searchArr = [];

$("#search-button").click(function (event) {
    event.preventDefault();

    userInput = searchVal.val().trim();
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
    const requestUrl = `${baseUrl}${userInput}&appid=${apiKey}`;

    fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            let temp = Math.round((data.main.temp - 273.15) * (9 / 5) + 32); // Convert temp from Kelvin to Farenheit
            let humidity = data.main.temp;
            let windSpeed = data.wind.speed;
            // let uvIndex = // Need a different API call for the UV index

            $("#dashboard").attr("class", "col-12 col-md-7 col-lg-9 p-5 show");
            $("#userCity").text(userInput);
            console.log(`Temp in F: ${temp} °F`);
            $("#temp").text(`Temperature: ${temp} °F`);
            $("#humidity").text(`Humidity: ${humidity}%`);
            $("#wind").text(`Wind Speed: ${windSpeed} MPH`);
            $("#UV").text(`UV Index:`);
        })
}

function forecastFetch() {
    const requestUrl = `${forecastUrl}${userInput}&cnt=5&appid=${apiKey}`;

    fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
           
        })
}


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