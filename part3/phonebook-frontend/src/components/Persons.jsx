import personService from '../services/persons'

const Persons = ({ persons, setPersons, setNotification, filter }) => {

    const deletePerson = (id) => {
        if (window.confirm("Are you sure you want to delete this person?")) {
            personService
                .remove(id)
                .then(() => {
                    setPersons(persons.filter(person => person.id !== id));
                    setNotification({ message: `${persons.find(person => person.id === id)?.name} was deleted successfully`, type: 'success' });
                })
                .catch(error => {
                    setNotification({ message: `Failed to delete person: ${error.message}`, type: 'error' });
                })
        }
    }

    return (
        <div>
            <h2>Numbers</h2>
            <ul>
                {persons.map(person => (
                    person.name.toLowerCase().includes(filter.toLowerCase()) && (
                    <div key={person.id}>
                        <li>{person.name} {person.number}</li>
                        <button onClick={() => deletePerson(person.id)}>Delete</button>
                    </div>
                    )
                ))}
            </ul>
        </div>
    )
}

export default Persons