
const { json } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
require('dotenv').config()
const cors = require('cors')
const Person = require('./models/person')
const PORT = process.env.PORT
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postdata'))

morgan.token('postdata', (req) => JSON.stringify({ name: req.body.name, number: req.body.number }));

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

app.get('/info', (req, res, next) => {
    Person.find({}).then(persons => {
        const date = new Date()
        res.send(
            `<p>Phonebook has info for ${persons.length} people.</p><p>${date}</p>`
        )
    })
    .catch(error => next(error)) 
})

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons.map(person => person.toJSON()))
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {

    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(upodatedPerson => {
            response.json(upodatedPerson)
        })
        .catch(error => next(error))
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

    // const id = Math.floor(Math.random() * 1000000)

    const person = new Person({
        name: body.name,
        number: body.number
        // id: id
    })

    console.log(person)

    // write to db

    person.save().then(savedPerson => {
        console.log('person saved!')
        res.json(savedPerson.toJSON())
        // mongoose.connection.close()
    })

    // persons = persons.concat(person)
    // res.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

// const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})