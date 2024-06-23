const APIKey = 'd036f25ab5a27eb890eb96c7ec17e827';
const geoUrl = `http://api.openweathermap.org/geo/1.0/direct`;
const searchFormEl = document.querySelector('#searchForm');
const cityInputEl = document.querySelector('#cityInput');
let citiesArray = JSON.parse(localStorage.getItem('citiesArray') || '[]');

// build the URL for the city fetch request
const prepCityUrl = function (cityName) {
  return `${geoUrl}?q=${cityName}&limit=5&appid=${APIKey}`;
};
// build the URL for the forecast fetch request
const prepForecastUrl = function (lat, lon) {
  return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`;
};

const prepCurrentUrl = function (lat, lon) {
  return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&cnt=5&appid=${APIKey}`;
};

const cityAlert = (cityName) => {
  // Generate Boostrap Alert
  const alertHtml = ` 
     <div class="alert alert-info alert-dismissible fade show" role="alert"><strong class="text-uppercase">${cityName}</strong> could not be found! Please try searching a different city.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`;
  $('#alert-placeholder').html(alertHtml);
};

// Display Search History
const displaySearchHistory = () => {
  const searchHistory = JSON.parse(localStorage.getItem('citiesArray')) || [];
  // loop searchHistory array and create buttons for each city
  for (const city of searchHistory) {
    console.log(`Search History: ${city.city}, Latitude: ${city.lat}, Longitude: ${city.lon}`);
  }
};

// Search City To Find Latitude and Longitude
const searchCity = async (cityName) => {
  try {
    const response = await fetch(prepCityUrl(cityName));
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data && data.length > 0) {
      const city = data[0];
      // Create object to store city data
      const cityObj = { city: city.name, lat: city.lat, lon: city.lon };
      // Push to citiesArray
      citiesArray.push(cityObj);
      // Update localStorage
      localStorage.setItem('citiesArray', JSON.stringify(citiesArray));
      displaySearchHistory();
      return city;
    } else {
      console.log('No City Found, Generate Alert!');
      return null;
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

// Display Forecast Found By Latitude and Longitude
const getForecast = async (lat, lon) => {
  try {
    const response = await fetch(prepForecastUrl(lat, lon));
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const forecast = await response.json();
    console.log('Forecast: ', forecast);
    if (forecast.list && forecast.list.length > 0) {
      console.log('Forecast Found!', forecast.list);
      const list = forecast.list;
      console.log('Forecast List Length: ', list.length);

      // Create array to store forecast data
      let forecastArray = [];
      // for loop to iterate through the forecast list
      for (const days of list) {
        if (dayjs(days.dt_txt).format('HH:mm:ss') === '12:00:00') {
          const forecastObj = {
            dayOfWeek: dayjs(days.dt_txt).format('ddd'),
            tempHigh: Math.floor(days.main.temp_max),
            icon: days.weather[0].icon,
          };
          forecastArray.push(forecastObj);
        }
      }
      // Clear the forecast div for new content
      $('#five-day-forecast').empty();
      for (const day of forecastArray) {
        //const forecastDiv = $('#five-day-forecast');
        const forecastDiv = $('<div>').addClass('p-4 mx-3 d-flex flex-column justify-content-center align-items-center forecast__card');
        const dayOfWeek = $('<span>').text(day.dayOfWeek);
        const iconContainer = $('<div>').addClass('forecast-icon-container').attr('data-icon', day.icon);
        const tempHigh = $('<span>').html(`${day.tempHigh}&deg;`);
        forecastDiv.append(dayOfWeek, iconContainer, tempHigh);
        $('#five-day-forecast').append(forecastDiv);
      }
    } else {
      console.log('Something went wrong, forecast not available!');
      return null;
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

// Display Forecast Found By Latitude and Longitude
const getCurrent = async (lat, lon) => {
  try {
    const response = await fetch(prepCurrentUrl(lat, lon));
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const current = await response.json();
    console.log('Current: ', current);
    if (current !== null) {
      $('#city').html(current.name.toUpperCase());
      $('#temp').html(`${Math.floor(current.main.temp)}&deg;`);
      $('#humidity').html(`${current.main.humidity} %`);
      $('#wind').html(`${current.wind.speed.toFixed(1)} mph`);
      console.log(`Current Weather Icon: ${current.weather[0].icon}`);
      //$('#lrg-icon-container').attr('class', setIcon(current.weather[0].icon));
      $('.lrg-icon-container').attr('data-icon', current.weather[0].icon);
    } else {
      console.log('Something went wrong, current weather not available!');
      return null;
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const setIcon = (iconCode) => {
  console.log(`setIcon: ${iconCode}`);
  if (clouds.includes(iconCode)) {
    console.log(`iconCode: ${iconCode} found, returning fa-cloud`);
    return 'fa-solid fa-cloud';
  } else if (partlyCloudy.includes(iconCode)) {
    return 'fa-solid fa-cloud-sun';
  } else if (partlyCloudyNight.includes(iconCode)) {
    return 'fa-solid fa-cloud-moon';
  } else if (rain.includes(iconCode)) {
    return 'fa-solid fa-cloud-showers-heavy';
  } else if (lightRain.includes(iconCode)) {
    return 'fa-solid fa-cloud-sun-rain';
  } else if (lightRainNight.includes(iconCode)) {
    return 'fa-solid fa-cloud-moon-rain';
  } else if (thunderstorm.includes(iconCode)) {
    return 'fa-solid fa-bolt';
  } else if (snow.includes(iconCode)) {
    return 'fa-solid fa-snowflake';
  } else if (haze.includes(iconCode)) {
    return 'fa-solid fa-smog';
  } else if (clearSky.includes(iconCode)) {
    return 'fa-solid fa-sun';
  } else if (clearSkyNight.includes(iconCode)) {
    return 'fa-solid fa-moon';
  } else {
    return 'fa-solid fa-poo-storm';
  }
};

// Handle Form Submission
const handleSubmit = (event) => {
  event.preventDefault();
  const cityInput = cityInputEl.value.trim();
  console.log('City Input: ', cityInput);
  if (cityInput) {
    searchCity(cityInput).then((cityData) => {
      if (cityData) {
        console.log('City Data: ', cityData);
        getCurrent(cityData.lat, cityData.lon);
        getForecast(cityData.lat, cityData.lon);
      } else {
        console.log('Trigger City Alert');
        const alert = cityAlert(cityInput);
      }
      //getForecast(cityData.lat, cityData.lon);
    });
  }
};

// Load Page with Miami Weather
const defaultWeather = () => {
  const cityInput = 'PORT SAINT LUCIE';
  console.log('City Input: ', cityInput);
  if (cityInput) {
    searchCity(cityInput).then((cityData) => {
      if (cityData) {
        console.log('City Data: ', cityData);
        getCurrent(cityData.lat, cityData.lon);
        getForecast(cityData.lat, cityData.lon);
      } else {
        console.log('Trigger City Alert');
        const alert = cityAlert(cityInput);
      }
      //getForecast(cityData.lat, cityData.lon);
    });
  }
};

$(document).ready(function () {
  // add event listeners
  defaultWeather();
  $('#searchBtn').on('click', handleSubmit);
});
