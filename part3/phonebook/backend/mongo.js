const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

if (!password) {
    console.log('give password as argument')
    process.exit(1)
}

// Connect to the MongoDB database using the provided password
const url = `mongodb+srv://eha261:${password}@full-stack-open.lww2vfl.mongodb.net/`
mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

// Define the schema and model for contacts
const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Contact = mongoose.model('Contact', contactSchema)

// Check if name and number were provided as command-line arguments
if (name && number) {
    // Define a new contact and save it to the database
    const contact = new Contact({
        name: name,
        number: number,
    })
    contact.save().then(result => {
        console.log(`Added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}
else {
    // Otherwise, retrieve and display all contacts from the database
    Contact.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
        })
        mongoose.connection.close()
    })
}