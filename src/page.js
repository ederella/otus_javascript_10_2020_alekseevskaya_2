import { getDefaultLocation, maintainLocationInfo } from "./location";

export async function pageLoad() {
  const defaultLocation = await getDefaultLocation();
  maintainLocationInfo(defaultLocation);
  const formEl = document.querySelector("form");
  const ol = document.querySelector("ol");
  showCitiesFromLocalStorage(formEl);
  formEl.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const formElement = ev.target;
    const inputEl = formElement.querySelector("input");
    const cityName = inputEl.value;
    inputEl.value = "";

    saveRequestInfo(formEl, ol);
    maintainLocationInfo(cityName);
  });
}

export function saveRequestInfo(formElement, ol) {
  const weatherInfoEl = document.querySelector("#currentWeather");
  if (weatherInfoEl.firstChild) {
    const viewedCity = weatherInfoEl.firstChild;
    const li = document.createElement("li");
    li.textContent = viewedCity.textContent;

    Array.from(ol.children).forEach((element) => {
      if (element.textContent === li.textContent) {
        ol.removeChild(element);
        localStorage.removeItem(element.textContent);
      }
    });

    li.addEventListener("click", () => {
      const inputEl = formElement.querySelector("input");
      inputEl.value = li.textContent;
      const event = new window.Event("submit");
      formElement.dispatchEvent(event);
    });

    ol.appendChild(li);
    localStorage.setItem(viewedCity.textContent, Date.now());
  }

  if (ol.childElementCount > 10) {
    localStorage.removeItem(ol.children[0].textContent);
    ol.removeChild(ol.children[0]);
  }
}

export function showCitiesFromLocalStorage(formElement) {
  const sortedLocalStorage = Object.keys(localStorage).sort(
    (key1, key2) => localStorage.getItem(key1) - localStorage.getItem(key2)
  );
  const ol = document.querySelector("ol");
  ol.innerHTML = "";

  Object.keys(sortedLocalStorage).forEach((key) => {
    const li = document.createElement("li");
    li.textContent = sortedLocalStorage[key];
    li.addEventListener("click", () => {
      const inputEl = formElement.querySelector("input");
      inputEl.value = li.textContent;
      const event = new window.Event("submit");
      formElement.dispatchEvent(event);
    });
    ol.appendChild(li);
  });
}
