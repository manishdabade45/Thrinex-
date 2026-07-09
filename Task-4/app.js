/**
 * SkyFlow Real-Time Weather Dashboard
 * Asynchronous JavaScript & RESTful APIs
 */

// --- STATE MANAGEMENT ---
let appState = {
  currentCity: {
    name: 'London',
    country: 'United Kingdom',
    latitude: 51.5085,
    longitude: -0.1257,
    timezone: 'Europe/London'
  },
  weatherData: null,
  unit: 'celsius', // 'celsius' or 'fahrenheit'
  recentSearches: []
};

// --- DOM ELEMENTS ---
const elements = {
  citySearchInput: document.getElementById('city-search'),
  clearSearchBtn: document.getElementById('clear-search'),
  searchSuggestions: document.getElementById('search-suggestions'),
  unitToggle: document.getElementById('unit-toggle'),
  recentChipsList: document.getElementById('recent-chips-list'),
  globalLoading: document.getElementById('global-loading'),
  toastContainer: document.getElementById('toast-container'),
  
  // Hero Weather elements
  heroWeatherCard: document.getElementById('hero-weather'),
  currentCityName: document.getElementById('current-city'),
  currentDate: document.getElementById('current-date'),
  currentTemp: document.getElementById('current-temp'),
  tempUnitDisplay: document.getElementById('temp-unit-display'),
  weatherDescription: document.getElementById('weather-description'),
  currentTempMin: document.getElementById('current-temp-min'),
  currentTempMax: document.getElementById('current-temp-max'),
  heroWeatherIcon: document.getElementById('hero-weather-icon'),
  
  // Detailed metrics
  valHumidity: document.getElementById('val-humidity'),
  humidityProgress: document.getElementById('humidity-progress'),
  valHumidityDesc: document.getElementById('val-humidity-desc'),
  
  valWind: document.getElementById('val-wind'),
  windCompass: document.getElementById('wind-compass'),
  valWindDir: document.getElementById('val-wind-dir'),
  
  valUv: document.getElementById('val-uv'),
  uvProgress: document.getElementById('uv-progress'),
  valUvDesc: document.getElementById('val-uv-desc'),
  
  valSunrise: document.getElementById('val-sunrise'),
  valSunset: document.getElementById('val-sunset'),
  
  valPressure: document.getElementById('val-pressure'),
  valPressureDesc: document.getElementById('val-pressure-desc'),
  
  valPrecip: document.getElementById('val-precip'),
  valPrecipDesc: document.getElementById('val-precip-desc'),
  
  // Forecast lists
  hourlyList: document.getElementById('hourly-list'),
  dailyList: document.getElementById('daily-list')
};

