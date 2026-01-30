import { test, beforeEach } from "node:test";
import assert from "node:assert";

import {
  fetchCities,
  fetchWeather,
  formatWeatherData
} from "../api.js";

// ===============================
// MOCK FETCH
// ===============================
let fetchCalls = [];

global.fetch = async (url) => {
  fetchCalls.push(url);

  return {
    ok: true,
    json: async () => ({})
  };
};

beforeEach(() => {
  fetchCalls = [];
});

// ===============================
// TEST 1: City search API call
// ===============================
test("fetchCities calls OpenWeather geo API with correct query", async () => {
  global.fetch = async (url) => {
    fetchCalls.push(url);
    return { ok: true, json: async () => [] };
  };

  await fetchCities("Frankfurther");

  assert.strictEqual(fetchCalls.length, 1);
  assert.ok(fetchCalls[0].includes("geo/1.0/direct"));
  assert.ok(fetchCalls[0].includes("q=Frankfurt"));
  assert.ok(fetchCalls[0].includes("limit=5"));
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

  assert.deepStrictEqual(result, {
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
  global.fetch = async (url) => {
    fetchCalls.push(url);
    return { ok: true, json: async () => ({}) };
  };

  await fetchWeather(50.11, 8.68);

  assert.ok(fetchCalls[0].includes("data/2.5/weather"));
  assert.ok(fetchCalls[0].includes("lat=50.11"));
  assert.ok(fetchCalls[0].includes("lon=8.68"));
  assert.ok(fetchCalls[0].includes("units=metric"));
});
