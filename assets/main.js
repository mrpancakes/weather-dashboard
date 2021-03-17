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

$(document).ready(function () {
   
    $("#search-button").click(function (event) {
        event.preventDefault();
        userInput = searchVal.val().trim();

        if (userInput === "") {
            return;
        }

        let li = document.createElement("li")
        console.log(userInput);
        searchArr.push(userInput);
        localStorage.setItem("Cities", JSON.stringify(searchArr));
        li.textContent = userInput;
        li.setAttribute("class", "list-group-item list-group-item-action");
        // li.setAttribute("id", "cityLi");
        citiesUl.append(li);
        currentWeatherFetch();
        forecastFetch();
        clickPastCity();

    });

    function clickPastCity(){
        $("li").on("click", function () {
            userInput = $(this).data("set")
            currentWeatherFetch();
            forecastFetch();
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
            li.setAttribute("data-set", city)
            citiesUl.append(li);
        }

        clickPastCity();
        
    }


    function currentWeatherFetch() {
        const requestUrl = `${baseUrl}${userInput}&units=imperial&appid=${apiKey}`;

        fetch(requestUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let temp = Math.round(data.main.temp);
                let humidity = data.main.temp;
                let windSpeed = data.wind.speed;
                $("#dashboard").attr("class", "col-12 col-md-7 col-lg-9 p-5 show");
                $("#userCity").text(`${userInput} ${today}`);
                $("#temp").text(`Temperature: ${temp} °F`);
                $("#humidity").text(`Humidity: ${humidity}%`);
                $("#wind").text(`Wind Speed: ${windSpeed} MPH`);
                cityCoord = data.coord; // change the value of the lat and lon coordinates so the forecast can call it
                console.log(cityCoord);

                let todayWeather = data.weather[0].main.toLowerCase();

                console.log(todayWeather);

                if (todayWeather.includes("rain")) {
                    $("#todayWeather").attr("class", "fas fa-cloud-rain");
                } else if (todayWeather.includes("clear")) {
                    $("#todayWeather").attr("class", "fas fa-sun");
                } else if (todayWeather.includes("clouds")) {
                    $("#todayWeather").attr("class", "fas fa-cloud");
                } else if (todayWeather.includes("thunderstorm")) {
                    $("#todayWeather").attr("class", "fas fa-bolt");
                } else if (todayWeather.includes("snow")) {
                    $("#todayWeather").attr("class", "fas fa-snowflake");
                } else if (todayWeather.includes("mist")) {
                    $("#todayWeather").attr("class", "fas fa-water");
                } else if (todayWeather.includes("haze")) {
                    $("#todayWeather").attr("class", "fas fa-smog");
                };


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

                    // weatherConditionsArr.push(data.daily[1].weather[0].main.toLowerCase());
                    // weatherConditionsArr.push(data.daily[2].weather[0].main.toLowerCase());
                    // weatherConditionsArr.push(data.daily[3].weather[0].main.toLowerCase());
                    // weatherConditionsArr.push(data.daily[4].weather[0].main.toLowerCase());
                    // weatherConditionsArr.push(data.daily[5].weather[0].main.toLowerCase());

                    // console.log(weatherConditionsArr);

                    // for (i = 0; i < weatherConditionsArr.length; i++) {
                    //     if (weatherConditionsArr[i] === "rain") {
                    //         $(`#weather${[i]}`).attr("class", "fas fa-cloud-rain");
                    //     }
                    // }


                    let firstDayWeather = data.daily[1].weather[0].main.toLowerCase();
                    let secondDayWeather = data.daily[2].weather[0].main.toLowerCase();
                    let thirdDayWeather = data.daily[3].weather[0].main.toLowerCase();
                    let fourthDayWeather = data.daily[4].weather[0].main.toLowerCase();
                    let fifthDayWeather = data.daily[5].weather[0].main.toLowerCase();

                    if (firstDayWeather.includes("rain")) {
                        $("#weather1").attr("class", "fas fa-cloud-rain");
                    } else if (firstDayWeather.includes("clear")) {
                        $("#weather1").attr("class", "fas fa-sun");
                    } else if (firstDayWeather.includes("clouds")) {
                        $("#weather1").attr("class", "fas fa-cloud");
                    } else if (firstDayWeather.includes("thunderstorm")) {
                        $("#weather1").attr("class", "fas fa-bolt");
                    } else if (firstDayWeather.includes("snow")) {
                        $("#weather1").attr("class", "fas fa-snowflake");
                    } else if (firstDayWeather.includes("mist")) {
                        $("#weather1").attr("class", "fas fa-water");
                    } else if (firstDayWeather.includes("haze")) {
                        $("#weather1").attr("class", "fas fa-smog");
                    }

                    if (secondDayWeather.includes("rain")) {
                        $("#weather2").attr("class", "fas fa-cloud-rain");
                    } else if (secondDayWeather.includes("clear")) {
                        $("#weather2").attr("class", "fas fa-sun");
                    } else if (secondDayWeather.includes("clouds")) {
                        $("#weather2").attr("class", "fas fa-cloud");
                    } else if (secondDayWeather.includes("thunderstorm")) {
                        $("#weather2").attr("class", "fas fa-bolt");
                    } else if (secondDayWeather.includes("snow")) {
                        $("#weather2").attr("class", "fas fa-snowflake");
                    } else if (secondDayWeather.includes("mist")) {
                        $("#weather2").attr("class", "fas fa-water");
                    } else if (secondDayWeather.includes("haze")) {
                        $("#weather2").attr("class", "fas fa-smog");
                    }

                    if (thirdDayWeather.includes("rain")) {
                        $("#weather3").attr("class", "fas fa-cloud-rain");
                    } else if (thirdDayWeather.includes("clear")) {
                        $("#weather3").attr("class", "fas fa-sun");
                    } else if (thirdDayWeather.includes("clouds")) {
                        $("#weather3").attr("class", "fas fa-cloud");
                    } else if (thirdDayWeather.includes("thunderstorm")) {
                        $("#weather3").attr("class", "fas fa-bolt");
                    } else if (thirdDayWeather.includes("snow")) {
                        $("#weather3").attr("class", "fas fa-snowflake");
                    } else if (thirdDayWeather.includes("mist")) {
                        $("#weather3").attr("class", "fas fa-water");
                    } else if (thirdDayWeather.includes("haze")) {
                        $("#weather3").attr("class", "fas fa-smog");
                    }

                    if (fourthDayWeather.includes("rain")) {
                        $("#weather4").attr("class", "fas fa-cloud-rain");
                    } else if (fourthDayWeather.includes("clear")) {
                        $("#weather4").attr("class", "fas fa-sun");
                    } else if (fourthDayWeather.includes("clouds")) {
                        $("#weather4").attr("class", "fas fa-cloud");
                    } else if (fourthDayWeather.includes("thunderstorm")) {
                        $("#weather4").attr("class", "fas fa-bolt");
                    } else if (fourthDayWeather.includes("snow")) {
                        $("#weather4").attr("class", "fas fa-snowflake");
                    } else if (fourthDayWeather.includes("mist")) {
                        $("#weather4").attr("class", "fas fa-water");
                    } else if (fourthDayWeather.includes("haze")) {
                        $("#weather4").attr("class", "fas fa-smog");
                    }

                    if (fifthDayWeather.includes("rain")) {
                        $("#weather5").attr("class", "fas fa-cloud-rain");
                    } else if (fifthDayWeather.includes("clear")) {
                        $("#weather5").attr("class", "fas fa-sun");
                    } else if (fifthDayWeather.includes("clouds")) {
                        $("#weather5").attr("class", "fas fa-cloud");
                    } else if (fifthDayWeather.includes("thunderstorm")) {
                        $("#weather5").attr("class", "fas fa-bolt");
                    } else if (fifthDayWeather.includes("snow")) {
                        $("#weather5").attr("class", "fas fa-snowflake");
                    } else if (fifthDayWeather.includes("mist")) {
                        $("#weather5").attr("class", "fas fa-water");
                    } else if (fifthDayWeather.includes("haze")) {
                        $("#weather5").attr("class", "fas fa-smog");
                    }

                })
        }, 200);
    }


    displaySearchResults();
})
