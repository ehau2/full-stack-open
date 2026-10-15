import { useState, useEffect } from 'react'
import weatherService from '../services/weather'

const Weather = ({ capital }) => {

    const [weather, setWeather] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        setWeather(null)
        setError(null)
        weatherService
            .getWeather(capital)
            .then(data => setWeather(data))
            .catch(error => {
                console.error(error)
                setError('Failed to fetch weather data')
            })
    }, [capital])

    if (error) {
        return <p>{error}</p>
    }

    if (!weather) {
        return <p>Loading weather...</p>
    }

    const iconUrl =
        `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

    return (
        <div>
            <h3>Weather in {capital}</h3>
            <p>Temperature: {weather.main.temp} °C</p>
            <img src={iconUrl} alt={weather.weather[0].description} />
            <p>Wind: {weather.wind.speed} m/s</p>
        </div>
    )
}

export default Weather