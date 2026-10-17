const express = require('express')
const morgan = require('morgan')

const app = express()

// Middleware to parse JSON request bodies
app.use(express.json())

// Serve static files from the 'dist' directory
app.use(express.static('dist'))

// Middleware to log HTTP POST requests using morgan
morgan.token('postData', (req) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return ''
})
app.use(morgan('tiny :postData'))


const contacts = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000).toString()
}

// GET request to retrieve information about the phonebook
app.get('/info', (request, response) => {
    response.send(`<div><p>Phonebook has info for ${contacts.length} people</p><p>${new Date()}</p></div>`)
})

// GET request to retrieve all contacts
app.get('/api/contacts', (request, response) => {
    response.json(contacts)
})

// GET request to retrieve a contact by ID
app.get('/api/contacts/:id', (request, response) => {
    const id = request.params.id
    const contact = contacts.find(contact => contact.id === id)
    if (contact) {
        response.json(contact)
    }
    else {
        response.status(404).end()
    }
})

// DELETE request to remove a contact by ID
app.delete('/api/contacts/:id', (request, response) => {
    const id = request.params.id
    const contactIndex = contacts.findIndex(contact => contact.id === id)
    if (contactIndex !== -1) {
        contacts.splice(contactIndex, 1)
        return response.status(204).end()
    }
    response.status(404).end()
})

// POST request to add a new contact
app.post('/api/contacts', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }
    if (contacts.find(contact => contact.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const newContact = {
        id: generateRandomId(),
        name: body.name,
        number: body.number
    }
    contacts.push(newContact)
    response.json(newContact)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})