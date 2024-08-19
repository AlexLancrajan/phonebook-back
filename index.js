require('dotenv').config()

const express = require('express')

const morgan = require('morgan')

const app = express()

const Contact = require('./models/contact')

app.use(express.static('dist'))

app.use(express.json())

morgan.token('body', (req) => {
  if(req.method === 'POST')
    return JSON.stringify(req.body)
  return 'No body to display'
})
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))

app.get('/api/persons', (req, res, next) => {
  Contact.find({})
    .then(contacts => {
      res.json(contacts)
    })
    .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then(contact => {
      if (contact){
        res.json(contact)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const contact = new Contact({
    name: body.name,
    number: body.number
  })

  contact.save()
    .then(savedContact => {
      res.json(savedContact)
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id',(req, res, next) => {
  const body = req.body

  const contact = {
    name: body.name,
    number: body.number,
  }

  Contact.findByIdAndUpdate(req.params.id, contact, { new: true, runValidators: true })
    .then(updatedContact => {
      res.json(updatedContact)
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

app.get('/info', (req, res, next) => {
  const timeOfReq = new Date().toUTCString()

  Contact.countDocuments({})
    .then(count => {
      const response = `<p>Phonebook has info for ${count} people</p><p>${timeOfReq}</p>`
      res.send(response)
    })
    .catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {

  if(error.name === 'CastError') {
    return res.status(400).send({ error: 'maformatted id' })
  }
  if(error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})