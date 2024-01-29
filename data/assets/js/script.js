const canvas0 = document.getElementById('canvas0');
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const canvas3 = document.getElementById('canvas3');
const canvas4 = document.getElementById('canvas4');
const canvas5 = document.getElementById('canvas5');

const canvases = [];
canvases.push(canvas0);
canvases.push(canvas1);
canvases.push(canvas2);
canvases.push(canvas3);
canvases.push(canvas4);
canvases.push(canvas5);


const canvasContainer0 = document.getElementById('canvas-container0');
const canvasContainer1 = document.getElementById('canvas-container1');
const canvasContainer2 = document.getElementById('canvas-container2');
const canvasContainer3 = document.getElementById('canvas-container3');
const canvasContainer4 = document.getElementById('canvas-container4');
const canvasContainer5 = document.getElementById('canvas-container5');

const canvasContainers = [];
canvasContainers.push(canvasContainer0);
canvasContainers.push(canvasContainer1);
canvasContainers.push(canvasContainer2);
canvasContainers.push(canvasContainer3);
canvasContainers.push(canvasContainer4);
canvasContainers.push(canvasContainer5);


const menuOption1 = document.querySelector("#menuOption0");
const menuOption2 = document.querySelector("#menuOption1");
const menuOption3 = document.querySelector("#menuOption2");
const menuOption4 = document.querySelector("#menuOption3");
const menuOption5 = document.querySelector("#menuOption4");
const menuOption6 = document.querySelector("#menuOption5");

const menuOptions = [];

menuOptions.push(menuOption1);
menuOptions.push(menuOption2);
menuOptions.push(menuOption3);
menuOptions.push(menuOption4);
menuOptions.push(menuOption5);
menuOptions.push(menuOption6);

var stage = []

for(let i = 0; i < canvases.length; i++)
{
    stage.push(new createjs.Stage(canvases[i]));
    canvasStorages.push({ nodes: [], edges: [] });
}

for(let i = 0; i < stage.length; i++)
{

}


const menuCardsContainer = document.getElementsByClassName("menu-cards-container")[0];
const BackToMenuButton = document.getElementById('back');

var currentCanvasId = 0;
var canvas;
var context;
BackToMenuButton.addEventListener("click", function(){
    menuCardsContainer.classList.remove('canvas-container-hidden');
    BackToMenuButton.classList.add('back');

    canvasContainers.forEach(function (canvasContainer){
            canvasContainer.classList.remove('canvas-container-visible');
            canvasContainer.classList.add('canvas-container-hidden');
    });

});

function setFunctionToMenuOption(menuOption, index)
{
    menuOption.addEventListener("click",displayCanvas);
    menuOption.index = index;
}   

menuOptions.forEach(setFunctionToMenuOption)

/*window.onload = function() {
    //loadCanvas()
}*/
function displayCanvas(evt)
{
    menuCardsContainer.classList.add('canvas-container-hidden');
    BackToMenuButton.classList.remove('back');
    currentCanvasId = evt.currentTarget.index;

    let canvasContainerId = "canvas-container" + evt.currentTarget.index;
    console.log("canvas: "+evt.currentTarget.index);

    canvas = canvases[currentCanvasId];
    context = canvas.getContext("2d");

    stage[currentCanvasId].enableMouseOver(10);
    stage[currentCanvasId].mouseMoveOutside = true;

    canvasContainers.forEach(function (canvasContainer){
        if(canvasContainer.id != canvasContainerId)
        {
            canvasContainer.classList.remove('canvas-container-visible');
            canvasContainer.classList.add('canvas-container-hidden');
        }
    });

    document.getElementById(canvasContainerId).classList.remove('canvas-container-hidden');
    document.getElementById(canvasContainerId).classList.add('canvas-container-visible') ;

    console.log(evt.currentTarget.index);
    img = new Image();
    //const canvas = canvases[evt.currentTarget.index].getContext('2d');
    //img.src = "assets/images/image.png";
    //canvas.drawImage(img, 0,0);

    update = true;
};

const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const currentWeather = document.querySelector(".current-weather");
const weatherCards = document.querySelector(".weather-cards");
let map;

const API_KEY = "209d211d218a71e4b96028b3ac90bc95";

const createHtmlForDay = (name, weatherItem, day) => {
    let weatherDate = `${weatherItem.dt_txt.split(" ")[0]}`
    if(day == 0) { 
        return `<div class="details">
                    <h2>${name} - ${weatherDate}</h2>
                    <h6>Temperature: ${(weatherItem.main.temp).toFixed()}°C</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                    <h6>Wind Speed: ${weatherItem.wind.speed} m/s</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                </div>`;
    } else { 
        return `<li class="card">
                    <h3>${weatherDate}</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Temperature: ${(weatherItem.main.temp).toFixed()}°C</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                    <h6>Wind Speed: ${weatherItem.wind.speed} m/s</h6>
                </li>`;
    }
}

const getWeatherForCity = (name, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
    
    cityInput.value = "";
    currentWeather.innerHTML = "";
    weatherCards.innerHTML = "";

    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
        let datesUnique = [];
        let fiveDaysForecast = data.list.filter(dayForecast => {
            let forecastDate = new Date(dayForecast.dt_txt).getDate();
            if (!datesUnique.includes(forecastDate)) {
                return datesUnique.push(forecastDate);
            }
        });

        fiveDaysForecast.forEach((dayWeather, day) => {
            let html = createHtmlForDay(name, dayWeather, day);
            if (day == 0) {
                currentWeather.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCards.insertAdjacentHTML("beforeend", html);
            }
        });        
    }).catch(() => {
        alert("Nedokázal jsem fetchnout data z API");
    });
}

const getCity = () => {
    let cityName = cityInput.value;
    if (cityName == "")
        return;

    let API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&units=metric&limit=1&appid=${API_KEY}`;
    
    fetch(API_URL).then(response => response.json()).then(data => {
        if (!data.length) 
            return alert(`${cityName} nebylo nalezeno.`);

        let { name, lat, lon } = data[0];
        getWeatherForCity(name, lat, lon);
        initMap(lat,lon);
    }).catch(() => {
        alert("Nedokázal jsem fetchnout město z API");
    });
}


async function initMap(latitude,longitude) {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: latitude, lng: longitude },
    zoom: 8,
  });
}

searchBtn.addEventListener("click", getCity);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCity());