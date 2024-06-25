const APIKey = 'd036f25ab5a27eb890eb96c7ec17e827';
const geoUrl = `https://api.openweathermap.org/geo/1.0/direct`;
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
  $('#searchHistory').empty();
  const searchHistory = JSON.parse(localStorage.getItem('citiesArray')) || [];
  // loop searchHistory array and create buttons for each city that append to the searchHistory id
  for (const city of searchHistory) {
    const cityBtn = $('<button>')
      .addClass('btn btn-info btn-sm m-1 col-lg-12 search-city font-weight-bold')
      .attr('data-city', city.city)
      .attr('data-action', 'searchCity')
      .text(city.city.toUpperCase());
    $('#searchHistory').append(cityBtn);
  }
};

const updateLocalStorage = (cityObj) => {
  let lat = cityObj.lat;
  let lon = cityObj.lon;
  console.log('Searched City Lat: ', lat);
  console.log('Searched City Lon: ', lon);

  // Check if city already exists in citiesArray
  let cityName = cityObj.city;
  let cityExists = citiesArray.find((obj) => obj.city === cityName);
  console.log('City Exists: ', cityExists);
  if (!cityExists) {
    citiesArray.push(cityObj);
    localStorage.setItem('citiesArray', JSON.stringify(citiesArray));
  } else {
    console.log('City Already Exists in Search History');
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
      let city = data[0];
      // Create object to store city data
      let cityObj = { city: city.name, lat: city.lat, lon: city.lon };

      // Call Function to Push to citiesArray
      updateLocalStorage(cityObj);

      // Display Previous Searches in Left Column Under Search Form
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
    //console.log('Forecast: ', forecast);
    if (forecast.list && forecast.list.length > 0) {
      //console.log('Forecast Found!', forecast.list);
      const list = forecast.list;
      //console.log('Forecast List Length: ', list.length);

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
    //console.log('Current: ', current);
    if (current !== null) {
      $('#city').html(current.name.toUpperCase());
      $('#temp').html(`${Math.floor(current.main.temp)}&deg;`);
      $('#humidity').html(`${current.main.humidity} %`);
      $('#wind').html(`${current.wind.speed.toFixed(1)} mph`);
      //console.log(`Current Weather Icon: ${current.weather[0].icon}`);
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

// Handle Form Submission
const handleSubmit = (event) => {
  event.preventDefault();
  const cityInput = cityInputEl.value.trim();
  console.log('City Input: ', cityInput);
  if (cityInput) {
    searchCity(cityInput).then((cityData) => {
      if (cityData) {
        //console.log('City Data: ', cityData);
        getCurrent(cityData.lat, cityData.lon);
        getForecast(cityData.lat, cityData.lon);
      } else {
        console.log('Trigger City Alert');
        const alert = cityAlert(cityInput);
      }
    });
    // Clear the input field
    cityInputEl.value = '';
  }
};

// Load Page with Miami Weather
const defaultWeather = () => {
  const cityInput = 'Miami';
  console.log('Default City: ', cityInput);
  if (cityInput) {
    searchCity(cityInput).then((cityData) => {
      if (cityData) {
        //console.log('City Data: ', cityData);
        getCurrent(cityData.lat, cityData.lon);
        getForecast(cityData.lat, cityData.lon);
      } else {
        console.log('City Not Found Trigger City Alert');
        const alert = cityAlert(cityInput);
      }
      //getForecast(cityData.lat, cityData.lon);
    });
  }
};

$(document).ready(function () {
  //defaultWeather();
  displaySearchHistory();

  if (citiesArray.length > 0) {
    const city = citiesArray[citiesArray.length - 1];
    searchCity(city.city).then((cityData) => {
      if (cityData) {
        getCurrent(cityData.lat, cityData.lon);
        getForecast(cityData.lat, cityData.lon);
      } else {
        console.log('Trigger City Alert');
        const alert = cityAlert(city);
      }
    });
  } else {
    defaultWeather();
  }

  // Event Listener for Search History Buttons
  document.addEventListener('click', function (event) {
    if (event.target.classList.contains('search-city')) {
      const city = event.target.getAttribute('data-city');
      const action = event.target.getAttribute('data-action');

      if (action === 'searchCity') {
        searchCity(city).then((cityData) => {
          if (cityData) {
            getCurrent(cityData.lat, cityData.lon);
            getForecast(cityData.lat, cityData.lon);
          } else {
            console.log('Trigger City Alert');
            const alert = cityAlert(city);
          }
        });
      }
    }
  });

  // Event Listener for Search Form Click
  $('#searchBtn').on('click', handleSubmit);
});
