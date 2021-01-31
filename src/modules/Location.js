const getUserLocation = (onSuccess, onError) => {
  if("geolocation" in navigator) {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options)
  } else {
    // new Modal("")
  }
}

const getLocationData = async (lat, long) => {
  const locationData = await axios.get("https://api.timezonedb.com/v2.1/get-time-zone", {
    params: {
      key: "GOKI27KTZ8KL",
      format: "json",
      by: "position",
      lat: lat,
      lng: long
    }
  });

  return locationData.data;
}


const getCityKey = async city => {
  const cityData = await axios.get("http://dataservice.accuweather.com/locations/v1/cities/search", {
    params: {
      apikey: "H51SHkvJDM21y24lqnOTIGLcST6HwYSy",
      q: city
    }
  });
  
  
  return cityData.data[0].Key;
}

const formatDate = date => {
  const dateObj = new Date(date);

    return {
      time: `${dateObj.toLocaleTimeString("en-GB", {hour: "2-digit", minute: "2-digit"})}`,
      weekDay: `${dateObj.toLocaleString("en-GB", {weekday: "long"})}`,
      date: `${dateObj.toLocaleDateString("en-GB", {
        day: "numeric", 
        month: "short", 
        year: "2-digit"
      })}`.replace(/(\d+)(?!.*\d)/, "'$1") // insert an apostrophe before the year (2020 => "20)
    }
}


export { getUserLocation, getLocationData, getCityKey, formatDate }