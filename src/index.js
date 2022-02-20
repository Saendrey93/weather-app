// Date element-Feature: Weekday, day/month/year, hour:minutes; id="date-element"

function formateDate(date) {
  let hour = date.getHours();
  if (hour < 10) hour = `0${hour}`;

  let minutes = date.getMinutes();
  if (minutes < 10) minutes = `0${minutes}`;

  let year = date.getFullYear();

  let month = date.getMonth() + 1;
  if (month < 10) month = `0${month}`;

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let weekday = days[date.getDay()];

  let dayIndex = date.getDate();
  if (dayIndex < 10) dayIndex = `0${dayIndex}`;

  return `${weekday}, ${dayIndex}/${month}/${year}, ${hour}:${minutes}`;
}

function updateTime() {
  let dateElement = document.querySelector("#date-element");
  let currentDate = new Date();

  dateElement.innerHTML = formateDate(currentDate);
}

updateTime();

// Forecast-feature: id="forecast"

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecastCelsius(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (0 < index && index < 6) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col-2">${formatDay(forecastDay.dt)}</div>
    <div class="col-2 forecastIcon"><img
    src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
    alt=""
    width="40"
    />
    </div>
    <div class="col-2">${Math.round(forecastDay.temp.day)}°</div>
    <div class="col-6">${forecastDay.weather[0].description}</div>
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getCoordsCelsius(coordinates) {
  let apiKey = "006c612abb68e7d0e3bce0ff471b30fe";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecastCelsius);
}

//Search city-Feature

function changeWeather(response) {
  baseTemp = response.data.main.temp;

  let city = document.querySelector("#city");
  let icon = document.querySelector("#icon");
  let tempToday = document.querySelector("#temp-today");
  let mainDescription = document.querySelector("#main-description");
  let windSpeed = document.querySelector("#wind-speed");
  let humidity = document.querySelector("#humidity");

  city.innerHTML = response.data.name;
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  icon.setAttribute("alt", response.data.weather[0].main);
  tempToday.innerHTML = Math.round(baseTemp);
  unit.innerHTML = "Celsius";
  mainDescription.innerHTML = response.data.weather[0].description;
  windSpeed.innerHTML = Math.round(response.data.wind.speed * 3.6);
  humidity.innerHTML = Math.round(response.data.main.humidity);

  updateTime();
  getCoordsCelsius(response.data.coord);
}

function searchWeather(city) {
  let apiKey = "006c612abb68e7d0e3bce0ff471b30fe";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(changeWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  searchWeather(city);
}

let currentCity = document.querySelector("#search-form");
currentCity.addEventListener("submit", handleSubmit);

let baseTemp = null;
let unit = document.querySelector("#unit");

searchWeather("Berlin");

// Current position-Feature: button-id="location"

function retrieveLocationWeather(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "006c612abb68e7d0e3bce0ff471b30fe";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(changeWeather);
}

function searchLocation(event) {
  navigator.geolocation.getCurrentPosition(retrieveLocationWeather);
}

let locationButton = document.querySelector("#location");
locationButton.addEventListener("click", searchLocation);

// Change unit-Feature: id="temp-today"; id="unit"
// °F = °C * 9 / 5 + 32

function displayForecastFahrenheit(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (0 < index && index < 6) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col-2">${formatDay(forecastDay.dt)}</div>
    <div class="col-2 forecastIcon"><img
    src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
    alt=""
    width="40"
    />
    </div>
    <div class="col-2">${Math.round(forecastDay.temp.day)}°</div>
    <div class="col-6">${forecastDay.weather[0].description}</div>
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getCoordsFahrenheit(response) {
  let apiKey = "006c612abb68e7d0e3bce0ff471b30fe";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&units=imperial&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecastFahrenheit);
}

function getCityFahrenheit(city) {
  let apiKey = "006c612abb68e7d0e3bce0ff471b30fe";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  axios.get(apiUrl).then(getCoordsFahrenheit);
}

function changeUnit(event) {
  event.preventDefault();
  let tempToday = document.querySelector("#temp-today");
  if (unit.textContent === "Celsius") {
    let fahrenheitTemp = (baseTemp * 9) / 5 + 32;
    tempToday.innerHTML = Math.round(fahrenheitTemp);
    unit.innerHTML = "Fahrenheit";
    unit.title = "Conversion into Celsius";

    getCityFahrenheit(document.querySelector("#city").innerHTML);
  } else {
    searchWeather(document.querySelector("#city").innerHTML);
  }
  updateTime();
}

let currentUnit = document.querySelector("#unit");
currentUnit.addEventListener("click", changeUnit);

// Update page-Feature: id="update-button"

function grabDisplayedCity() {
  event.preventDefault();
  let city = document.querySelector("#city").innerHTML;
  searchWeather(city);
}

let updateButton = document.querySelector("#update-button");
updateButton.addEventListener("click", grabDisplayedCity);
