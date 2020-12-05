import { createElement } from './Operations';

// importing images
import clearDay from '../images/clear_day.jpg';
import clearNight from '../images/clear_night.jpg';
import clouds from '../images/clouds.jpg';
import rain from '../images/rain.png';
import snow from '../images/snow.jpg' 
import thunder from '../images/thunder.jpg'

/**
 * @param {function} callback - function to execute
 * @param {number} delay - interval to execute function with
 */

export const debounce = (callback, delay = 1000) => {
  let timeoutID;
  return (...args) => {
    if(timeoutID) {
      clearTimeout(timeoutID);
    }
    timeoutID = setTimeout(() => {
      callback.apply(null, args);
    }, delay)
  }
} 

/**
 * @param {number} stateID - ID of the state got from the API call 
 * @param {HTMLElement|Array<HTMLElement>} target - target(s) to change backgroundImage of
 * 
 * @returns {void} 
 */
export const matchImage = (stateID, target) => {
  let url;

  switch(stateID) {
    case 1: case 2: case 3: case 30: default: url = clearDay;
      break;
    case 4: case 5: case 6: case 7: 
    case 8: case 11: case 31: case 32: url = clouds; 
      break;
    case 12: case 13: case 14: case 15: 
    case 16: case 17: case 18: case 39: 
    case 40: url = rain;
      break;
    case 19: case 20: case 21: case 22: 
    case 23: case 24: case 25: case 26: 
    case 29: case 43: case 44: case 43: 
    case 44: url = snow;
      break;
    case 33: case 34: case 35: case 36: case 37: case 38: url = clearNight;
      break;
    case 42: case 42: url = thunder;
      break;
  }

  if(target instanceof Array) {
    target.forEach(element => element.style.backgroundImage = `url(${url})`);
  } else {
    target.style.backgroundImage = `url(${url})`;
  }
}


/**
 * @param {number} iconID - ID of the icon got from the API call
 */
export const matchIcon = iconID => {
  let matchedIconClass;
  
  const icon = createElement({
    tagName: 'i',
    attributes: {
      classes: ['fas']
    }
  })

  // using fa icons instead of default ones
  switch(iconID) {
    case 1: case 2: case 3: matchedIconClass = 'fa-sun';
      break;
    case 4: case 5: case 6: matchedIconClass = 'fa-cloud-sun'; 
      break;
    case 7: case 8: matchedIconClass = 'fa-cloud';
      break;
    case 11: matchedIconClass = 'fa-smog';
      break;
    case 12: case 18: matchedIconClass = 'fa-cloud-showers-heavy'; 
      break;
    case 13: case 14: case 16: case 17: matchedIconClass = 'fa-cloud-sun-rain';
      break;
    case 15: case 41: case 42: matchedIconClass = 'fa-bolt';
      break;
    case 19: case 20: case 21: case 22: 
    case 23: case 25: case 26: case 29:
    case 43: case 44: matchedIconClass = 'fa-snowflake';
      break;
    case 24: matchedIconClass = 'fa-icicles';
      break;
    case 30: matchedIconClass = 'fa-thermometer-three-quarters';
      break;
    case 31: matchedIconClass = 'fa-thermometer-quarter';
      break;
    case 32: matchedIconClass = 'fa-wind';
      break;
    case 33: case 34: matchedIconClass = 'fa-moon';
      break;
    case 35: case 36: case 37: case 38: matchedIconClass = 'fa-cloud-moon';
      break;
    case 39: case 40: matchedIconClass = 'fa-cloud-moon-rain';
      break;
    default: matchedIconClass = 'fa-cloud';
  }

  icon.classList.add(matchedIconClass);

  return icon;
}

export const getBrowserLang = () => {
  return navigator.language || navigator.browserLanguage || 'en-GB';
}

export const trimLongString = string => string.length > 15 ? `${string.substring(0, 15)}...` : string;
