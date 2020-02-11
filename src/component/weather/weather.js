import React, {Component} from 'react';
import './weather.css';
import OpenWeather from './../../service/OpenWeather';

class Weather extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      suggestion: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({city: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    OpenWeather.getForecastByCity(this.state.city).then(response => {
      console.log('response: ', response);
      if (response.cod === '200') {
        this.suggestProduct(response.list);
      } else {
        this.handleError(response.message);
      }
    });
  }

  handleError(message) {
    if (message) {
      const suggestionEL = `<div class="alert">
          <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
            ${message}
          </div>`;
      this.setState({suggestion: suggestionEL});
    }
  }

  suggestProduct(forecast) {
    let suggestionEl = '';
    if (forecast) {
      let weatherCondition = [];
      forecast.map(data => {
        data.weather.map(state => {
          weatherCondition.push(state.main);
        });
      });
      const sameWeather = weatherCondition.every(
          value => value === weatherCondition[0]);
      console.log('sameWeather: ', sameWeather);
      for (let i = 0; i < forecast.length; i++) {
        const weatherMain = forecast[i].weather[0].main;
        console.log('weather: ', weatherMain);
        if (sameWeather) {
          if (i === 0) {
            suggestionEl += `<ul><li><b>${weatherMain}</b></li><li>${forecast[i].dt_txt}</li><li><b>Sell jacket/umbrella.</b></li></ul>`;
          }
        } else {
          if (weatherMain.toLowerCase() === 'Rain'.toLowerCase()) {
            suggestionEl += `<ul class="umbrella"><li><b>${weatherMain}</b></li><li>${forecast[i].dt_txt}</li><li><b>Best day to sell an umbrella</b></li></ul>`;
          } else {
            suggestionEl += `<ul class="jacket"><li><b>${weatherMain}</b></li><li>${forecast[i].dt_txt}</li><li><b>Best day to sell a jacket</b></li></ul>`;
          }
        }
      }
      this.setState({suggestion: suggestionEl});
    }
  }

  render() {
    return (
        <div className="container">
          <h2 className="text-center">Suggest product by the weather condition of a city</h2>
          <form onSubmit={this.handleSubmit}>
            <label>
              City:
              <input type="text" value={this.state.city}
                     placeholder="Please type the name of a city"
                     onChange={this.handleChange}/>
            </label>
            <input type="submit" value="Submit"/>
          </form>
          <hr/>
          <div>
            <h4>Result:</h4>
            {<div dangerouslySetInnerHTML={{__html: this.state.suggestion}}/>}
          </div>
        </div>
    );
  }

}

export default Weather;