// Here we store global variables from elements from the HTML
const cityNameInput = document.getElementById('cityNameInput');
const citySearch = document.getElementById('citySearch');
const deleteHistoryBtn = document.getElementById('delHistory');

// The use of the apiKey variable is so that if the apiKey ever needed to change and a call is made multiple times it can be flexible
const apiKey = '3497d479440187a42c3d57d843d1a6f2';

// Declairing cityNumber and cityData as global variables so they can be accessed across multiple functions.
let cityNumber = 0;
let cityData = JSON.parse(localStorage.getItem("cities")) || {};

// Event listeners for the 'Search' and 'Delete History' buttons to run the appropriate functions
citySearch.addEventListener('click', readCityName);
deleteHistoryBtn.addEventListener('click', delHistory);

// This function takes the input from the user to read the city name and output the lon and lat for the next api call.
function readCityName(){
    const cityName = cityNameInput.value;
    const locationApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    // Here we are fetching the response from the api, and if the response is not okay we get an error thrown.
    fetch(locationApiUrl).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    // Then we capture the data and extract it to get our cityName, lon and lat ready for use in the next function
    }).then(data => {
        const cityFoundName = data[0].name;
        cityData[cityFoundName] = {
            lat: data[0].lat,
            lon: data[0].lon
        };

        // We then save this data to local storage
        localStorage.setItem("cities", JSON.stringify(cityData));
        
        // Here we run a check to see if we have more than 10 cities saved as we have limited to history to be 10 items.
        if(cityNumber >= 10){
            alert(`You cannot have more than 10 cities saved into recent history, please delete your history first`);
        }

        // We then use the cityFoundName to parse through to out next function which will be an api call to get our weather data.
        readWeatherData(cityFoundName);

    // Here we are catching any error and giving a valid response based on the error
    }).catch(error => {
        // If the error is something involving the API key, then it will throw this message in the console.
        if (error instanceof TypeError && error.message.includes('API key')) {
            console.error('Invalid API key:', error);
          } else {
            // otherwise an alert will pop up warning the user that the city they entered cannot be found. and logging an error message in the console.
            alert(`Could not find a city with the name of ${cityName}, please try again.`)
            console.error('There was a problem with the Fetch operation:', error);
          }
    });
}

// This function is used to obtain the weather data using the cityName found from the first api call function.
function readWeatherData(cityFoundName){
    const lon = cityData[cityFoundName].lon;
    const lat = cityData[cityFoundName].lat;
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    // this will call apon the api call to fetch the data, once again having an error check if the response was not okay.
    fetch(weatherApiUrl).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    // We then grab the data from the response and extract the data that we need. 
    }).then(data => {
        // Here we set up the dayList with the format we wish to capture the data into.
        const daysList = {
            cityName: cityFoundName,
            todayData: {},
            nextDay1: {},
            nextDay2: {},
            nextDay3: {},
            nextDay4: {},
            nextDay5: {}
        };

        // Here we are setting the data we got from the response into a variable to extract.
        const listData = data.list;

        // Here we are selecting the indexes for the data we need (each number being a different day.) index being the numbers below, and dayIndex to determine if it is
        // today, or day number according to the index. this repeats until all of today, and the nextDay(s) are filled out up to 5.
        [0, 8, 16, 24, 32, 39].forEach((index, dayIndex) => {
            const day = listData[index];
            const date = dayjs.unix(day.dt).format('DD/MM/YYYY');
            const temp = day.main.temp;
            const humid = day.main.humidity;
            const wind = day.wind.speed;
            const icon = day.weather[0].icon;

            // This checks to see if the day is today or a nextDay. if the dayIndex is 0 it will record for today, and if not it will record for the nextDay(dayIndex).
            if (dayIndex === 0) {
                daysList.todayData = { temp, humid, wind, icon, date };
            } else {
                daysList[`nextDay${dayIndex}`] = { temp, humid, wind, icon, date };
            }
        });

        // Here we call loadWeatherData parsing daysList to use the information we just recorded.
        loadWeatherData(daysList);
        // We then call the renderHistoryButtons function to have the cities we entered in rendered as buttons for the user to click on to load that city's weather data.
        renderHistoryButtons();

    // Once again having the same error check from before but without an alert.
    }).catch(error => {
        if (error instanceof TypeError && error.message.includes('API key')) {
            console.error('Invalid API key:', error);
          } else {
            console.error('There was a problem with the Fetch operation:', error);
          }
    });
}

