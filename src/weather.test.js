import { showWeather, getWeather } from "./weather";

describe("Test weather.js", () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ city: "Barcelona" }),
    })
  );
  const weatherTest = {
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01n",
      },
    ],
    main: {
      temp: -20,
    },
    sys: {
      country: "RU",
    },
    name: "Moscow",
    cod: 200,
  };
  function mockPage() {
    document.body.innerHTML = `
    <form>
     <input/>
     <button>Найти</button>    
    </form>
    <div class="weatherposition"> 
     <p id="currentWeather">     
      <p>London</p>
      <p>0</p>
     </p>       
    </div>
    <div class="imageposition">   
     <img id="location" height="300" width="300"></img>  
    </div>
    <ol></ol>`;
  }

  describe("Check showWeather", () => {
    mockPage();
    it(`replaces child tags from currentWeather tag 
                      to values from input`, () => {
      showWeather(weatherTest, "Moscow");
      const weatherEl = document.querySelector("#currentWeather");
      const weatherChildElements = weatherEl.children;
      expect(weatherChildElements.item(0).innerText).toBe("Moscow");
      expect(weatherChildElements.item(1).innerText).toBe(-20);
      expect(weatherChildElements.item(2).innerText).not.toBe(null);
    });
    it(`adds <Населенный пункт не найден> to currentWeather tag 
                                  if the city was not found`, () => {
      const weatherTestNF = `{
        "cod": "404",
        "message": "city not found"
        }`;
      showWeather(weatherTestNF, "IncorrectCityName");
      const weatherEl = document.querySelector("#currentWeather");
      const weatherChildElements = weatherEl.children;

      expect(weatherChildElements.item(0).innerText).toBe("IncorrectCityName");
      expect(weatherChildElements.item(1).innerText).toBe(
        "Населенный пункт не найден"
      );
      expect(weatherChildElements.item(3)).toBe(null);
    });
  });

  describe("Check getWeather", () => {
    mockPage();
    const weather = getWeather("Moscow");
    it("returns object, containing <cod> field", () => {
      expect(typeof weather.cod).not.toBe(undefined);
    });
  });
});
