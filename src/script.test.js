import { exportFunctions } from "./script";
import "regenerator-runtime/runtime";

describe("Test script.js", () => {
  let formEl;
  let imageEl;
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

    formEl = document.querySelector("form");
    imageEl = document.querySelector("#location");
  }

  describe("Check pageLoad", () => {
    mockPage();
    jest
      .spyOn(exportFunctions, "getDefaultLocation")
      .mockImplementation(() => "Moscow");
    jest.spyOn(exportFunctions, "maintainLocationInfo");
    exportFunctions.pageLoad();
    it("calls getDefaultLocation", () => {
      expect(exportFunctions.getDefaultLocation).toHaveBeenCalled();
    });

    it("calls maintainLocationInfo", () => {
      expect(exportFunctions.maintainLocationInfo).toHaveBeenCalled();
    });
  });

  describe("Check maintainLocationInfo", () => {
    mockPage();
    jest
      .spyOn(exportFunctions, "getWeather")
      .mockImplementation(() => weatherTest);
    jest.spyOn(exportFunctions, "showWeather");
    jest.spyOn(exportFunctions, "showLocationPicture");
    exportFunctions.maintainLocationInfo("Moscow");
    it("calls getWeather", () => {
      expect(exportFunctions.getWeather).toHaveBeenCalled();
    });
    it("calls showWeather", () => {
      expect(exportFunctions.showWeather).toHaveBeenCalled();
    });
    it("calls showLocationPicture", () => {
      expect(exportFunctions.showLocationPicture).toHaveBeenCalled();
    });
  });

  describe("Check showWeather", () => {
    it(`replaces child tags from currentWeather tag 
                      to values from input`, () => {
      exportFunctions.showWeather(weatherTest, "Moscow");
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
      exportFunctions.showWeather(weatherTestNF, "IncorrectCityName");
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
    const weather = exportFunctions.getWeather("Moscow");
    it("returns object, containing <cod> field", () => {
      expect(typeof weather.cod).not.toBe(undefined);
    });
  });

  describe("Check getDefaultLocation", () => {
    const defLocation = exportFunctions.getDefaultLocation();
    it("returns String", () => {
      expect(typeof defLocation).toBe("string");
    });
  });

  describe("Check showLocationPicture", () => {
    mockPage();
    exportFunctions.showLocationPicture(weatherTest);
    it("adds new src to <img id=location>", () => {
      expect(imageEl.src).not.toBe("");
    });
  });

  describe("Check savePreviousRequestInfo", () => {
    it("creates new list element", () => {
      mockPage();
      const ol = document.querySelector("ol");
      exportFunctions.savePreviousRequestInfo(formEl, ol);
      expect(ol.childElementCount).toBe(1);
    });
    it("removes duplicates", () => {
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
      <ol>London</ol>`;
      const ol = document.querySelector("ol");
      exportFunctions.savePreviousRequestInfo(formEl, ol);
      expect(ol.childElementCount).toBe(1);
    });
    it("removes first child if list length greater than 10", () => {
      document.body.innerHTML = `
      <form>
       <input/>
       <button>Найти</button>    
      </form>
      <div class="weatherposition"> 
       <p id="currentWeather">     
       <p>Moscow</p>
       <p>0</p></p>       
      </div>
      <div class="imageposition">   
       <img id="location" height="300" width="300"></img>  
      </div>
      <ol>
        <li>Paris</li>
        <li>New York</li>
        <li>Milan</li>
        <li>Istanbul</li>
        <li>Riga</li>
        <li>Chisinau</li>
        <li>Minsk</li>
        <li>Barcelona</li>
        <li>Los Angeles</li>
        <li>Vladivostok</li>
      </ol>`;
      const ol = document.querySelector("ol");
      formEl = document.querySelector("form");
      expect(ol.childElementCount).toBe(10);
      exportFunctions.savePreviousRequestInfo(formEl, ol);
      expect(ol.childElementCount).toBe(10);
    });
  });
  describe("Check form submit", () => {
    mockPage();
    jest.spyOn(exportFunctions, "savePreviousRequestInfo");
    jest.spyOn(exportFunctions, "maintainLocationInfo");
    const event = new window.Event("submit");

    it("calls savePreviousRequestInfo", () => {
      formEl.dispatchEvent(event);
      expect(exportFunctions.savePreviousRequestInfo).toHaveBeenCalled();
    });
    it("calls maintainLocationInfo", () => {
      formEl.dispatchEvent(event);
      expect(exportFunctions.maintainLocationInfo).toHaveBeenCalled();
    });
  });
});
