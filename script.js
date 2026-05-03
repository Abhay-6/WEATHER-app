const API_KEY = "19a01ef50bb0e13bb150bbc8bcd78eb9";

const cityInput = document.getElementById("cityInput");
const weatherContainer = document.getElementById("weatherContainer");
const forecastContainer = document.getElementById("forecastContainer");

/* 🌙 Dark Mode */
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

/* 🔍 Search Weather */
document.getElementById("searchBtn").addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
    getForecast(city);
  }
});

/* 📍 Location Weather */
document.getElementById("locationBtn").addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

    const res = await fetch(url);
    const data = await res.json();

    displayWeather(data);
  });
});

/* 🌦 Get Current Weather */
async function getWeather(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();

    if (data.cod !== 200) throw new Error("City not found");

    displayWeather(data);
  } catch (err) {
    weatherContainer.innerHTML = `<p>${err.message}</p>`;
  }
}

/* 📅 Get Forecast */
async function getForecast(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );
  const data = await res.json();

  forecastContainer.innerHTML = "";

  data.list.filter((_, i) => i % 8 === 0).forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${item.dt_txt.split(" ")[0]}</p>
      <p>${item.main.temp}°C</p>
    `;
    forecastContainer.appendChild(div);
  });
}

/* 📊 Display Weather */
function displayWeather(data) {
  weatherContainer.classList.remove("hidden");

  weatherContainer.innerHTML = `
    <h2>${data.name}</h2>
    <p>${data.main.temp}°C</p>
    <p>${data.weather[0].description}</p>
    <p>💧 ${data.main.humidity}% | 🌬 ${data.wind.speed} m/s</p>
  `;
}