// --- WMO WEATHER CODE MAPPINGS ---
// Maps WMO codes to descriptions, themes, and animated SVG icons
const weatherCodeMap = {
  0: { desc: 'Clear Sky', theme: 'sunny', iconFunc: getSunnyIcon, nightIconFunc: getNightIcon },
  1: { desc: 'Mainly Clear', theme: 'sunny', iconFunc: getPartlyCloudyIcon, nightIconFunc: getNightCloudyIcon },
  2: { desc: 'Partly Cloudy', theme: 'cloudy', iconFunc: getPartlyCloudyIcon, nightIconFunc: getNightCloudyIcon },
  3: { desc: 'Overcast', theme: 'cloudy', iconFunc: getOvercastIcon, nightIconFunc: getOvercastIcon },
  45: { desc: 'Foggy', theme: 'cloudy', iconFunc: getFogIcon, nightIconFunc: getFogIcon },
  48: { desc: 'Depositing Rime Fog', theme: 'cloudy', iconFunc: getFogIcon, nightIconFunc: getFogIcon },
  51: { desc: 'Light Drizzle', theme: 'rainy', iconFunc: getRainyIcon, nightIconFunc: getRainyIcon },
  53: { desc: 'Moderate Drizzle', theme: 'rainy', iconFunc: getRainyIcon, nightIconFunc: getRainyIcon },
  55: { desc: 'Dense Drizzle', theme: 'rainy', iconFunc: getRainyIcon, nightIconFunc: getRainyIcon },
  56: { desc: 'Light Freezing Drizzle', theme: 'snowy', iconFunc: getSnowyIcon, nightIconFunc: getSnowyIcon },
  57: { desc: 'Dense Freezing Drizzle', theme: 'snowy', iconFunc: getSnowyIcon, nightIconFunc: getSnowyIcon },
  61: { desc: 'Slight Rain', theme: 'rainy', iconFunc: getRainyIcon, nightIconFunc: getRainyIcon },
  63: { desc: 'Moderate Rain', theme: 'rainy', iconFunc: getRainyIcon, nightIconFunc: getRainyIcon },
  65: { desc: 'Heavy Rain', theme: 'rainy', iconFunc: getRainyIcon, nightIconFunc: getRainyIcon },
  66: { desc: 'Light Freezing Rain', theme: 'snowy', iconFunc: getSnowyIcon, nightIconFunc: getSnowyIcon },
  67: { desc: 'Heavy Freezing Rain', theme: 'snowy', iconFunc: getSnowyIcon, nightIconFunc: getSnowyIcon },
  71: { desc: 'Slight Snow Fall', theme: 'snowy', iconFunc: getSnowyIcon, nightIconFunc: getSnowyIcon },
  73: { desc: 'Moderate Snow Fall', theme: 'snowy', iconFunc: getSnowyIcon, nightIconFunc: getSnowyIcon },
  75: { desc: 'Heavy Snow Fall', theme: 'snowy', iconFunc: getSnowyIcon, nightIconFunc: getSnowyIcon },
  77: { desc: 'Snow Grains', theme: 'snowy', iconFunc: getSnowyIcon, nightIconFunc: getSnowyIcon },
  80: { desc: 'Slight Rain Showers', theme: 'rainy', iconFunc: getRainyIcon, nightIconFunc: getRainyIcon },
  81: { desc: 'Moderate Rain Showers', theme: 'rainy', iconFunc: getRainyIcon, nightIconFunc: getRainyIcon },
  82: { desc: 'Violent Rain Showers', theme: 'rainy', iconFunc: getRainyIcon, nightIconFunc: getRainyIcon },
  85: { desc: 'Slight Snow Showers', theme: 'snowy', iconFunc: getSnowyIcon, nightIconFunc: getSnowyIcon },
  86: { desc: 'Heavy Snow Showers', theme: 'snowy', iconFunc: getSnowyIcon, nightIconFunc: getSnowyIcon },
  95: { desc: 'Thunderstorm', theme: 'stormy', iconFunc: getStormyIcon, nightIconFunc: getStormyIcon },
  96: { desc: 'Thunderstorm with Hail', theme: 'stormy', iconFunc: getStormyIcon, nightIconFunc: getStormyIcon },
  99: { desc: 'Severe Thunderstorm', theme: 'stormy', iconFunc: getStormyIcon, nightIconFunc: getStormyIcon }
};

function getWeatherMeta(code, isDay) {
  const meta = weatherCodeMap[code] || { desc: 'Unknown Weather', theme: 'default', iconFunc: getSunnyIcon, nightIconFunc: getSunnyIcon };
  if (!isDay && meta.theme === 'sunny') {
    return {
      desc: meta.desc,
      theme: 'night',
      icon: meta.nightIconFunc()
    };
  }
  return {
    desc: meta.desc,
    theme: meta.theme,
    icon: isDay ? meta.iconFunc() : (meta.nightIconFunc ? meta.nightIconFunc() : meta.iconFunc())
  };
}

// --- DYNAMIC CUSTOM ANIMATED SVG ICONS ---

function getSunnyIcon() {
  return `
    <svg class="weather-svg-animate" viewBox="0 0 100 100" width="100%" height="100%">
      <circle cx="50" cy="50" r="18" fill="var(--accent-primary)" />
      <g class="sun-rays" stroke="var(--accent-primary)" stroke-width="4" stroke-linecap="round">
        <line x1="50" y1="12" x2="50" y2="22" />
        <line x1="50" y1="78" x2="50" y2="88" />
        <line x1="12" y1="50" x2="22" y2="50" />
        <line x1="78" y1="50" x2="88" y2="50" />
        <line x1="23.2" y1="23.2" x2="30.2" y2="30.2" />
        <line x1="69.8" y1="69.8" x2="76.8" y2="76.8" />
        <line x1="23.2" y1="76.8" x2="30.2" y2="69.8" />
        <line x1="69.8" y1="23.2" x2="76.8" y2="30.2" />
      </g>
    </svg>
  `;
}

