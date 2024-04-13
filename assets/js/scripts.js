const cityNameInput = document.getElementById('cityNameInput');
const citySearch = document.getElementById('citySearch');
const deleteHistoryBtn = document.getElementById('delHistory');
const apiKey = '3497d479440187a42c3d57d843d1a6f2';
const weatherData = [];
let cityData = JSON.parse(localStorage.getItem("cities")) || {};
// The use of the apiKey variable is so that if the apiKey ever needed to change and a call is made multiple times it can be flexible


function readCityName(){
    const cityName = cityNameInput.value;
    const locationApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    fetch(locationApiUrl).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        const cityFoundName = data[0].name;
        cityData[cityFoundName] = {
            lat: data[0].lat,
            lon: data[0].lon
        };
        localStorage.setItem("cities", JSON.stringify(cityData));

        readWeatherData(cityFoundName);

    }).catch(error => {
        if (error instanceof TypeError && error.message.includes('API key')) {
            console.error('Invalid API key:', error);
          } else {
            console.error('There was a problem with the Fetch operation:', error);
          }
    });
}

function readWeatherData(cityFoundName){
    const lon = cityData[cityFoundName].lon;
    const lat = cityData[cityFoundName].lat;
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(weatherApiUrl).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        const daysList = {
            cityName: cityFoundName,
            todayData: {},
            nextDay1: {},
            nextDay2: {},
            nextDay3: {},
            nextDay4: {},
            nextDay5: {}
        };


        const listData = data.list;

        [0, 8, 16, 24, 32, 39].forEach((index, dayIndex) => {
            const day = listData[index];
            const date = dayjs.unix(day.dt).format('DD/MM/YYYY');
            const temp = day.main.temp;
            const humid = day.main.humidity;
            const wind = day.wind.speed;
            const icon = day.weather[0].icon;

            if (dayIndex === 0) {
                daysList.todayData = { temp, humid, wind, icon, date };
            } else {
                daysList[`nextDay${dayIndex}`] = { temp, humid, wind, icon, date };
            }
        });

        loadWeatherData(daysList);
        renderHistoryButtons();

    }).catch(error => {
        if (error instanceof TypeError && error.message.includes('API key')) {
            console.error('Invalid API key:', error);
          } else {
            console.error('There was a problem with the Fetch operation:', error);
          }
    });
}

citySearch.addEventListener('click', readCityName);
deleteHistoryBtn.addEventListener('click', delHistory);

function delHistory() {
    localStorage.setItem("cities", '{}');
    cityData = {};
    renderHistoryButtons();
}

function createHistoryButton(cityFoundName) {
    const button = `<button type="button" class="btn btn-default col historyItem" id="${cityFoundName}">${cityFoundName}</button>`;
    return button;
}

function renderHistoryButtons() {
    const historySearch = document.getElementById('searchHistory');
    let cityNumber = 0;
    historySearch.innerHTML = '';

    for (const cityName in cityData) {
        if(cityNumber >= 10){
            alert(`You cannot have more than 10 cities saved into recent history, please delete your history first`);
            return;
        }
        const button = document.createElement('button');
        button.textContent = cityName;
        button.className = 'btn btn-default col historyItem';
        button.id = cityName;
        button.addEventListener('click', () => {
            readWeatherData(cityName);
        });
        historySearch.appendChild(button);
        cityNumber++;
    }
};

function loadWeatherData(daysList) {
        const weatherContainer = document.getElementById('weatherToday');
        const forecasts = document.getElementById('dayCastTitle');
        const upcomingDays = document.getElementById('fiveCasts');

        forecasts.textContent = '5-Day Forecast:';

        weatherContainer.innerHTML = `
        <div class="todayWeather">
            <h1>${daysList.cityName} ${daysList.todayData.date} <img src="https://openweathermap.org/img/wn/${daysList.todayData.icon}.png"></h1>
            <h5>Temp: ${daysList.todayData.temp}<span>&#176;</span>C</h3>
            <h5>Wind: ${daysList.todayData.wind} KMPH</h3>
            <h5>Humidity: ${daysList.todayData.humid} %</h3>
        </div>`

        upcomingDays.innerHTML = `
        <div class="upcomingForecast" id="day1">
        <h2>${daysList.nextDay1.date}</h2>
            <img src="https://openweathermap.org/img/wn/${daysList.nextDay1.icon}.png">
            <p>Temp: ${daysList.nextDay1.temp}<span>&#176;</span>C</p>
            <p>Wind: ${daysList.nextDay1.wind} KMPH</p>
            <p>Humidity: ${daysList.nextDay1.humid} %</p>
        </div>
        <div class="upcomingForecast" id="day2">
            <h2>${daysList.nextDay2.date}</h2>
            <img src="https://openweathermap.org/img/wn/${daysList.nextDay2.icon}.png">
            <p>Temp: ${daysList.nextDay2.temp}<span>&#176;</span>C</p>
            <p>Wind: ${daysList.nextDay2.wind} KMPH</p>
            <p>Humidity: ${daysList.nextDay2.humid} %</p>
        </div>
        <div class="upcomingForecast" id="day3">
            <h2>${daysList.nextDay3.date}</h2>
            <img src="https://openweathermap.org/img/wn/${daysList.nextDay3.icon}.png">
            <p>Temp: ${daysList.nextDay3.temp}<span>&#176;</span>C</p>
            <p>Wind: ${daysList.nextDay3.wind} KMPH</p>
            <p>Humidity: ${daysList.nextDay3.humid} %</p>
        </div>
        <div class="upcomingForecast" id="day4">
            <h2>${daysList.nextDay4.date}</h2>
            <img src="https://openweathermap.org/img/wn/${daysList.nextDay4.icon}.png">
            <p>Temp: ${daysList.nextDay4.temp}<span>&#176;</span>C</p>
            <p>Wind: ${daysList.nextDay4.wind} KMPH</p>
            <p>Humidity: ${daysList.nextDay4.humid} %</p>
        </div>
        <div class="upcomingForecast" id="day5">
            <h2>${daysList.nextDay5.date}</h2>
            <img src="https://openweathermap.org/img/wn/${daysList.nextDay5.icon}.png">
            <p>Temp: ${daysList.nextDay5.temp}<span>&#176;</span>C</p>
            <p>Wind: ${daysList.nextDay5.wind} KMPH</p>
            <p>Humidity: ${daysList.nextDay5.humid} %</p>
        </div>`
};

$(document).ready(function () {
    renderHistoryButtons();
});