const searchInput = document.getElementById("searchInput");
const suggestionSearch = document.getElementById("suggestionSearch");
const searchButton = document.getElementById("searchButton");
const cityLocation = document.getElementById("locationName");
const cityDate = document.getElementById("cityDate");
const weatherIcon = document.getElementById("weatherIcon");
const weatherTemp = document.getElementById("weatherTemp");
const weatherStatus = document.getElementById("weatherStatus");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const weatherInfo = document.getElementById("weatherInfo");
const searchCity = document.getElementById("searchMessage");
const searchError = document.getElementById("searchError");
const forecastContainer = document.querySelector(".forecast-items-container");

let allCities = [];


// Fetch countries for suggestions
async function fetchCountries() {
  try {
    const response = await fetch("https://countriesnow.space/api/v0.1/countries");
    if (!response.ok) throw new Error("Error fetching countries");
    const data = await response.json();
    allCities = data.data.flatMap(country => country.cities);
  } catch (err) {
    console.error(err);
  }
}
fetchCountries();

// Input suggestions
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = allCities.filter(city => city.toLowerCase().includes(value));
  suggestionSearch.innerHTML = "";
  
  if (filtered.length) {
    filtered.slice(0, 7).forEach(city => {
      const li = document.createElement("li");
      li.textContent = city;
      li.className = "suggestion-result";
      li.style.display = "block";
      li.addEventListener("click", () => {
        searchInput.value = city;
        suggestionSearch.innerHTML = "";
      });
      suggestionSearch.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "No result";
    li.className = "suggestion-result";
    li.style.display = "block";
    suggestionSearch.appendChild(li);
  }
});

// Hide suggestions when clicking outside
document.addEventListener("click", e => {
  if (!e.target.classList.contains("suggestion-result")) {
    suggestionSearch.innerHTML = "";
  }
});

// Enter key selects first suggestion
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const items = document.querySelectorAll(".suggestion-result");
    if (items.length && items[0].textContent !== "No result") {
      searchInput.value = items[0].textContent;
      suggestionSearch.innerHTML = "";
    }
  }
});

// Fetch current weather
async function fetchWeather(city) {
  try {
    const apiKey = "bd0d48a3dff6d38c3a7e1ed5ef43f427";
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error("Error fetching weather");
    const data = await response.json();
    
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Fetch 5-day forecast
async function fetchForecast(city) {
  try {
    const apiKey = "bd0d48a3dff6d38c3a7e1ed5ef43f427";
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error("Error fetching forecast");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Display forecast
function displayForecast(forecastData) {
  if (!forecastData || !forecastData.list) return;
  forecastContainer.innerHTML = "";
  const addedDays = new Set();

  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dayStr = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

    if (!addedDays.has(dayStr) && addedDays.size < 5) {
      addedDays.add(dayStr);
      const div = document.createElement("div");
      div.className = "forecast-item";
      div.innerHTML = `
        <h6>${dayStr}</h6>
        <img src="Assets/icons/${item.weather[0].icon}.png" class="forecast-icon">
        <h5>${Math.round(item.main.temp)}°C</h5>
      `;
      forecastContainer.appendChild(div);
    }
  });
}

// Display weather
function displayWeather(data, forecastData) {
  if (!data) {
    weatherInfo.style.display = "none";
    searchCity.style.display = "none";
    searchError.style.display = "block";
    return;
  }



  cityLocation.textContent = data.name;
  const date = new Date(data.dt * 1000);
  cityDate.textContent = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  weatherIcon.src = `Assets/icons/${data.weather[0].icon}.png`;
  weatherTemp.textContent = `${Math.round(data.main.temp)}°C`;
  weatherStatus.textContent = data.weather[0].main;
  humidity.textContent = `${data.main.humidity}%`;
  windSpeed.textContent = `${data.wind.speed} m/s`;

  displayForecast(forecastData);

  weatherInfo.style.display = "block";
  searchCity.style.display = "none";
  searchError.style.display = "none";
}

// Search button click
searchButton.addEventListener("click", async () => {
  const city = searchInput.value.trim();
  if (!city) {
    weatherInfo.style.display = "none";
    searchCity.style.display = "none";
    searchError.style.display = "block";
    return;
  }

  const data = await fetchWeather(city);
  const forecastData = await fetchForecast(city);
  displayWeather(data, forecastData);
});


// GET USER LOCATION FROM NAVIGATOR


// Get weather by coordinates
async function fetchWeatherByCoords(lat, lon) {
  try {
    const apiKey = "bd0d48a3dff6d38c3a7e1ed5ef43f427";
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error("Error fetching weather by coordinates");
    const data = await response.json();
    
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Get forecast by coordinates
async function fetchForecastByCoords(lat, lon) {
  try {
    const apiKey = "bd0d48a3dff6d38c3a7e1ed5ef43f427";
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error("Error fetching forecast by coordinates");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Ask for geolocation
function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const data = await fetchWeatherByCoords(lat, lon);
      const forecastData = await fetchForecastByCoords(lat, lon);
      displayWeather(data, forecastData);
    }, err => {
      console.warn("Geolocation denied or unavailable:", err);
    });
  } else {
    console.warn("Geolocation not supported by this browser.");
  }
}

// Call this on page load
getLocationWeather();

