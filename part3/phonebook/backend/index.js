
require('dotenv').config()
const express = require('express')
const Contact = require('./models/contact')

const app = express()

// Middleware to parse JSON request bodies
app.use(express.json())

// Middleware to serve static files (frontend) from the 'dist' directory
app.use(express.static('dist'))

// Middleware to log incoming requests
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)

// Error handler middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({
            error: 'malformatted id'
        })
    }

    if (error.name === 'ValidationError') {
        return response.status(400).send({
            error: error.message
        })
    }

    next(error)
}

// GET request to retrieve information about the phonebook
app.get('/info', (request, response, next) => {
    Contact.find({})
        .then(contacts => {
            response.send(`
                <div>
                    <p>Phonebook has info for ${contacts.length} people</p>
                    <p>${new Date()}</p>
                </div>
            `)
        })
        .catch(error => next(error))
})

// GET request to retrieve all contacts
app.get('/api/contacts', (request, response, next) => {
    Contact.find({})
        .then(contacts => {
            response.json(contacts)
        })
        .catch(error => next(error))
})

// GET request to retrieve a contact by ID
app.get('/api/contacts/:id', (request, response, next) => {
    const id = request.params.id

    Contact.findById(id)
        .then(contact => {
            if (contact) {
                response.json(contact)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// DELETE request to remove a contact by ID
app.delete('/api/contacts/:id', (request, response, next) => {
    const id = request.params.id

    Contact.findByIdAndDelete(id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// PATCH request to update a contact's number by ID
app.patch('/api/contacts/:id', (request, response, next) => {
    const id = request.params.id
    const { number } = request.body

    Contact.findByIdAndUpdate(
        id,
        { number },
        {
            new: true,
            runValidators: true,
            context: 'query'
        }
    )
        .then(updatedContact => {
            if (updatedContact) {
                response.json(updatedContact)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// POST request to add a new contact
app.post('/api/contacts', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    const newContact = new Contact({
        name: body.name,
        number: body.number
    })

    newContact.save()
        .then(savedContact => {
            response.json(savedContact)
        })
        .catch(error => next(error))
})

// Handle unknown endpoints
const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    })
}

app.use(unknownEndpoint)

// Error handler must be registered after routes and unknownEndpoint
app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
