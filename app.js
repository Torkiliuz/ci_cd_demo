import {
  fetchCities,
  fetchWeather,
  formatWeatherData
} from "./script.js";


// =====================
// DOM ELEMENTS
// =====================
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const resultsList = document.getElementById("results");
const weatherDiv = document.getElementById("weather");

// =====================
// EVENT LISTENERS
// =====================
searchBtn.addEventListener("click", onSearchClick);

// Optional: press Enter to search
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    onSearchClick();
  }
});

// =====================
// UI LOGIC
// =====================
async function onSearchClick() {
  const query = cityInput.value.trim();
  if (!query) return;

  clearUI();

  try {
    const cities = await fetchCities(query);

    if (cities.length === 0) {
      showMessage("No cities found");
      return;
    }

    renderCityResults(cities);
  } catch (error) {
    console.error(error);
    showMessage("Failed to load cities");
  }
}

async function onCitySelected(lat, lon) {
  weatherDiv.innerHTML = "Loading weather...";

  try {
    const data = await fetchWeather(lat, lon);
    const weather = formatWeatherData(data);
    renderWeather(weather);
  } catch (error) {
    console.error(error);
    showMessage("Failed to load weather");
  }
}

// =====================
// RENDER FUNCTIONS
// =====================
function renderCityResults(cities) {
  resultsList.innerHTML = "";

  cities.forEach(city => {
    const li = document.createElement("li");
    li.className = "city-item";
    li.textContent = `${city.name}, ${city.country}`;

    li.addEventListener("click", () => {
      resultsList.innerHTML = "";
      onCitySelected(city.lat, city.lon);
    });

    resultsList.appendChild(li);
  });
}

function renderWeather(weather) {
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  weatherDiv.innerHTML = `
    <div class="weather-card">
      <img src="${iconUrl}" alt="${weather.description}" />
      <div class="weather-info">
        <div class="temp">${weather.temp}°C</div>
        <div class="wind">💨 ${weather.wind} m/s</div>
        <div class="desc">${weather.description}</div>
      </div>
    </div>
  `;
}

function clearUI() {
  resultsList.innerHTML = "";
  weatherDiv.innerHTML = "";
}

function showMessage(message) {
  weatherDiv.innerHTML = `<div class="message">${message}</div>`;
}
