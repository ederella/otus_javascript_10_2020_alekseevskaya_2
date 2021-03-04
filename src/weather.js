const RESPONSE_OK = 200;
export function showWeather(weatherInfo, city) {
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

export async function getWeather(cityName) {
  const appId = "2226af13e13530416ef7ac7e81d578aa";
  const url =
    `https://api.openweathermap.org/data/2.5/weather?` +
    `units=metric&q=${cityName}&appid=${appId}`;
  const response = await fetch(url);
  const responceJson = await response.json();
  return responceJson;
}
