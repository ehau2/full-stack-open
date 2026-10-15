import { useState } from 'react'
import Weather from './Weather'

const Country = ({ country }) => {

    const [showDetails, setShowDetails] = useState(false)

    const handleClick = () => {
        setShowDetails(!showDetails)
    }

    return (
        <div>
            <div>
                <span>{country.name.common}</span>
                <button onClick={handleClick}>
                    {showDetails ? 'Hide' : 'Show'}
                </button>
            </div>

            {showDetails && (
                <div>
                    <h2>{country.name.common}</h2>
                    <p>Capital: {country.capital}</p>
                    <p>Area: {country.area}</p>

                    <h3>Languages:</h3>
                    <ul>
                        {Object.values(country.languages).map(language => (
                            <li key={language}>{language}</li>
                        ))}
                    </ul>

                    <img
                        src={country.flags.png}
                        alt={`Flag of ${country.name.common}`}
                    />

                    <Weather capital={country.capital[0]} />
                </div>
            )}
        </div>
    )
}

export default Country