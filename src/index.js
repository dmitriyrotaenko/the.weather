import "regenerator-runtime/runtime";
import { 
  Autocomplete,
  DOM, 
  operations,
  matchIcon, 
  matchImage, 
  toggleBtn,
  getUserLocation, 
  getLocationData, 
  getCityKey,
  formatDate,
  Tooltip,
  Modal,
  Loader
} from "./modules/exports";

import "./styles.sass";



const loader = new Loader();

window.addEventListener("load", () => {
  const askUserPermission = new Modal("Would you like to share your location to get weather forecast?", {
    onCancel: () => {
      askUserPermission.destroy(true);
      document.querySelector(".autocomplete_input").focus();
    },
    onSubmit: () => getUserLocation(async position => {
      // disable buttons while request
      toggleBtn(askUserPermission.okButton, askUserPermission.cancelButton);
      const { latitude, longitude } = position.coords;
      const zone = (await getLocationData(latitude, longitude)).zoneName;
      /* extract city name by removing country name 
      and underscores from the "zone" string */
      const cityName = zone.substring(zone.indexOf("/") + 1).replace("_", " ");

      const clarifyLocation = new Modal(`Is ${cityName} your current location?`, {
        onCancel: () => {
          clarifyLocation.destroy(true),
          document.querySelector(".autocomplete_input").focus();
        },
        onSubmit: async () => {
          // disable buttons while request
          toggleBtn(clarifyLocation.okButton, clarifyLocation.cancelButton);
          const cityKey = await getCityKey(cityName);
          clarifyLocation.destroy(false);
          onCitySelect(cityKey);
        }
      });
      }, askUserPermission.destroy)
  });
});


const onCitySelect = async cityKey => {

  DOM.quote.style.display = "none";

  loader.init();

  try {
    await axios.get(`http://dataservice.accuweather.com/locations/v1/${cityKey}`, {
      params: {
        apikey: "H51SHkvJDM21y24lqnOTIGLcST6HwYSy",
        details: true
      }
    })
    .then(async cityInfo => {
      // getting lat and long for LocationDate
      const { Latitude, Longitude } = cityInfo.data.GeoPosition;

      const locationDate = (await getLocationData(Latitude, Longitude)).formatted;

      const { time, weekDay, date } = formatDate(locationDate);
    
      // current weather
      const weather = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${cityKey}?`, {
        params: {
          apikey: "H51SHkvJDM21y24lqnOTIGLcST6HwYSy",
          details: true
        }
      });

      // show details 
      DOM.details.classList.remove("hidden");

      const today = weather.data[0];
      const temperature = Math.ceil(today.Temperature.Metric.Value);
      const matchedIcon = matchIcon(today.WeatherIcon);
      matchedIcon.classList.add("fa-3x");

      // change main and blurred images according to current weather state
      matchImage(today.WeatherIcon, [DOM.weatherLeft, DOM.blurred]);

      // remove an icon from the previous response
      operations.removeChildren(DOM.mainIcon);



      // render city data (temperature, date,  time, etc.)
      operations.renderData([
        { target: DOM.currentTemp, content: `${temperature}\u00b0` },
        { target: DOM.cityName, content: cityInfo.data.LocalizedName },
        { target: DOM.cityDate, content: `${time} - ${weekDay}, ${date}` },
        { target: DOM.mainIcon, content: matchedIcon },
        { target: DOM.state, content: today.WeatherText},
        // render details
        { target: DOM.cloudyValue, content: `${today.CloudCover}%`},
        { target: DOM.windValue, content: `${today.Wind.Speed.Metric.Value}km/h`},
        { target: DOM.humidityValue, content: `${today.RelativeHumidity}%`},
      ]);

      if(DOM.detailsList.lastElementChild.classList.contains("precips")) {
        operations.destroyElement(DOM.detailsList.lastElementChild)
      }
      
      // adding precipitation data if any
      if(today.HasPrecipitation) {
        const precipDetails = operations.buildPrecipHTML(today);
        DOM.detailsList.appendChild(precipDetails);
      } 


      // return 5-days forecast for the next request
      return await axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}`, {
        params: {
          apikey: "H51SHkvJDM21y24lqnOTIGLcST6HwYSy",
          metric: true
        }
      });
    })
    .then(fiveDays => {
      const forecasts = fiveDays.data.DailyForecasts;

      // clear next days forecasts from previous response
      if(DOM.nextDaysList.children !== 0) {
        operations.removeChildren(DOM.nextDaysList);
      }

      // build and render next days forecast
      for(let forecast of forecasts) {
        // skip today's forecast
        if(forecast === forecasts[0]) continue;

        const weekDay = new Date(forecast.Date).toLocaleString("en-GB", {weekday: "long"});
        const icon = matchIcon(forecast.Day.Icon);
        icon.classList.add("fa-1x")

        const listElement = operations.buildNextDayHTML({
          weekDay,
          icon,
          maxTemp: forecast.Temperature.Maximum.Value,
          minTemp: forecast.Temperature.Minimum.Value
        });
 
        DOM.nextDaysList.appendChild(listElement);

        // tooltip instance for every icon
        new Tooltip(listElement.children[1].children[0], forecast.Day.IconPhrase);
      }

      if(DOM.nextDays.classList.contains("hidden")) 
        DOM.nextDays.classList.remove("hidden");

        loader.destroy(true);
    });
    


  } catch(e) {
    alert("Something went wrong. Try again.");
  }
}


const config = {
  fetchData: async searchValue => {
    const response = await axios.get("http://dataservice.accuweather.com/locations/v1/cities/autocomplete", {
      params: {
        q: searchValue,
        apikey: "H51SHkvJDM21y24lqnOTIGLcST6HwYSy"
      }
    });
    
    if(!response.data.length) return [];

    return response;
  },
  renderOption: ({LocalizedName, Country}) => {
    return `${LocalizedName}, ${Country.LocalizedName}`
  },
  onOptionSelect: onCitySelect
}


new Autocomplete({
  ...config,
  root: document.querySelector(".autocomplete")
});
