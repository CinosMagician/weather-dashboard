const apiKey = '3497d479440187a42c3d57d843d1a6f2';
// The use of the apiKey variable is so that if the apiKey ever needed to change and a call is made multiple times it can be flexible
const weatherApiUrl = 'api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}';
const locationApiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}';
let lat = 0;
let lon = 0;
let cityName = '';

fetch(locationApiUrl).then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}).then(data => {
    // the data will then be processed here
}).catch(error => {
    if (error instanceof TypeError && error.message.includes('API key')) {
        console.error('Invalid API key:', error);
      } else {
        console.error('There was a problem with the Fetch operation:', error);
      }
});

fetch(weatherApiUrlapiUrl).then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}).then(data => {
    // the data will then be processed here
}).catch(error => {
    if (error instanceof TypeError && error.message.includes('API key')) {
        console.error('Invalid API key:', error);
      } else {
        console.error('There was a problem with the Fetch operation:', error);
      }
});