function getNightIcon() {
  return `
    <svg class="weather-svg-animate" viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M42,20 A24,24 0 0,0 66,44 A19,19 0 1,1 42,20 Z" fill="var(--accent-primary)" />
      <path class="sun-rays" d="M25,32 L26.5,33.5 L25,35 L23.5,33.5 Z" fill="var(--accent-secondary)" />
      <path class="sun-rays" style="animation-delay: 0.8s;" d="M60,68 L61.5,69.5 L60,71 L58.5,69.5 Z" fill="var(--accent-secondary)" />
      <path class="sun-rays" style="animation-delay: 1.5s;" d="M72,25 L73,26 L72,27 L71,26 Z" fill="var(--accent-secondary)" />
    </svg>
  `;
}

function getPartlyCloudyIcon() {
  return `
    <svg class="weather-svg-animate" viewBox="0 0 100 100" width="100%" height="100%">
      <g class="sun-rays" stroke="var(--accent-primary)" stroke-width="3" stroke-linecap="round" opacity="0.8">
        <circle cx="38" cy="38" r="12" fill="var(--accent-primary)" />
        <line x1="38" y1="12" x2="38" y2="18" />
        <line x1="38" y1="58" x2="38" y2="64" />
        <line x1="12" y1="38" x2="18" y2="38" />
        <line x1="58" y1="38" x2="64" y2="38" />
      </g>
      <path class="cloud-drift" d="M38,62 A12,12 0 0,1 50,50 A16,16 0 0,1 78,54 A12,12 0 0,1 74,74 L42,74 A12,12 0 0,1 38,62 Z" fill="var(--accent-secondary)" opacity="0.6"/>
      <path class="cloud-drift-reverse" d="M26,66 A10,10 0 0,1 36,56 A13,13 0 0,1 60,60 A10,10 0 0,1 56,76 L30,76 A10,10 0 0,1 26,66 Z" fill="var(--text-primary)"/>
    </svg>
  `;
}

function getNightCloudyIcon() {
  return `
    <svg class="weather-svg-animate" viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M35,25 A18,18 0 0,0 53,43 A15,15 0 1,1 35,25 Z" fill="var(--accent-primary)" opacity="0.8"/>
      <path class="cloud-drift" d="M38,62 A12,12 0 0,1 50,50 A16,16 0 0,1 78,54 A12,12 0 0,1 74,74 L42,74 A12,12 0 0,1 38,62 Z" fill="var(--accent-secondary)" opacity="0.6"/>
      <path class="cloud-drift-reverse" d="M26,66 A10,10 0 0,1 36,56 A13,13 0 0,1 60,60 A10,10 0 0,1 56,76 L30,76 A10,10 0 0,1 26,66 Z" fill="var(--text-primary)"/>
    </svg>
  `;
}

function getOvercastIcon() {
  return `
    <svg class="weather-svg-animate" viewBox="0 0 100 100" width="100%" height="100%">
      <path class="cloud-drift" d="M34,50 A14,14 0 0,1 48,36 A18,18 0 0,1 80,40 A14,14 0 0,1 76,64 L38,64 A14,14 0 0,1 34,50 Z" fill="var(--text-secondary)" opacity="0.75"/>
      <path class="cloud-drift-reverse" d="M20,60 A12,12 0 0,1 32,48 A16,16 0 0,1 60,52 A12,12 0 0,1 56,72 L24,72 A12,12 0 0,1 20,60 Z" fill="var(--text-primary)"/>
    </svg>
  `;
}

function getFogIcon() {
  return `
    <svg class="weather-svg-animate" viewBox="0 0 100 100" width="100%" height="100%">
      <path class="cloud-drift" d="M24,46 A12,12 0 0,1 36,34 A16,16 0 0,1 64,38 A12,12 0 0,1 60,58 L28,58 A12,12 0 0,1 24,46 Z" fill="var(--text-secondary)" opacity="0.6"/>
      <line class="cloud-drift" x1="20" y1="66" x2="80" y2="66" stroke="var(--text-primary)" stroke-width="4" stroke-linecap="round"/>
      <line class="cloud-drift-reverse" x1="28" y1="74" x2="72" y2="74" stroke="var(--accent-primary)" stroke-width="3" stroke-linecap="round"/>
      <line class="cloud-drift" x1="35" y1="82" x2="65" y2="82" stroke="var(--text-secondary)" stroke-width="3.5" stroke-linecap="round"/>
    </svg>
  `;
}

