const RESPONSE_OK = 200;
const ZOOM_CITY_SIZE = 10;

async function pageLoad() {
  const defaultLocation = await exportFunctions.getDefaultLocation();
  exportFunctions.maintainLocationInfo(defaultLocation);
  const formEl = document.querySelector("form");
  const ol = document.querySelector("ol");

  formEl.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const formElement = ev.target;
    const inputEl = formElement.querySelector("input");
    const cityName = inputEl.value;
    inputEl.value = "";

    exportFunctions.savePreviousRequestInfo(formEl, ol);
    exportFunctions.maintainLocationInfo(cityName);
  });
}
async function maintainLocationInfo(location) {
  const weather = await exportFunctions.getWeather(location);
  exportFunctions.showWeather(weather, location);
  exportFunctions.showLocationPicture(weather);
}
function showWeather(weatherInfo, city) {
  const weatherInfoEl = document.querySelector("#currentWeather");
  while (weatherInfoEl.firstChild) {
    weatherInfoEl.removeChild(weatherInfoEl.firstChild);
  }
  const p = document.createElement("p");
  p.innerText = city;
  weatherInfoEl.appendChild(p);

  if (weatherInfo.cod === RESPONSE_OK) {
    const p1 = document.createElement("p");
    const tempMain = weatherInfo.main;
    p1.innerText = tempMain.temp;
    weatherInfoEl.appendChild(p1);

    const weatherPic = weatherInfo.weather[0];
    const { icon } = weatherPic;
    const img = document.createElement("img");
    img.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    weatherInfoEl.appendChild(img);
  } else {
    const p = document.createElement("p");
    p.innerText = "Населенный пункт не найден";
    weatherInfoEl.appendChild(p);
  }
}

async function getWeather(cityName) {
  const appId = "2226af13e13530416ef7ac7e81d578aa";
  const url =
    `https://api.openweathermap.org/data/2.5/weather?` +
    `units=metric&q=${cityName}&appid=${appId}`;
  const response = await fetch(url);
  const responceJson = await response.json();
  return responceJson;
}

async function getDefaultLocation() {
  const geoData = await fetch(`https://get.geojs.io/v1/ip/geo.json`);
  const text = await geoData.json();
  return text.city;
}

async function showLocationPicture(weather) {
  const imageEl = document.querySelector("#location");
  if (weather.cod === RESPONSE_OK) {
    const appId = "AIzaSyC0CxAubdDFHJEW_yoJkqy18PkYCzRNMs0";
    const city = weather.name;
    const sysInfo = weather.sys;
    imageEl.src =
      `https://maps.googleapis.com/maps/api/staticmap?` +
      `center=${city},${sysInfo.country}` +
      `&zoom=${ZOOM_CITY_SIZE}` +
      `&size=${imageEl.height}x${imageEl.width}` +
      `&key=${appId}`;
  } else {
    imageEl.src = "src/image/not_found.jpg";
  }
}
function savePreviousRequestInfo(formElement, ol) {
  const weatherInfoEl = document.querySelector("#currentWeather");
  if (weatherInfoEl.firstChild) {
    const viewedCity = weatherInfoEl.firstChild;
    const li = document.createElement("li");
    li.textContent = viewedCity.textContent;

    Array.from(ol.children).forEach((element) => {
      if (element.textContent === li.textContent) {
        ol.removeChild(element);
      }
    });

    li.addEventListener("click", () => {
      const inputEl = formElement.querySelector("input");
      inputEl.value = li.textContent;
      const event = new window.Event("submit");
      formElement.dispatchEvent(event);
    });

    ol.appendChild(li);
  }

  if (ol.childElementCount > 10) {
    ol.removeChild(ol.children[0]);
  }
}

export const exportFunctions = {
  pageLoad,
  maintainLocationInfo,
  showWeather,
  getWeather,
  getDefaultLocation,
  showLocationPicture,
  savePreviousRequestInfo,
};
