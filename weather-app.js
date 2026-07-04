'use strict';
const apiKey = 'b0380e75c8ba98bfd79e25ab3e08fa66';
// const apiUrl =
//   'https://api.openweathermap.org/data/2.5/weather?&units=metric&q=hyderabad';

const searchBtn = document.querySelector('.search');
const locationInput = document.querySelector('.location');

async function checkWeather(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?&units=metric&q=${city}&appid=${apiKey}`);
  const data = await response.json();

  console.log(data);
  document.querySelector('.location').innerHTML = data.name;
  document.querySelector('.temperature').innerHTML =
    `<span class="material-symbols-outlined sunnyIcon">sunny</span> ${data.main.temp}&deg;C`;
  document.querySelector('.humidity').innerHTML = data.main.humidity;
  document.querySelector('.wind').innerHTML = data.wind.speed;
}

searchBtn.addEventListener('click', () => {
  const cityName = locationInput.value;
  if(cityName){
  checkWeather(cityName);
  } else {
    alert('Please enter name')
  }
});