// This function is used to clear our local storage and also set cityData to be empty and then call the renderHistoryButtons so that no buttons will appear.
function delHistory() {
    localStorage.setItem("cities", '{}');
    cityData = {};
    renderHistoryButtons();
}

// This function is used to generate the historyButtons for the user to click on to reload previous city data.
function renderHistoryButtons() {
    const historySearch = document.getElementById('searchHistory');
    // Here we are setting cityNumber back to 0 so that the function can run through and stop if greater than 10.
    cityNumber = 0;

    // here we set the innerHTML of the historySearch id element to be empty so that we dont get repeats rendered.
    historySearch.innerHTML = '';

    // This for loop is to run through our cities and generate each button until each is complete or if we get more than 10 it will exit.
    for (const cityName in cityData) {
        // This will check once it has reached 10 cities loaded and return out of the function.
        if(cityNumber >= 10){
            return;
        }
        // These are used to create the button and give it its format for HTML
        const button = document.createElement('button');
        button.textContent = cityName;
        button.className = 'btn btn-default col historyItem';
        button.id = cityName;
        // this adds the eventListener for the buttons to read their respective data.
        button.addEventListener('click', () => {
            readWeatherData(cityName);
        });
        // This will then append as a child element to the historySearch element
        historySearch.appendChild(button);
        // We then increase our cityNumber by 1 to keep track of the number of cities.
        cityNumber++;

        // a button will be formatted as folllows in the HTML: <button class="btn btn-default col historyItem" id="${cityName}">${cityName}</button>
    }
};

// This functions loads our weatherData we got from our previous function and loads that data to be displayed on the HTML.
function loadWeatherData(daysList) {
        // This grabs the elements on our HTML so that we can display our information were we like on our HTML page.
        const weatherContainer = document.getElementById('weatherToday');
        const forecasts = document.getElementById('dayCastTitle');
        const upcomingDays = document.getElementById('fiveCasts');

        // This adds the text to the page as we dont want any text to be showing by default.
        forecasts.textContent = '5-Day Forecast:';

        // we are then setting the innerHTML of weatherContainer to have our weather for today.
        weatherContainer.innerHTML = `
        <div class="todayWeather">
            <h1>${daysList.cityName} ${daysList.todayData.date} <img src="https://openweathermap.org/img/wn/${daysList.todayData.icon}.png"></h1>
            <h5>Temp: ${daysList.todayData.temp}<span>&#176;</span>C</h3>
            <h5>Wind: ${daysList.todayData.wind} KMPH</h3>
            <h5>Humidity: ${daysList.todayData.humid} %</h3>
        </div>`

        // We then set an emtpy space so that any old information can be removed before our next lot of information can be posted.
        upcomingDays.innerHTML = '';

        // Here we have made a for loop to go through each of the nextDay datas and display the next 5 days below.
        for (let i = 1; i <= 5; i++) {
            const dayData = daysList[`nextDay${i}`];
            const dayHtml = `
                <div class="upcomingForecast" id="day${i}">
                    <h2>${dayData.date}</h2>
                    <img src="https://openweathermap.org/img/wn/${dayData.icon}.png">
                    <p>Temp: ${dayData.temp}<span>&#176;</span>C</p>
                    <p>Wind: ${dayData.wind} KMPH</p>
                    <p>Humidity: ${dayData.humid} %</p>
                </div>`;
            upcomingDays.innerHTML += dayHtml;
        }
};

// This function is called when the page is ready, this will call the renderHistoryButtons function as if we are reloading the page it can get it from memory.
$(document).ready(function () {
    renderHistoryButtons();
});