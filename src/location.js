import { showWeather, getWeather } from "./weather";

const RESPONSE_OK = 200;
const ZOOM_CITY_SIZE = 10;

export async function getDefaultLocation() {
  const geoData = await fetch(`https://get.geojs.io/v1/ip/geo.json`);
  const text = await geoData.json();
  return text.city;
}

export async function showLocationPicture(weather) {
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
    imageEl.src = "./image/not_found.jpg";
  }
}

export async function maintainLocationInfo(location) {
  const weather = await getWeather(location);
  showWeather(weather, location);
  showLocationPicture(weather);
}
