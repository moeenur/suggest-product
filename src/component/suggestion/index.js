import React, {Component} from 'react';
import './index.css';
import OpenWeather from './../../service/OpenWeather';

class Suggestion extends Component {
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
    const suggestionEL = `<div class="alert alert-info"><b>Loading...</b></div>`;
    this.setState({suggestion: suggestionEL});
    OpenWeather.getForecastByCity(this.state.city).then(response => {
      if (response.cod === '200') {
        this.suggestProduct(response);
      } else {
        this.handleError(response.message);
      }
    });
  }

  handleError(message) {
    if (message) {
      const suggestionEL = `<div class="alert alert-error">
          <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
            ${message}
          </div>`;
      this.setState({suggestion: suggestionEL});
    }
  }

  isSameWeatherCondition(forecast) {
    let weatherMain = [];
    forecast.forEach(data => {
      data.weather.forEach(state => {
        weatherMain.push(state.main);
      });
    });
    return weatherMain.every(value => value === weatherMain[0]);
  }

  bindProductHTML(forecast) {
    let htmlString = '';
    const sameWeather = this.isSameWeatherCondition(forecast);
    for (let i = 0; i < forecast.length; i++) {
      const weatherMain = forecast[i].weather[0].main;
      if (sameWeather) {
        if (i === 0) {
          htmlString += `<ul><li><b>${weatherMain}</b></li><li>${forecast[i].dt_txt}</li><li><b>Sell jacket/umbrella.</b></li></ul>`;
        }
      } else {
        if (weatherMain.toLowerCase() === 'Rain'.toLowerCase()) {
          htmlString += `<ul class="umbrella"><li><b>${weatherMain}</b></li><li>${forecast[i].dt_txt}</li><li><b>Best day to sell an umbrella</b></li></ul>`;
        } else {
          htmlString += `<ul class="jacket"><li><b>${weatherMain}</b></li><li>${forecast[i].dt_txt}</li><li><b>Best day to sell a jacket</b></li></ul>`;
        }
      }
    }
    return htmlString;
  }

  suggestProduct(forecast) {
    let suggestionEl = '';
    if (forecast) {
      suggestionEl += `<h4><u>Product for:</u>  ${forecast.city.name}, ${forecast.city.country}</h4>`;
      suggestionEl += this.bindProductHTML(forecast.list);
      this.setState({suggestion: suggestionEl});
    }
  }

  render() {
    return (
        <div className="container">
          <h2 className="text-center"><u>Suggest product according to the
            weather condition of a city</u></h2>
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
          {<div dangerouslySetInnerHTML={{__html: this.state.suggestion}}/>}
        </div>
    );
  }

}

export default Suggestion;