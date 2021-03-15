const searchVal = $("#search-value");
const apiKey = "04c212983054ab4c56a6b85900e38902";
const baseUrl = `https://api.openweathermap.org/data/2.5/weather?q=`;
citiesUl = $("ul");
searchArr = [];

$("#search-button").click(function (event) {
    event.preventDefault();

    const userInput = searchVal.val().trim();
    let li = document.createElement("li")
    console.log(userInput);
    searchArr.push(userInput);
    localStorage.setItem("Cities", JSON.stringify(searchArr));
    li.textContent = userInput;
    li.setAttribute("class", "list-group-item list-group-item-action")
    li.setAttribute("id", "cityLi");
    citiesUl.append(li);

    // fetch
    const requestUrl = `${baseUrl}${userInput}&appid=${apiKey}`;

    fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
});

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