import { getBrowserLang } from './utils';


/**
 * 
 */
export class LocationDate {
  constructor(lat, long) {
    this.lat = lat;
    this.lng = long;
  }


  async fetchDate() {
    const date = await axios.get('https://api.timezonedb.com/v2.1/get-time-zone', {
      params: {
        key: 'YOUR_API_KEY',
        format: 'json',
        by: 'position',
        lat: this.lat,
        lng: this.lng
      }
    });

    return date.data.formatted;
  }

  async getFormattedDate() {
    const dateObj = new Date(await this.fetchDate());

    return {
      time: `${dateObj.toLocaleTimeString(getBrowserLang(), {hour: '2-digit', minute: '2-digit'})}`,
      weekDay: `${dateObj.toLocaleString(getBrowserLang(), {weekday: 'long'})}`,
      date: `${dateObj.toLocaleDateString(getBrowserLang(), {
        day: 'numeric', 
        month: 'short', 
        year: '2-digit'
      })}`.replace(/(\d+)(?!.*\d)/, '\'$1') // insert an apostrophe before the year (2020 => '20)
    }
  }
}
