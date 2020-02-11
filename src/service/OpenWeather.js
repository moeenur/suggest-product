const ENDPOINT = 'https://api.openweathermap.org/data/2.5';

class OpenWeather {
  getForecastByCity = async (name) => {
    const query = `q=${name}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`;
    const response = await fetch(ENDPOINT + '/forecast?' + query);
    return await response.json();
  };
}

export default new OpenWeather();