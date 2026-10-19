import personService from '../services/persons'

const PersonForm = ({ newName, setNewName, newNumber, setNewNumber, persons, setPersons, setNotification }) => {

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const existingPerson = persons.find(person => person.name === newName)
        if (existingPerson) {
            replaceNumber(existingPerson)
        }
        else {
            addPerson()
        }
    }

    const replaceNumber = (existingPerson) => {
        const confirmReplace = window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)
        if (confirmReplace) {
            const updatedPerson = { ...existingPerson, number: newNumber }
            personService
                .update(existingPerson.id, updatedPerson)
                .then(returnedPerson => {
                    setPersons(persons.map(person =>
                        person.id !== existingPerson.id ? person : returnedPerson
                    ))
                    setNewName('')
                    setNewNumber('')
                    setNotification({ message: `Updated number for ${existingPerson.name}`, type: 'success' })
                })
                .catch(error => {
                    setNotification({ message: `Failed to update number for ${existingPerson.name}: ${error.response?.data?.error || error.message}`, type: 'error' })
                })
        }
    }

    const addPerson = () => {
        const newPerson = { name: newName, number: newNumber }
        personService
            .create(newPerson)
            .then(returnedPerson => {
                setPersons(persons.concat(returnedPerson))
                setNewName('')
                setNewNumber('')
                setNotification({ message: `Added ${newName}`, type: 'success' })
            })
            .catch(error => {
                setNotification({ message: `Failed to add ${newName}: ${error.response?.data?.error || error.message}`, type: 'error' })
            })
    }

    return (
        <div>
            <h2>Add a new person</h2>
            <form onSubmit={handleSubmit}>
                <label>Name: </label>
                <input
                    value={newName}
                    onChange={handleNameChange} />
                <label>Number: </label>
                <input
                    value={newNumber}
                    onChange={handleNumberChange} />
                <button type="submit">Add</button>
            </form>
        </div>
    )
}

export default PersonForm