function getRainyIcon() {
  return `
    <svg class="weather-svg-animate" viewBox="0 0 100 100" width="100%" height="100%">
      <path class="cloud-drift" d="M30,52 A14,14 0 0,1 44,38 A18,18 0 0,1 76,42 A14,14 0 0,1 72,66 L34,66 A14,14 0 0,1 30,52 Z" fill="var(--accent-secondary)" opacity="0.6"/>
      <path class="cloud-drift-reverse" d="M20,58 A11,11 0 0,1 31,47 A14,14 0 0,1 56,51 A11,11 0 0,1 52,70 L24,70 A11,11 0 0,1 20,58 Z" fill="var(--text-primary)"/>
      <line class="rain-drop rain-drop-1" x1="28" y1="74" x2="24" y2="84" stroke="var(--accent-primary)" stroke-width="3.5" stroke-linecap="round"/>
      <line class="rain-drop rain-drop-2" x1="40" y1="76" x2="36" y2="86" stroke="var(--accent-primary)" stroke-width="3.5" stroke-linecap="round"/>
      <line class="rain-drop rain-drop-3" x1="52" y1="74" x2="48" y2="84" stroke="var(--accent-primary)" stroke-width="3.5" stroke-linecap="round"/>
    </svg>
  `;
}

function getSnowyIcon() {
  return `
    <svg class="weather-svg-animate" viewBox="0 0 100 100" width="100%" height="100%">
      <path class="cloud-drift" d="M30,52 A14,14 0 0,1 44,38 A18,18 0 0,1 76,42 A14,14 0 0,1 72,66 L34,66 A14,14 0 0,1 30,52 Z" fill="var(--accent-secondary)" opacity="0.6"/>
      <path class="cloud-drift-reverse" d="M20,58 A11,11 0 0,1 31,47 A14,14 0 0,1 56,51 A11,11 0 0,1 52,70 L24,70 A11,11 0 0,1 20,58 Z" fill="#ffffff"/>
      <circle class="snow-flake snow-flake-1" cx="28" cy="76" r="2.5" fill="var(--accent-primary)"/>
      <circle class="snow-flake snow-flake-2" cx="40" cy="78" r="2.5" fill="var(--accent-primary)"/>
      <circle class="snow-flake snow-flake-3" cx="52" cy="76" r="2.5" fill="var(--accent-primary)"/>
    </svg>
  `;
}

function getStormyIcon() {
  return `
    <svg class="weather-svg-animate" viewBox="0 0 100 100" width="100%" height="100%">
      <path class="cloud-drift" d="M30,52 A14,14 0 0,1 44,38 A18,18 0 0,1 76,42 A14,14 0 0,1 72,66 L34,66 A14,14 0 0,1 30,52 Z" fill="#1e293b"/>
      <path class="cloud-drift-reverse" d="M20,58 A11,11 0 0,1 31,47 A14,14 0 0,1 56,51 A11,11 0 0,1 52,70 L24,70 A11,11 0 0,1 20,58 Z" fill="#475569"/>
      <polygon points="40,68 33,78 41,78 37,88 49,76 41,76" fill="var(--accent-primary)" />
      <line class="rain-drop rain-drop-1" x1="26" y1="72" x2="22" y2="82" stroke="var(--accent-secondary)" stroke-width="2.5" stroke-linecap="round"/>
      <line class="rain-drop rain-drop-2" x1="56" y1="72" x2="52" y2="82" stroke="var(--accent-secondary)" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `;
}

// --- HELPER CONVERSIONS & FORMATTING ---

// Celsius to Fahrenheit
function cToF(c) {
  return Math.round((c * 9/5) + 32);
}

// Format temperature value based on current unit
function formatTemp(celsiusVal) {
  if (celsiusVal === null || celsiusVal === undefined || isNaN(celsiusVal)) return '--';
  const val = appState.unit === 'celsius' ? celsiusVal : cToF(celsiusVal);
  return `${Math.round(val)}°`;
}

// Format wind direction degree into human readable Cardinal directions
function getWindDirection(degree) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degree % 360) / 22.5)) % 16;
  return directions[index];
}

