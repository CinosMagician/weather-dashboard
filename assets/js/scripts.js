let cityNameInput = document.getElementById('cityNameInput');
let citySearch = document.getElementById('citySearch');
const apiKey = '3497d479440187a42c3d57d843d1a6f2';
let cityData = JSON.parse(localStorage.getItem("cities")) || [];;
let cityDataIndex = JSON.parse(localStorage.getItem("cityDataIndex")) || 0;
let cityName = JSON.parse(localStorage.getItem("cityName"));
let lon = 0;
let lat = 0;
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
        // the data will then be processed here

        for (let i = 0; i < cityDataIndex; i++){
            if(cityData[i].cityName === cityName){
                console.log(`Already exists on the list`)
                return;
            }
        }
        cityData.push({
            cityName: cityName,
            lat: data[0].lat,
            lon: data[0].lon
        });
        localStorage.setItem("cities", JSON.stringify(cityData));

        readWeatherData();

        cityDataIndex++;
        localStorage.setItem("cityDataIndex", JSON.stringify(cityDataIndex));

    }).catch(error => {
        if (error instanceof TypeError && error.message.includes('API key')) {
            console.error('Invalid API key:', error);
          } else {
            console.error('There was a problem with the Fetch operation:', error);
          }
    });

}

function readWeatherData(){
    const lon = cityData[cityDataIndex].lon;
    const lat = cityData[cityDataIndex].lat;
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(weatherApiUrl).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        // the data will then be processed here
        console.log(data);
    }).catch(error => {
        if (error instanceof TypeError && error.message.includes('API key')) {
            console.error('Invalid API key:', error);
          } else {
            console.error('There was a problem with the Fetch operation:', error);
          }
    });
}

citySearch.addEventListener('click', readCityName);