
// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const form = document.getElementById('form')
const searchVal = document.querySelector('.myform')
const btn = document.querySelector(".btn")
const wind = document.querySelector(".wind-value p")
const humidity = document.querySelector(".Humidity-value p")
const visibility = document.querySelector(".Visibility-value p")

//City name
let CityName = ""

form.addEventListener('submit',(e)=>{
    if(searchVal.value.length==0){
        alert("Enter a city name");
    }
    else{
        CityName = searchVal.value;
        fetchWeatherData();
        searchVal.value = "";
    }
    e.preventDefault();
})
// App data
const weather = {};

weather.temperature = {
    unit : "celsius"
}

// APP CONSTS AND VARS
const KELVIN = 273;
// API KEY
const key = "0831a7db4a03c2873624ebd00abc7385";

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// SET USER'S POSITION
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    getWeather(latitude, longitude);
    getForecast(latitude,longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

//Get longitude and latitude
if(CityName=""){
    console.log("Default weather will be printed")
}
else{
function fetchWeatherData() {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${CityName}&limit=5&appid=0831a7db4a03c2873624ebd00abc7385`)
    .then(Response=>Response.json())
    .then(data=>{
       console.log(data[0]);

       const address = data[0];
       lat = address.lat;
       lon = address.lon;
       console.log(lat,lon);
       getWeather(lat,lon);
       getForecast(lat,lon);
    }).catch(()=>{
        alert("This promise could not be fullfilled");
    }
    )
}
}

// GET WEATHER FROM API PROVIDER
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            console.log(data)
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.wind = data.wind.speed;
            weather.humidity = data.main.humidity;
            weather.visibility = data.visibility;
        })
        .then(function(){
            displayWeather();
        });
}

function getForecast(latitude, longitude) {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}`)
    .then(Response=>Response.json())
    .then(data=>{
       console.log(data);
       for (let i = 0; i < 5; i++) {
        if(i==0){
            console.log(data.list[i]);
            document.getElementById(`day${i+1}min`).innerHTML = `${Number(data.list[i].main.temp_min-273.15).toFixed(1)}°<span>C</span> <br> min`;
            document.getElementById(`day${i+1}max`).innerHTML = `${Number(data.list[i].main.temp_max-273.15).toFixed(1)}°<span>C</span> <br> max`;
            document.getElementById(`icon-${i+1}`).innerHTML = `<img src="icons/${data.list[i].weather[0].icon}.png" alt="">`;
            
        }
        else{
            console.log(data.list[(i*10)-1]);
            document.getElementById(`day${i+1}min`).innerHTML = `${Number(data.list[(i*10)-1].main.temp_min-273.15).toFixed(1)}°<span>C</span> <br> min`;
            document.getElementById(`day${i+1}max`).innerHTML = `${Number(data.list[(i*10)-1].main.temp_max-273.15).toFixed(1)}°<span>C</span> <br> max`;
            document.getElementById(`icon-${i+1}`).innerHTML = `<img src="icons/${data.list[(i*10)-1].weather[0].icon}.png" alt="">`;

        }
       }
    }).catch(()=>{
        alert("This promise could not be fullfilled");
    }
    )
}

// DISPLAY WEATHER TO UI
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    humidity.innerHTML = `<p>Humidity :${weather.humidity} g.m-3</p>`;
    wind.innerHTML = `<p>Wind Speed :${weather.wind}m/s</p>`;
    visibility.innerHTML = `<p>visibility :${weather.visibility} m </p>`;
}

// C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENT
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});

//function to get day 

var d = new Date();
var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thrusday","Friday","Saturday"];

function CheckDay(day){
    if (day + d.getDay()>6) {
        return day + d.getDay()-7;
    }
    else{
        return day + d.getDay();
    }
}
for(i=0;i<5;i++){
    console.log(weekday[CheckDay(i)])
    document.getElementById(`day${i+1}`).innerHTML = weekday[CheckDay(i)];
}
