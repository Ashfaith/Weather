let weatherObj;
let positionName;
const main = document.querySelector('.main');
const weatherDisplay = document.querySelector('.weather-display');
const locationContainer = document.querySelector(".location-container");
const locationHeader = document.querySelector(".location-header");
const locationName = document.querySelector(".location-name");
const todayDate = document.querySelector(".today-date");
const todayTemps = document.querySelector(".today-temps");
const currentTempDisplay = document.querySelector(".current-temp-display");
const tempNow = document.querySelector(".temp-now");
const feelsLike = document.querySelector(".feels-like");
const weatherSymbol = document.querySelector(".weather-symbol");
const highLow = document.querySelector(".high-low");
const high = document.querySelector("#high");
const highText = document.querySelector(".high-text"); 
const low = document.querySelector("#low");
const lowText = document.querySelector(".low-text");
const description = document.querySelector(".description");
const locationSearch = document.querySelector(".location-search");
const searchInput = document.querySelector('.search-text-input');
const searchSubmit = document.querySelector('.search-submit');
const searchButton = document.querySelector('.search-button');
const date = new Date()
const day = date.getDate().toString();
const month = date.toLocaleString('default', { month: 'long'});
const weatherImg = document.createElement("img");
let tempUnit;
const sliderInput = document.querySelector(".slider-input");
const nextDaysCont = document.querySelector(".next-days-container");
const weatherIcons = {
    "clear-day": "WeatherIcons/SVG/3rd Set - Color/clear-day.svg",
    "clear-night": "WeatherIcons/SVG/3rd Set - Color/clear-night.svg",
    "cloudy": "WeatherIcons/SVG/3rd Set - Color/cloudy.svg",
    "fog": "WeatherIcons/SVG/3rd Set - Color/fog.svg",
    "hail": "WeatherIcons/SVG/3rd Set - Color/hail.svg",
    "partly-cloudy-day": "WeatherIcons/SVG/3rd Set - Color/partly-cloudy-day.svg",
    "partly-cloudy-night": "WeatherIcons/SVG/3rd Set - Color/partly-cloudy-night.svg",
    "rain": "WeatherIcons/SVG/3rd Set - Color/rain.svg",
    "sleet": "WeatherIcons/SVG/3rd Set - Color/sleet.svg",
    "snow": "WeatherIcons/SVG/3rd Set - Color/snow.svg",
    "thunderstorm": "WeatherIcons/SVG/3rd Set - Color/thunderstorm.svg",
    "wind": "WeatherIcons/SVG/3rd Set - Color/wind.svg"
};

document.addEventListener("DOMContentLoaded", (event) => {
    navigator.geolocation.getCurrentPosition((position => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        convertPosition(lat, long)
    }))
  });


async function convertPosition(lat, long) {
    try {
        latLongCall = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=0034a37ec8f44864a9c4da218f500454`, {mode: 'cors'});
        latLongJson = await latLongCall.json()
        const suburb = latLongJson.features[0].properties.suburb;
        const country = latLongJson.features[0].properties.country;
        const convertedPosition = `${suburb} ${country}`;
        console.log(latLongJson.features[0].properties);
        positionName = convertedPosition;
        getWeather(positionName);
    }
    catch {
        console.log('...')
    }
}

window.addEventListener("load", () => {
    sliderInput.checked = true; 
    tempUnit = true; 
    updateDisplay();
});


const tempConvert = (f) => {
    return tempUnit ? convertMath(f) : f;
}

function convertMath(f) {
    let c = ((f - 32) * 5/9);
    return c;
}

const nextFewDays = (upcomingDays) => {
    while (nextDaysCont.firstChild) { 
        nextDaysCont.removeChild(nextDaysCont.firstChild);
    }
    
    const fiveDays = upcomingDays.slice(1, 6);
    
    fiveDays.forEach((day) => {
        console.log(day.datetime);

        const upcomingDate = new Date(day.datetime);
        const dayName = upcomingDate.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = tempConvert(day.temp).toFixed(1);
        const min = tempConvert(day.tempmin).toFixed(1);
        const max = tempConvert(day.tempmax).toFixed(1);

        const dayCont = document.createElement('div');
        dayCont.setAttribute('class', 'day-container');

        const leftElement = document.createElement('div');
        leftElement.setAttribute('class', 'left-of-day');

        const dayNameElement = document.createElement('div');
        dayNameElement.setAttribute('class', 'day-name');
        dayNameElement.innerText = dayName;

        const tempElement = document.createElement('div');
        tempElement.setAttribute('class', 'temperature');
        tempElement.innerText = `${temp}\u00B0`;

        const minMaxParent = document.createElement('div');
        minMaxParent.setAttribute('class', 'min-max-container');

        const minContainer = document.createElement('div');
        minContainer.setAttribute('class', 'min-container');
        minContainer.innerText = `Min: ${min}\u00B0`;

        const maxContainer = document.createElement('div');
        maxContainer.setAttribute('class', 'max-container');
        maxContainer.innerText = `Max: ${max}\u00B0`;

        // Append min and max containers to their parent container
        minMaxParent.appendChild(minContainer);
        minMaxParent.appendChild(maxContainer);

        // Append day name, temp, and min-max parent containers to the day container
        leftElement.appendChild(dayNameElement);
        leftElement.appendChild(tempElement);

        dayCont.appendChild(leftElement);
        dayCont.appendChild(minMaxParent);

        nextDaysCont.appendChild(dayCont);
    });
};




async function getWeather(position) {
    try {
        const weatherCall = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${position}?unitGroup=us&key=33KQCSB2EU8HM268EPTNJNT9L&contentType=json`, {mode: 'cors'});
        weatherObj = await weatherCall.json();
        console.log(weatherObj);
        setDisplayData(weatherObj);
    }

    catch (error) {
        console.log('not working');
    }
}

searchButton.addEventListener("click", (e) => {
    e.preventDefault()
    positionName = searchInput.value;
    getWeather(positionName);
    todayDate.innerText = `${day} ${month}`;
});

const setDisplayData = (data) => {
    locationName.innerText = `${data.resolvedAddress}`;
    tempNow.innerText = `${tempConvert(data.currentConditions.temp).toFixed(1)}\u00B0`;
    feelsLike.innerText = `Feels like ${tempConvert(data.currentConditions.feelslike).toFixed(1)}\u00B0`;
    weatherImg.src = weatherIcons[data.currentConditions.icon];
    weatherSymbol.append(weatherImg);
    highText.innerText =  `${tempConvert(data.days[0].tempmax).toFixed(1)}\u00B0`;
    lowText.innerText =  `${tempConvert(data.days[0].tempmin).toFixed(1)}\u00B0`;
    description.innerText = `${data.description}`;
    nextFewDays(data.days);
}

const updateDisplay = () => { 
    setDisplayData(weatherObj); // Assuming currentWeatherData holds your weather data 
} 

sliderInput.addEventListener("input", (e) => {
    tempUnit = e.target.checked ? true : false;
    updateDisplay();
});




