require('dotenv').config()
const mongoose = require('mongoose')

// Connect to the MongoDB database
const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

// Define the schema and model for contacts
const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

// Custom JSON representation of the contact model
contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)