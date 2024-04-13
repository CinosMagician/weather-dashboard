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

        console.log(cityName);
        console.log(data);
        const cityFoundName = data[0].name;
        cityData[cityFoundName] = {
            lat: data[0].lat,
            lon: data[0].lon
        };
        console.log(cityData);
        localStorage.setItem("cities", JSON.stringify(cityData));
        console.log()

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
            const humidity = day.main.humidity;
            const wind = day.wind.speed;
            const icon = day.weather[0].icon;

            if (dayIndex === 0) {
                daysList.todayData = { temp, humidity, wind, icon, date };
            } else {
                daysList[`nextDay${dayIndex}`] = { temp, humidity, wind, icon, date };
            }
        });
        renderHistoryButtons();
        console.log(daysList);

    }).catch(error => {
        if (error instanceof TypeError && error.message.includes('API key')) {
            console.error('Invalid API key:', error);
          } else {
            console.error('There was a problem with the Fetch operation:', error);
          }
    });
}

citySearch.addEventListener('click', readCityName);



// historyButton.addEventListener('click', loadHistory);

// function extractWeatherData() {
//    Insert Code Here *//
// };

// today = {
//     temp: x,
//     humid: y,
//     wind: z,
//     icon: icon
// };
// repeat for day1 - day5 *//

// weatherDataCollection = [];

// weatherDataCollection.push(today, day1, day2, day3, day4, day5);

// cities[cityIndex].weatherData = weatherDataCollection;

// save new data from cities to localStorage; *// 

// inside of our first function:
// for (cityIndex in cities){
//     if(cities.name === cityName){
//     function existCity(){
//     // get from storage[cityIndex] data;
//     return;
//     }};
// }

// called when ever a new city is loaded or old city is clicked/loaded when already in the list *//
function loadCity() {
    console.log(`History Loaded`);
};

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
        const button = `<button type="button" class="btn btn-default col historyItem" id="${cityName}">${cityName}</button>`;
        historySearch.insertAdjacentHTML('beforeend', button);
        cityNumber++;
    }
};

$(document).ready(function () {
    renderHistoryButtons();
});