class OpenWeather {
  constructor() {
    this.API = 'https://api.openweathermap.org/data/2.5';
  }

  async getForecastByCity(name) {
    const query = `q=${name}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`;
    const response = await fetch(this.API + '/forecast?' + query);
    return await response.json();
  }
}

export default new OpenWeather();