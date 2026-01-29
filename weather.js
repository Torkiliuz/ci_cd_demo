export function buildGeoUrl(query, apiKey) {
  return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;
}

export function buildWeatherUrl(lat, lon, apiKey) {
  return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
}

export function formatWeather(data) {
  return {
    temp: data.main.temp,
    wind: data.wind.speed,
    icon: data.weather[0].icon
  };
}
