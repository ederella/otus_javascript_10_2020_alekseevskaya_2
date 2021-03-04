import { pageLoad, saveRequestInfo, showCitiesFromLocalStorage } from "./page";
import * as location from "./location";

describe("Test page.js", () => {
  let formEl;
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ city: "Barcelona" }),
    })
  );
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
  }

  describe("Check pageLoad", () => {
    mockPage();
    const spyGetDefaultLocation = jest.spyOn(location, "getDefaultLocation");
    const spyMaintainLocationInfo = jest.spyOn(
      location,
      "maintainLocationInfo"
    );
    pageLoad();
    it("calls getDefaultLocation", () => {
      expect(spyGetDefaultLocation).toBeCalled();
    });
    it("calls maintainLocationInfo", () => {
      expect(spyMaintainLocationInfo).toBeCalled();
    });
  });

  describe("Check showCitiesFromLocalStorage", () => {
    it("adds cities from localStorage to list", () => {
      localStorage.clear();
      localStorage.setItem("Istanbul", 1);
      showCitiesFromLocalStorage(formEl);
      const ol = document.querySelector("ol");
      const li = ol.firstChild;
      expect(li.textContent).toBe("Istanbul");
    });
    localStorage.clear();
  });

  describe("Check saveRequestInfo", () => {
    it("creates new list element", () => {
      mockPage();
      const ol = document.querySelector("ol");
      saveRequestInfo(formEl, ol);
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
      saveRequestInfo(formEl, ol);
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
      saveRequestInfo(formEl, ol);
      expect(ol.childElementCount).toBe(10);
    });
  });
});
