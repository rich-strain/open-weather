const APIKey = 'd036f25ab5a27eb890eb96c7ec17e827';
const geoUrl = `http://api.openweathermap.org/geo/1.0/direct`;
const searchFormEl = document.querySelector('#searchForm');
const cityInputEl = document.querySelector('#cityInput');

// const lat = '27.2939333';
// const lon = '-80.3503283';

// build the URL for the city fetch request
const prepCityUrl = function (cityName) {
  //console.log(`${geoUrl}?q=${cityName}&limit=5&appid=${APIKey}`);
  return `${geoUrl}?q=${cityName}&limit=5&appid=${APIKey}`;
};
// build the URL for the forecast fetch request
const prepForecastUrl = function (lat, lon) {
  return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;
};

// Search City To Find Latitude and Longitude
const searchCity = function (cityName) {
  console.log('searchCity: ', cityName);
  fetch(prepCityUrl(cityName))
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.length > 0) {
        const city = data[0];
        console.log(city.name);
        console.log(city.lat);
        console.log(city.lon);
        return city;
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Fetch error:', error);
    });
};

const getForecast = (event) => {
  event.preventDefault();
  const cityInput = cityInputEl.value.trim();
  console.log('City Input: ', cityInput);

  if (cityInput) {
    const cityData = searchCity(cityInput);
    console.log('City Data: ', cityData);
  }
};

searchFormEl.addEventListener('submit', getForecast);
