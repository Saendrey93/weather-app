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

// Change unit-Feature: id="temp-today"; id="unit"
// °F = °C * 9 / 5 + 32 <-> (°F − 32) * 5/9

function changeUnit(event) {
  event.preventDefault();
  let tempToday = document.querySelector("#temp-today");
  if (unit.textContent === "Celsius") {
    let fahrenheitTemp = (baseTemp * 9) / 5 + 32;
    tempToday.innerHTML = Math.round(fahrenheitTemp);
    unit.innerHTML = "Fahrenheit";
    unit.title = "Conversion into Celsius";
  } else {
    tempToday.innerHTML = Math.round(baseTemp);
    unit.innerHTML = "Celsius";
    unit.title = "Conversion into Fahrenheit";

    updateTime();
  }
}

let currentUnit = document.querySelector("#unit");
currentUnit.addEventListener("click", changeUnit);

//Search-Feature

function changeWeather(response) {
  console.log(response);
  let city = document.querySelector("#city");
  city.innerHTML = response.data.name;
  baseTemp = response.data.main.temp;
  document.querySelector("#temp-today").innerHTML = Math.round(baseTemp);
  unit.innerHTML = "Celsius";
  let mainDescription = document.querySelector("#main-description");
  mainDescription.innerHTML = response.data.weather[0].main;
  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = Math.round(response.data.wind.speed * 3.6);
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = Math.round(response.data.main.humidity);

  updateTime();
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
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrieveLocationWeather);
}

let button = document.querySelector("#location");
button.addEventListener("click", searchLocation);
