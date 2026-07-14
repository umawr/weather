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

function getOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

async function checkWeather(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?&units=metric&q=${city}&appid=b0380e75c8ba98bfd79e25ab3e08fa66`,
  );
  const data = await response.json();
  const locationWeather = data;

  // This calculates the weather.

  const condition = data.weather[0].main;
  const iconName = weatherMap[condition] || 'help';
  console.log(data);

  const precipitation = data.rain?.['1h'] ?? data.snow?.['1h'] ?? '0';
  document.querySelector('.precipitation').innerHTML =
    `<span class="precipitationValue">${precipitation}</span> <span class="precipitationLabel">Precipitation</span>`;
  document.querySelector('.location').innerHTML = data.name;
  document.querySelector('.temperature').innerHTML =
    `<span class="material-symbols-outlined sunnyIcon">${iconName}</span> ${data.main.temp}&deg;C`;
  document.querySelector('.humidity').innerHTML =
    `<span class="humidityValue">${data.main.humidity}%</span> <span class="humidityLabel">Humidity</span>`;
  document.querySelector('.wind').innerHTML =
    `<span class="windValue">${data.wind.speed}Km/h</span> <span class="windLabel"> Wind</span>`;
  document.querySelector('.feelsLike').innerHTML =
    `<span class="feelsLikeValue">${data.main.feels_like}&deg;C</span> 
   <span class="feelsLikeLabel">Feels Like</span>`;

  // This calculates the time of the location.

  const now = new Date();
  console.log(now);

  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const cityTime = new Date(utcTime + data.timezone * 1000);
  const timeString = cityTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  document.querySelector('.time').innerHTML = timeString + ' in';
  console.log(timeString);
}

async function fetchCityCoordinates(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

  const options = {
    headers: {
      'User-Agent': 'weather',
    },
  };

  // This essentially removes the pin code from the address and displays only the state and country(or whatever is equivalent to that).

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data && data.length > 0) {
      console.log(data[0]);
      document.querySelector('.coordinates').innerHTML =
        `${data[0].lat}, ${data[0].lon}`;

      const locationDetails = data[0].display_name;
      const parts = locationDetails.split(',').map(part => part.trim());
      const stateCountry = parts
        .filter(part => {
          const isNotPin = isNaN(part);
          return isNotPin;
        })
        .slice(-2)
        .join(', ');

      console.log(stateCountry);
      console.log(locationDetails);

      document.querySelector('.locationDetails').innerHTML = stateCountry;
    } else {
      console.log('No results found for', query);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Executes the program after Enter is pressed.

locationInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    fetchCityCoordinates(locationInput.value);
    const cityName = locationInput.value;
    if (cityName) {
      checkWeather(cityName);
    } else {
      alert('Please enter a city name!');
    }

    // This calculates the date and day.

    const now = new Date();
    console.log(
      now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    );

    const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
    const month = now.toLocaleDateString('en-US', { month: 'long' });
    const day = now.getDate();
    const year = now.getFullYear();

    document.querySelector('.day').innerHTML = weekday;
    document.querySelector('.date').innerHTML =
      `${month} ${getOrdinal(day)}, ${year}`;
  }
});
