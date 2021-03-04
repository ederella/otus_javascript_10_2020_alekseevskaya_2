import { getDefaultLocation, showLocationPicture } from "./location";

describe("Test location.js", () => {
  let imageEl;

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ city: "Barcelona" }),
    })
  );
  beforeEach(() => {
    fetch.mockClear();
  });
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

    imageEl = document.querySelector("#location");
  }

  describe("Check getDefaultLocation", () => {
    it("returns String", async () => {
      const defLocation = await getDefaultLocation();
      expect(typeof defLocation).toBe("string");
    });
  });
  describe("Check showLocationPicture", () => {
    mockPage();
    showLocationPicture(weatherTest);
    it("adds new src to <img id=location>", () => {
      expect(imageEl.src).not.toBe("");
    });
  });
});
