'use strict';

const weatherMap = {
  Clouds: 'cloud',
  Clear: 'clear_day',
  Rain: 'rainy',
  Drizzle: 'rainy',
  Thunderstorm: 'thunderstorm',
  Snow: 'ac_unit',
  Mist: 'foggy',
  Haze: 'foggy',
  Fog: 'foggy',
};

let locationInput = document.querySelector('.location');

async function checkWeather(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?&units=metric&q=${city}&appid=b0380e75c8ba98bfd79e25ab3e08fa66`,
  );
  const data = await response.json();
  const locationWeather = data;

  const condition = data.weather[0].main;
  const iconName = weatherMap[condition] || 'help';

  console.log(data);
  const precipitation = data.rain?.['1h'] ?? data.snow?.['1h'] ?? '0';
  document.querySelector('.precipitation').innerHTML =
    `${precipitation} Precipitation`;
  document.querySelector('.location').innerHTML = data.name;
  document.querySelector('.temperature').innerHTML =
    `<span class="material-symbols-outlined sunnyIcon">${iconName}</span> ${data.main.temp}&deg;C`;
  document.querySelector('.humidity').innerHTML =
    `${data.main.humidity}% Humidity`;
  document.querySelector('.wind').innerHTML = `${data.wind.speed} Km/h Wind`;
}

async function fetchCityCoordinates(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

  const options = {
    headers: {
      'User-Agent': 'MyWeatherApp_ForLearning_ContactEmail@example.com',
    },
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data && data.length > 0) {
      console.table(data[0]);
      document.querySelector('.coordinates').innerHTML =
        `${data[0].lat}, ${data[0].lon}`;

// Chops the dispaly_name array and displays State and Country

      const locationDetails = data[0].display_name;
      const parts = locationDetails.split(',').map((part) => part.trim());
      const stateCountry = parts
        .filter((part) => {
          const isNotPin = isNaN(part);
          return isNotPin;
        })
        .slice(-2)
        .join(', ');
        console.log(stateCountry);
      console.log(locationDetails);
      document.querySelector('.locationDetails').innerHTML = `${stateCountry}`;
    } else {
      console.log('No results found for', query);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
locationInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    fetchCityCoordinates(locationInput.value);
    const cityName = locationInput.value;
    if (cityName) {
      checkWeather(cityName);
    } else {
      alert('Please enter a city name!');
    }
  }
});

