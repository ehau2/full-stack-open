import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {

    const [persons, setPersons] = useState([])
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        personService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
            })
    }, [])

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [notification])

    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')

    return (
        <div>
            <h1>Phonebook</h1>
            {notification && (
                <Notification message={notification.message} type={notification.type} />
            )}
            <PersonForm
                newName={newName}
                setNewName={setNewName}
                newNumber={newNumber}
                setNewNumber={setNewNumber}
                persons={persons}
                setPersons={setPersons}
                setNotification={setNotification} />
            <Filter filter={filter} setFilter={setFilter} />
            <Persons persons={persons} setPersons={setPersons} setNotification={setNotification} filter={filter} />
        </div>
    )
}

export default App