import {
  fetchCities,
  fetchWeather,
  formatWeatherData
} from "../script.js";

// Mock the global fetch API
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

// ===============================
// TEST 1: City search API call
// ===============================
test("fetchCities calls OpenWeather geo API with correct query", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => []
  });

  await fetchCities("Frankfurt");

  expect(fetch).toHaveBeenCalledTimes(1);

  const calledUrl = fetch.mock.calls[0][0];
  expect(calledUrl).toContain("geo/1.0/direct");
  expect(calledUrl).toContain("q=Frankfurt");
  expect(calledUrl).toContain("limit=5");
});

// ===============================
// TEST 2: Weather data formatting
// ===============================
test("formatWeatherData extracts temp, wind and icon", () => {
  const mockApiResponse = {
    main: { temp: 1.2 },
    wind: { speed: 5.14 },
    weather: [{ icon: "09d", description: "shower rain" }]
  };

  const result = formatWeatherData(mockApiResponse);

  expect(result).toEqual({
    temp: 1,
    wind: 5.14,
    icon: "09d",
    description: "shower rain"
  });
});

// ===============================
// TEST 3: Weather API call
// ===============================
test("fetchWeather calls weather API with lat, lon and metric units", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({})
  });

  await fetchWeather(50.11, 8.68);

  const calledUrl = fetch.mock.calls[0][0];
  expect(calledUrl).toContain("data/2.5/weather");
  expect(calledUrl).toContain("lat=50.11");
  expect(calledUrl).toContain("lon=8.68");
  expect(calledUrl).toContain("units=metric");
});
