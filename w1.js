document.addEventListener("DOMContentLoaded", function() {
    const cityInput = document.querySelector(".city-input");
    const searchButton = document.querySelector(".Srch");
    const locationButton = document.querySelector(".location-btn");
    const currentWeatherDiv = document.querySelector(".current-weather");
    const weatherCardsDiv = document.querySelector(".weather-cards"); // Added

    const API_KEY = "37d34e194cdde836ed39299862afd2d4"; // Your API key for OpenWeatherMap API

    const createWeatherCard = (cityName, weatherItem, index) => {
        if (index === 0) {
            return `<div class="details">
                        <h2>${cityName}</h2>
                        <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                        <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                        <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                    </div>
                    <div class="icon">
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}.png" alt="weather-icon">
                        <h6>${weatherItem.weather[0].description}</h6>
                    </div>`;
        } else {
            return `<li class="card">
                        <h3>${weatherItem.dt_txt}</h3>
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}.png" alt="weather-icon">
                        <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                        <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                        <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                    </li>`;
        }
    }

    const getWeatherDetails = (cityName) => {
        const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`;

        fetch(WEATHER_API_URL)
            .then(response => response.json())
            .then(data => {
                // Extract the current weather and 5-day forecast data
                const currentWeather = data.list[0];
                const fiveDaysForecast = data.list.filter((item, index) => index % 8 === 0); // Data for every 3 hours, so we take data for every 24 hours (8 * 3 = 24)

                // Display current weather
                currentWeatherDiv.innerHTML = createWeatherCard(cityName, currentWeather, 0);

                // Display 5-day forecast
                weatherCardsDiv.innerHTML = ""; // Clear previous forecast
                fiveDaysForecast.forEach((weatherItem, index) => {
                    if (index !== 0) { // Skip the current day
                        const html = createWeatherCard(cityName, weatherItem, index);
                        weatherCardsDiv.insertAdjacentHTML("beforeend", html);
                    }
                });
            })
            .catch(() => {
                alert("An error occurred while fetching the weather data!");
            });
    }

    const getCityWeather = () => {
        const cityName = cityInput.value.trim();
        if (cityName === "") return;
        getWeatherDetails(cityName);
    }

    const getUserWeather = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

                fetch(WEATHER_API_URL)
                    .then(response => response.json())
                    .then(data => {
                        const cityName = data.city.name;
                        getWeatherDetails(cityName);
                    })
                    .catch(() => {
                        alert("An error occurred while fetching the weather data!");
                    });
            },
            error => {
                if (error.code === error.PERMISSION_DENIED) {
                    alert("Geolocation request denied. Please reset location permission to grant access again.");
                } else {
                    alert("Geolocation request error. Please reset location permission.");
                }
            }
        );
    }

    if (searchButton) {
        searchButton.addEventListener("click", getCityWeather);
    } else {
        console.error("Element with class 'Srch' not found");
    }

    if (locationButton) {
        locationButton.addEventListener("click", getUserWeather);
    } else {
        console.error("Element with class 'location-btn' not found");
    }
});
