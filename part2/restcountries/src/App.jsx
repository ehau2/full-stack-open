import { useState, useEffect } from 'react'
import countriesService from './services/countries'
import Country from './components/Country'

function App() {

    const [countries, setCountries] = useState([])
    const [filteredCountries, setFilteredCountries] = useState([])
    const [search, setSearch] = useState('')
    const maxResults = 10

    useEffect(() => {
        countriesService
            .getCountries()
            .then(initialCountries => {
                setCountries(initialCountries)
                setFilteredCountries(initialCountries)
            })
    }, [])

    const handleChange = (event) => {
        setSearch(event.target.value)
        const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(event.target.value.toLowerCase()))
        setFilteredCountries(filteredCountries)
    }

    return (
        <div>
            <h1>Countries</h1>
            <form>
                <label>Find countries</label>
                <input placeholder="Search by name..." value={search} onChange={handleChange}></input>
            </form>
            <br></br>
            {filteredCountries.length > maxResults ? (
                <p>Too many matches, specify another filter</p>
            ) : (
                filteredCountries.map(country => (
                    <Country key={country.name.common} country={country} />
                ))
            )}
        </div>
    )
}

export default App
