const APIKey = 'd036f25ab5a27eb890eb96c7ec17e827';
const geoUrl = `http://api.openweathermap.org/geo/1.0/direct`;
const lat = '27.2939333';
const lon = '-80.3503283';
//const dataUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;

//q=Miami&limit=5&appid=d036f25ab5a27eb890eb96c7ec17e827?
//q=Port%20Saint%20Lucie&limit=5&appid=d036f25ab5a27eb890eb96c7ec17e827

const prepCityUrl = function (cityName) {
  console.log(`${geoUrl}?q=${cityName}&limit=5&appid=${APIKey}`);
  return `${geoUrl}?q=${cityName}&limit=5&appid=${APIKey}`;
};

// Search City To Find Latitude and Longitude
const searchCity = function (cityName) {
  console.log('City Name: ', cityName);
  fetch(prepCityUrl(cityName))
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data) {
        console.log(data);
        console.log(`Lat : ${data[0].lat} , Lon: ${data[0].lon}`);
      }
    })
    .catch((error) => {
      console.error('Fetch error:', error);
    });
};

const getForecast = (event) => {
  event.preventDefault();
  const cityInput = cityInputEl.value.trim();

  if (cityInput) {
    searchCity(cityInput);

    //Possibly Clear Weather Card Elements txt values?
    // card elements here
    nameInputEl.value = '';
  } else {
    alert('Please enter a city to get your weather forecast!');
  }
};

$(document).ready(function () {});

const staticCity = 'Port%20Saint%20Lucie';
searchCity(staticCity);

// Get Weather Forecast
// getWeatherForecast(forecastURL)
//   .then((data) => {})
//   .catch((error) => {});
// searchCity(cityURL)
// .then((data) => {
//     if (data && data.length > 0) {
//     // Ensure data is not empty
//     const city = data[0]; // Assuming we want the first result
//     console.log(city.name);
//     console.log(city.lat);
//     console.log(city.lon);
//     } else {
//     console.log('No data found for the requested city.');
//     }
// })
// .catch((error) => {
//     console.error('Error in searchCity:', error);
// });

//const url = `https://api.openweathermap.org/data/2.5/forecast?lat=27&lon=-80&appid=${APIKey}`;

//   let city = weather.name;
//   let temp = weather.main.temp;
//   let highTemp = weather.main.temp_max;
//   let lowTemp = weather.main.temp_min;
//   let humidity = weather.main.humidity;
//   let windSpeed = weather.wind.speed;
//   let uvIndex = weather.main.uvi;
//   let pressure = weather.main.pressure;

//   // assign text content to the elements
//   document.getElementById('city').textContent = city;
//   document.getElementById('temp').textContent = temp;
//   document.getElementById('highTemp').textContent = highTemp;
//   document.getElementById('lowTemp').textContent = lowTemp;
//   document.getElementById('humidity').textContent = humidity;
//   document.getElementById('windSpeed').textContent = windSpeed;
//   document.getElementById('uvIndex').textContent = uvIndex;
//   document.getElementById('pressure').textContent = pressure;
