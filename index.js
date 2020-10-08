require('dotenv').config()
const { json } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')
const PORT = process.env.PORT
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postdata'))

morgan.token('postdata', (req) => JSON.stringify({name: req.body.name, number: req.body.number}));

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    },
]

app.get('/info', (req, res) => {

    const totalNotes = notes.length
    const date = new Date()

    res.send(
        `<p>Phonebook has info for ${totalNotes} people.</p><p>${date}</p>`
    )
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons.map(person => person.toJSON()))
    })
  })

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
  })

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {

    const body = req.body

    // Check if name or number is missing
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: !body.name ? 'name missing' : 'number missing'
        })
    }

    // // Check if person exists in db
    // const foundName = persons.find(p => p.name === body.name)
    // if (foundName) {
    //     return res.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    const id = Math.floor(Math.random() * 1000000)

    const person = new Person({
        name: body.name,
        number: body.number,
        id: id
    })

    console.log(person)

    // write to db

    person.save().then(response => {
        console.log('person saved!')
        mongoose.connection.close()
    })

    persons = persons.concat(person)

    res.json(person)
})

// const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})