const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
    console.log('one or three arguments required: [password] OR [password] [name] [number]')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =`mongodb+srv://fullstack:${password}@cluster0.ifqxb.mongodb.net/<dbname>?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {

    //read everything in db

    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })

} else {

    const person = new Person({
        name: name,
        number: number
    })

    // write to db

    person.save().then(response => {
        console.log('person saved!')
        mongoose.connection.close()
    })

}