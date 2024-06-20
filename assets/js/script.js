const APIKey = 'd036f25ab5a27eb890eb96c7ec17e827';
const geoUrl = `http://api.openweathermap.org/geo/1.0/direct`;
const cityInputEl = document.querySelector('#cityInput');

// build the URL for the city fetch request
const prepCityUrl = function (cityName) {
  //console.log(`${geoUrl}?q=${cityName}&limit=5&appid=${APIKey}`);
  return `${geoUrl}?q=${cityName}&limit=5&appid=${APIKey}`;
};
// build the URL for the forecast fetch request
const prepForecastUrl = function (lat, lon) {
  return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;
};

const cityAlert = (cityName) => {
  console.log('City Alert Function Running');
  // Display Alert
  const alertHtml = ` 
     <div class="alert alert-warning alert-dismissible fade show" role="alert"><strong>${cityName}</strong> could not be found! Please try searching a different city.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`;
  $('#alert-placeholder').html(alertHtml);
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
      return city;
    } else {
      console.log('No City Found');
      return null;
    }
    //return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

// Display Forecast Found By Latitude and Longitude
const getForecast = async (lat, lon) => {
  try {
    console.log('fetchForecast For Lat: ', lat, ' Lon: ', lon);
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

// Handle Form Submission
const handleSubmit = (event) => {
  console.log('Handle Submit Funciton Running');
  event.preventDefault();
  const cityInput = cityInputEl.value.trim();
  console.log('City Input: ', cityInput);
  if (cityInput) {
    searchCity(cityInput).then((cityData) => {
      if (cityData) {
        console.log('City Data: ', cityData);
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
  $('#searchBtn').on('click', handleSubmit);
});