// Format Date objects nicely
function formatDate(dateString) {
  const options = { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatDayName(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

// --- TOAST NOTIFICATIONS (ERROR BANNER) ---

function showToast(message, duration = 4000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon"><i class="fa-solid fa-triangle-exclamation"></i></span>
      <span class="toast-text">${message}</span>
    </div>
    <button class="toast-close-btn"><i class="fa-solid fa-xmark"></i></button>
  `;
  
  elements.toastContainer.appendChild(toast);
  
  const closeBtn = toast.querySelector('.toast-close-btn');
  const dismissToast = () => {
    toast.classList.add('toast-closing');
    setTimeout(() => {
      toast.remove();
    }, 400);
  };
  
  closeBtn.addEventListener('click', dismissToast);
  
  const autoDismiss = setTimeout(dismissToast, duration);
  
  toast.addEventListener('mouseenter', () => clearTimeout(autoDismiss));
  toast.addEventListener('mouseleave', () => {
    setTimeout(dismissToast, duration / 2);
  });
}

// --- LOCAL STORAGE RECENT SEARCHES ---

function loadRecentSearches() {
  const stored = localStorage.getItem('skyflow_recents');
  if (stored) {
    try {
      appState.recentSearches = JSON.parse(stored);
      renderRecentChips();
    } catch (e) {
      localStorage.removeItem('skyflow_recents');
    }
  }
}

function saveRecentSearch(cityData) {
  // Remove duplicate if exists
  appState.recentSearches = appState.recentSearches.filter(
    item => !(item.latitude === cityData.latitude && item.longitude === cityData.longitude)
  );
  
  // Add to beginning
  appState.recentSearches.unshift(cityData);
  
  // Limit to max 5 items
  if (appState.recentSearches.length > 5) {
    appState.recentSearches.pop();
  }
  
  localStorage.setItem('skyflow_recents', JSON.stringify(appState.recentSearches));
  renderRecentChips();
}

function deleteRecentSearch(e, index) {
  e.stopPropagation(); // Avoid triggering loading weather for this chip
  appState.recentSearches.splice(index, 1);
  localStorage.setItem('skyflow_recents', JSON.stringify(appState.recentSearches));
  renderRecentChips();
}

function renderRecentChips() {
  elements.recentChipsList.innerHTML = '';
  
  if (appState.recentSearches.length === 0) {
    elements.recentChipsList.innerHTML = `<span class="empty-recent-text">No recent searches yet. Search a city to begin!</span>`;
    return;
  }
  
  appState.recentSearches.forEach((city, index) => {
    const chip = document.createElement('span');
    chip.className = 'recent-chip';
    chip.innerHTML = `
      ${city.name}, ${city.country} 
      <i class="fa-solid fa-circle-xmark" title="Remove from history"></i>
    `;
    
    chip.addEventListener('click', () => {
      appState.currentCity = city;
      fetchWeatherAndRender();
    });
    
    const removeBtn = chip.querySelector('i');
    removeBtn.addEventListener('click', (e) => deleteRecentSearch(e, index));
    
    elements.recentChipsList.appendChild(chip);
  });
}

// --- ASYNCHRONOUS API NETWORK REQUESTS ---

// Debounce helper
let debounceTimeout;
function debounce(func, delay = 350) {
  return (...args) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => func(...args), delay);
  };
}

// 1. Search Geocoding Suggestions
async function fetchGeocodingSuggestions(query) {
  if (!navigator.onLine) {
    showToast("Network is offline. Please check your internet connection.");
    return;
  }
  
  if (!query || query.trim().length < 2) {
    elements.searchSuggestions.innerHTML = '';
    elements.searchSuggestions.classList.add('hidden');
    return;
  }
  
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding server error: ${response.status}`);
    }
    
    const data = await response.json();
    renderGeocodingSuggestions(data.results || []);
  } catch (error) {
    console.error("Geocoding fetch error:", error);
    // Silent fail for geocoding suggestions to avoid spamming alerts on typing
  }
}

