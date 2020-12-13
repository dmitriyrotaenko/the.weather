import "./styles.sass";
import "regenerator-runtime/runtime";
import { Autocomplete } from "./modules/Autocomplete";
import { LocationDate } from "./modules/LocationDate";
import * as operations from "./modules/Operations";
import DOM from "./modules/DOM";
import { 
  matchIcon, 
  matchImage,
  trimLongString
} from "./modules/utils";
import Loader from "./modules/Loader";
import Tooltip from "./modules/Tooltip";


const loader = new Loader();

window.addEventListener("load", () => loader.destroy());


const onCitySelect = async cityKey => {

  loader.start();

  try {
    await axios.get(`http://dataservice.accuweather.com/locations/v1/${cityKey}`, {
      params: {
        apikey: "YOUR_API_KEY",
        details: true
      }
    })
    .then(async cityInfo => {
      // getting lat and long for LocationDate
      const { Latitude, Longitude } = cityInfo.data.GeoPosition;
      const locationDate = new LocationDate(Latitude, Longitude);
      const { time, weekDay, date } = await locationDate.getFormattedDate();
      


      // current weather
      const weather = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${cityKey}?`, {
        params: {
          apikey: "YOUR_API_KEY",
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



      // render city data (temperature, date and time, etc.)
      operations.renderData([
        { target: DOM.currentTemp, content: `${temperature}\u00b0` },
        { target: DOM.cityName, content: trimLongString(cityInfo.data.LocalizedName) },
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
        const precipDetails = operations.createElement({
          tagName: "li",
          attributes: {
            classes: ["details_item", "precips"]
          },
          children: [
            operations.createElement({
              tagName: "span",
              attributes: {
                classes: ["details_name"]
              },
              children: [
                // precipitation type (rain, snow, etc.)
                operations.createElement({
                  tagName: "text",
                  content: `${today.PrecipitationType}`
                })
              ]
            }),
            operations.createElement({
              tagName: "span",
              attributes: {
                classes: ["details_value", "precip_value"]
              },
              children: [
                // precipitation value in mm
                operations.createElement({
                  tagName: "text",
                  content: `${today.Precip1hr.Metric.Value}mm`
                })
              ]
            })
          ]
        });

        DOM.detailsList.appendChild(precipDetails);
      } 


      // getting 5-days forecast
      return await axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}`, {
        params: {
          apikey: "YOUR_API_KEY",
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
        // skip today"s forecast
        if(forecast === forecasts[0]) continue;

        const weekDay = new Date(forecast.Date).toLocaleString("en-GB", {weekday: "long"});
        const icon = matchIcon(forecast.Day.Icon);
        icon.classList.add("fa-1x")

        const listElement = operations.createElement({
          tagName: "li",
          attributes: {
            classes: ["nextDays_item"]
          },
          children: [
            // building week day HTML
            operations.createElement({
              tagName: "div",
              attributes: {
                classes: ["nextDays_item-box"]
              },
              children: [
                operations.createElement({
                  tagName: "span",
                  attributes: {
                    classes: ["nextDays_day"]
                  },
                  children: [
                    operations.createElement({
                      tagName: "text",
                      content: weekDay
                    })
                  ]
                })
              ]
            }),

            // building icon HTML
            operations.createElement({
              tagName: "div",
              attributes: {
                classes: ["nextDays_item-box", "nextDays_item-centered"]
              },
              children: [
                operations.createElement({
                  tagName: "span",
                  attributes: {
                    classes: ["nextDays_state"]
                  },
                  children: [
                    icon
                  ]
                })
              ]
            }),

            // building min/max temperature HTML
            operations.createElement({
              tagName: "div",
              attributes: {
                classes: ["nextDays_item-box"]
              },
              children: [
                operations.createElement({
                  tagName: "div",
                  attributes: {
                    classes: ["nextDays_temps"]
                  },
                  children: [
                    // max temp
                    operations.createElement({
                      tagName: "span",
                      attributes: {
                        classes: ["nextDays_max"]
                      }, 
                      children: [
                        operations.createElement({
                          tagName: "text",
                          content: `${Math.ceil(forecast.Temperature.Maximum.Value)}\u00b0`
                        })
                      ]
                    }),
                    // min temp
                    operations.createElement({
                      tagName: "span",
                      attributes: {
                        classes: ["nextDays_min"]
                      }, 
                      children: [
                        operations.createElement({
                          tagName: "text",
                          content: `${Math.ceil(forecast.Temperature.Minimum.Value)}\u00b0`
                        })
                      ]
                    }),
                  ]
                })
              ]
            })
          ]
        });
 
        DOM.nextDaysList.appendChild(listElement);

        new Tooltip(listElement.children[1].children[0], forecast.Day.IconPhrase);
      }

      if(DOM.nextDays.classList.contains("hidden")) 
        DOM.nextDays.classList.remove("hidden");

        loader.destroy();
    });
    


  } catch(e) {
    alert("Something went wrong. Try again.")
    console.log(e);
  }
}

// autocomplete config
const config = {
  fetchData: async searchValue => {
    const response = await axios.get("http://dataservice.accuweather.com/locations/v1/cities/autocomplete", {
      params: {
        q: searchValue,
        apikey: "YOUR_API_KEY"
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


/*
  -- autodetect
  -- fix scroll issue
  -- compact styles
*/