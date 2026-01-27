const API_KEY = "23cdee0774e73881c1344ae4375658ba";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const resultsList = document.getElementById("results");
const weatherDiv = document.getElementById("weather");

searchBtn.addEventListener("click", searchCity);

async function searchCity() {
  const query = cityInput.value.trim();
  if (!query) return;

  resultsList.innerHTML = "";
  weatherDiv.innerHTML = "";

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    data.forEach(location => {
      const li = document.createElement("li");
      li.textContent = `${location.name}, ${location.country}`;
      li.addEventListener("click", () =>
        fetchWeather(location.lat, location.lon)
      );
      resultsList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}

async function fetchWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const temp = data.main.temp;
    const wind = data.wind.speed;

    const weatherIconId = data.weather[0].icon;
    const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIconId}.png`;
    const hourly = await fetchHourlyForecast(lat, lon);

    const hourlyHtml = hourly.map(h => `
      <div class="hour">
        <div class="hour-time">${h.time}</div>
        <img src="https://openweathermap.org/img/wn/${h.icon}.png">
        <div class="hour-temp">${h.temp}°</div>
      </div>
    `).join("");

    weatherDiv.innerHTML = `
    <div class="weather-card">
      <img src="${weatherIconUrl}" alt="Weather Icon"><br>
      <div class="weather-info">
        <div class="temperature"> ${temp} °C</div>
        <div class="wind">Wind: ${wind} m/s</div>
      </div>
    </div>

    <div class="hourly">
      ${hourlyHtml}
    </div>`;

  } catch (err) {
    console.error(err);
  }
}

async function fetchHourlyForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Take next 4 entries (each is +3h)
    return data.list.slice(0, 4).map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon
    }));
  } catch (err) {
    console.error("Forecast fetch error:", err);
    return [];
  }
}