// 2. Fetch Detailed Meteorological Weather Data
async function fetchWeatherData(lat, lon, timezone) {
  if (!navigator.onLine) {
    throw new Error("No internet connection.");
  }
  
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=${encodeURIComponent(timezone)}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Weather details could not be retrieved (Status ${response.status})`);
  }
  
  return await response.json();
}

// Orchestrator: Fetch Weather data and trigger DOM update
async function fetchWeatherAndRender() {
  setLoadingState(true);
  try {
    const data = await fetchWeatherData(
      appState.currentCity.latitude,
      appState.currentCity.longitude,
      appState.currentCity.timezone
    );
    
    appState.weatherData = data;
    renderWeatherData();
    saveRecentSearch(appState.currentCity);
  } catch (err) {
    console.error(err);
    showToast(err.message || "Failed to load weather data. Please try again.");
  } finally {
    setLoadingState(false);
  }
}

// --- DOM RENDERING & DYNAMIC BINDINGS ---

function setLoadingState(isLoading) {
  if (isLoading) {
    elements.globalLoading.classList.remove('hidden');
    elements.heroWeatherCard.querySelector('.card-loader').classList.add('active');
  } else {
    elements.globalLoading.classList.add('hidden');
    elements.heroWeatherCard.querySelector('.card-loader').classList.remove('active');
  }
}

function renderGeocodingSuggestions(results) {
  elements.searchSuggestions.innerHTML = '';
  
  if (results.length === 0) {
    const li = document.createElement('li');
    li.innerHTML = `<span class="suggestion-city">No results found</span>`;
    elements.searchSuggestions.appendChild(li);
    elements.searchSuggestions.classList.remove('hidden');
    return;
  }
  
  results.forEach(result => {
    const li = document.createElement('li');
    const stateStr = result.admin1 ? `, ${result.admin1}` : '';
    const desc = `${result.country}${stateStr}`;
    
    li.innerHTML = `
      <span class="suggestion-city">${result.name}</span>
      <span class="suggestion-country">${desc}</span>
    `;
    
    li.addEventListener('click', () => {
      appState.currentCity = {
        name: result.name,
        country: result.country,
        latitude: result.latitude,
        longitude: result.longitude,
        timezone: result.timezone || 'auto'
      };
      elements.citySearchInput.value = result.name;
      elements.searchSuggestions.innerHTML = '';
      elements.searchSuggestions.classList.add('hidden');
      elements.clearSearchBtn.classList.remove('hidden');
      fetchWeatherAndRender();
    });
    
    elements.searchSuggestions.appendChild(li);
  });
  
  elements.searchSuggestions.classList.remove('hidden');
}

// Main Weather Render Engine
function renderWeatherData() {
  const current = appState.weatherData.current;
  const daily = appState.weatherData.daily;
  const hourly = appState.weatherData.hourly;
  
  // WMO Code metadata translation
  const weatherMeta = getWeatherMeta(current.weather_code, current.is_day);
  
  // 1. Dynamic theme adjustment
  document.body.className = ''; // reset themes
  document.body.classList.add(`theme-${weatherMeta.theme}`);
  
  // 2. Current Hero Weather Card
  elements.currentCityName.textContent = `${appState.currentCity.name}, ${appState.currentCity.country}`;
  elements.currentDate.textContent = formatDate(current.time);
  elements.currentTemp.textContent = formatTemp(current.temperature_2m);
  elements.tempUnitDisplay.textContent = appState.unit === 'celsius' ? 'C' : 'F';
  elements.weatherDescription.textContent = weatherMeta.desc;
  
  // Min Max temperatures (index 0 corresponds to today in daily arrays)
  elements.currentTempMin.textContent = formatTemp(daily.temperature_2m_min[0]);
  elements.currentTempMax.textContent = formatTemp(daily.temperature_2m_max[0]);
  
  // Hero Weather Icon injection
  elements.heroWeatherIcon.innerHTML = weatherMeta.icon;
  
  // 3. Highlight Metrics grid values
  // A. Humidity
  elements.valHumidity.textContent = `${current.relative_humidity_2m}%`;
  elements.humidityProgress.style.width = `${current.relative_humidity_2m}%`;
  // Comfort levels description based on humidity
  let humDesc = 'Comfortable';
  if (current.relative_humidity_2m < 30) humDesc = 'Dry Air';
  else if (current.relative_humidity_2m > 70) humDesc = 'Sticky / Muggy';
  elements.valHumidityDesc.textContent = humDesc;
  
  // B. Wind Status
  elements.valWind.textContent = `${current.wind_speed_10m} km/h`;
  elements.windCompass.style.transform = `rotate(${current.wind_direction_10m}deg)`;
  elements.valWindDir.textContent = `${getWindDirection(current.wind_direction_10m)} (${current.wind_direction_10m}°)`;
  
  // C. UV Index
  const todayUv = daily.uv_index_max[0];
  elements.valUv.textContent = todayUv !== null ? todayUv.toFixed(1) : '--';
  // Progress is UV score multiplied by 10 (range is 0 to 11+)
  const uvPercent = Math.min((todayUv / 11) * 100, 100);
  elements.uvProgress.style.width = `${uvPercent}%`;
  // UV danger mapping
  let uvDesc = 'Low';
  if (todayUv >= 3 && todayUv < 6) uvDesc = 'Moderate (SPF recommended)';
  else if (todayUv >= 6 && todayUv < 8) uvDesc = 'High (Protection required)';
  else if (todayUv >= 8 && todayUv < 11) uvDesc = 'Very High (Avoid sun)';
  else if (todayUv >= 11) uvDesc = 'Extreme Danger!';
  elements.valUvDesc.textContent = uvDesc;
  
  // D. Sunrise & Sunset
  // Convert ISO string times to short local times "HH:MM"
  const extractTime = (isoStr) => {
    if (!isoStr) return '--:--';
    const date = new Date(isoStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };
  elements.valSunrise.textContent = extractTime(daily.sunrise[0]);
  elements.valSunset.textContent = extractTime(daily.sunset[0]);
  
  // E. Air Pressure
  elements.valPressure.textContent = `${current.pressure_msl.toFixed(0)} hPa`;
  let pressDesc = 'Normal Pressure';
  if (current.pressure_msl < 1009) pressDesc = 'Low Pressure (Unstable)';
  else if (current.pressure_msl > 1020) pressDesc = 'High Pressure (Stable)';
  elements.valPressureDesc.textContent = pressDesc;
  
  // F. Precipitation / Rain
  elements.valPrecip.textContent = `${current.precipitation.toFixed(1)} mm`;
  let precipDesc = 'No precipitation today';
  if (current.precipitation > 0 && current.precipitation < 2) precipDesc = 'Light shower / damp';
  else if (current.precipitation >= 2 && current.precipitation < 10) precipDesc = 'Moderate rainfall';
  else if (current.precipitation >= 10) precipDesc = 'Heavy storm!';
  elements.valPrecipDesc.textContent = precipDesc;
  
  // 4. Hourly Timeline Forecast Rendering (Next 24 Hours)
  elements.hourlyList.innerHTML = '';
  // Locate index of current hour in hourly forecast array
  const currentHourISO = current.time.substring(0, 13) + ':00';
  let startHourIdx = hourly.time.findIndex(time => time.startsWith(currentHourISO));
  if (startHourIdx === -1) startHourIdx = 0;
  
  // Take next 24 data points
  for (let i = startHourIdx; i < startHourIdx + 24 && i < hourly.time.length; i++) {
    const itemTime = new Date(hourly.time[i]);
    const hr = itemTime.getHours();
    const formattedHr = hr === 0 ? '12 AM' : hr === 12 ? '12 PM' : hr > 12 ? `${hr - 12} PM` : `${hr} AM`;
    const tempVal = hourly.temperature_2m[i];
    const itemCode = hourly.weather_code[i];
    const pop = hourly.precipitation_probability[i];
    
    // We assume hourly day status depends on sunrise/sunset of that day
    // For simplicity, we can inspect hourly values if code map distinguishes day/night,
    // or estimate based on sunrise/sunset hours.
    // Sunrise/Sunset for this day:
    const sunR = new Date(daily.sunrise[0]).getHours();
    const sunS = new Date(daily.sunset[0]).getHours();
    const hourIsDay = hr >= sunR && hr <= sunS;
    
    const hourlyMeta = getWeatherMeta(itemCode, hourIsDay);
    
    const div = document.createElement('div');
    div.className = 'hourly-item';
    div.innerHTML = `
      <span class="hourly-time">${formattedHr}</span>
      <div class="hourly-icon-container" title="${hourlyMeta.desc}">
        ${hourlyMeta.icon}
      </div>
      <span class="hourly-temp">${formatTemp(tempVal)}</span>
      <span class="hourly-pop"><i class="fa-solid fa-droplet"></i> ${pop}%</span>
    `;
    elements.hourlyList.appendChild(div);
  }
  
  // 5. 7-Day Forecast Rendering
  elements.dailyList.innerHTML = '';
  for (let d = 0; d < 7; d++) {
    const dayName = formatDayName(daily.time[d]);
    const minTemp = daily.temperature_2m_min[d];
    const maxTemp = daily.temperature_2m_max[d];
    const dCode = daily.weather_code[d];
    const dMeta = getWeatherMeta(dCode, true); // default day icons for 7-day
    
    // Rain probabilities are not directly on daily parameters on simple forecast,
    // so we can approximate or display the WMO icon, or compute daily max rain chance
    // from hourly chunk representing that day (24-hour index slice)
    const dayStart = d * 24;
    const dayEnd = dayStart + 24;
    const dailyHourlyPop = hourly.precipitation_probability.slice(dayStart, dayEnd);
    const maxDailyPop = dailyHourlyPop.length ? Math.max(...dailyHourlyPop) : 0;
    
    const item = document.createElement('div');
    item.className = 'daily-item';
    item.innerHTML = `
      <span class="daily-day">${dayName}</span>
      <div class="daily-condition-block">
        <div class="daily-icon-container" title="${dMeta.desc}">
          ${dMeta.icon}
        </div>
        <span class="daily-desc">${dMeta.desc}</span>
      </div>
      <div class="daily-pop-block" title="Probability of Precipitation">
        <i class="fa-solid fa-droplet"></i>
        <span>${maxDailyPop}%</span>
      </div>
      <div class="daily-temp-range">
        <span class="daily-temp-min">${formatTemp(minTemp)}</span>
        <span class="daily-temp-max">${formatTemp(maxTemp)}</span>
      </div>
    `;
    elements.dailyList.appendChild(item);
  }
}

// --- EVENT LISTENERS & INITIALIZATION ---

function setupEventListeners() {
  // Unit toggle °C / °F
  elements.unitToggle.addEventListener('change', (e) => {
    appState.unit = e.target.checked ? 'fahrenheit' : 'celsius';
    if (appState.weatherData) {
      renderWeatherData();
    }
  });
  
  // Search inputs & Autocomplete bindings
  elements.citySearchInput.addEventListener('input', debounce(async (e) => {
    const val = e.target.value.trim();
    if (val.length > 0) {
      elements.clearSearchBtn.classList.remove('hidden');
    } else {
      elements.clearSearchBtn.classList.add('hidden');
    }
    
    if (val.length >= 2) {
      await fetchGeocodingSuggestions(val);
    } else {
      elements.searchSuggestions.innerHTML = '';
      elements.searchSuggestions.classList.add('hidden');
    }
  }, 350));
  
  // Clear search input button
  elements.clearSearchBtn.addEventListener('click', () => {
    elements.citySearchInput.value = '';
    elements.clearSearchBtn.classList.add('hidden');
    elements.searchSuggestions.innerHTML = '';
    elements.searchSuggestions.classList.add('hidden');
    elements.citySearchInput.focus();
  });
  
  // Handle clicking outside suggestions to hide the menu
  document.addEventListener('click', (e) => {
    if (!elements.searchSuggestions.contains(e.target) && e.target !== elements.citySearchInput) {
      elements.searchSuggestions.classList.add('hidden');
    }
  });
  
  // Allow hitting enter key inside search to load first suggestions
  elements.citySearchInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const val = elements.citySearchInput.value.trim();
      if (val.length >= 2) {
        // Trigger Geocoding request if not loaded suggestions yet, otherwise load first
        try {
          const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(val)}&count=1&language=en&format=json`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const result = data.results[0];
              appState.currentCity = {
                name: result.name,
                country: result.country,
                latitude: result.latitude,
                longitude: result.longitude,
                timezone: result.timezone || 'auto'
              };
              elements.citySearchInput.value = result.name;
              elements.searchSuggestions.classList.add('hidden');
              elements.clearSearchBtn.classList.remove('hidden');
              fetchWeatherAndRender();
            } else {
              showToast(`City "${val}" not found. Try searching another name.`);
            }
          }
        } catch (err) {
          showToast("Failed to search city. Please try again.");
        }
      }
    }
  });
  
  // Handle online/offline triggers
  window.addEventListener('online', () => {
    showToast("Internet connection restored. Retrying load...");
    fetchWeatherAndRender();
  });
  window.addEventListener('offline', () => {
    showToast("Internet connection lost. Running in offline/cached mode.");
  });
}

// Main initial load sequence
function initializeApp() {
  setupEventListeners();
  loadRecentSearches();
  
  // Detect if there is a successful past search to default to, otherwise default to London
  if (appState.recentSearches.length > 0) {
    appState.currentCity = appState.recentSearches[0];
  }
  
  fetchWeatherAndRender();
}

// Launch application
document.addEventListener('DOMContentLoaded', initializeApp);
