const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log("connecting to ", url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    number: String
})

personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

// const Person = mongoose.model('Person', personSchema)

// if (process.argv.length === 3) {

//     //read everything in db

//     Person.find({}).then(result => {
//         result.forEach(person => {
//             console.log(person)
//         })
//         mongoose.connection.close()
//     })

// } else {

//     const person = new Person({
//         name: name,
//         number: number
//     })

//     // write to db

//     person.save().then(response => {
//         console.log('person saved!')
//         mongoose.connection.close()
//     })

// }

module.exports = mongoose.model('Person', personSchema)