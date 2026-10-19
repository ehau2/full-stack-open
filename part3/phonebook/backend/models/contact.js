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
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(value) {
                return /^\d{2,3}-\d+$/.test(value)
            },
            message: props => `${props.value} is not a valid phone number`
        },
        required: true
    },
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