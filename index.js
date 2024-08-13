const express = require('express')
const morgan = require('morgan')
const app = express()

//app.use(express.static('dist'))

app.use(express.json())

morgan.token('body', (req) => {
  if(req.method === "POST")
    return JSON.stringify(req.body)
  return "No body to display"
})
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))


let persons = [
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

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(person => person.id === id)
    
  if(person){
    res.json(person)
  } 
  else {
    res.status(404).end()
  }

})

app.post('/api/persons', (req, res) => {
  const person = req.body
  const name = person.name

  if(!person.name || !person.number) {
    return res.status(400).json({error: 'name or number missing'})
  }
  if(persons.find(person => person.name === name)) {
    return res.status(400).json({error: 'name already in phonebook'})
  }

  person.id = String(Math.floor(Math.random()*100000))
  persons = persons.concat(person)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.get('/info', (req, res) => {
    const numPersons = persons.length
    const timeOfReq = new Date().toUTCString()

    const response = `<p>Phonebook has info for ${numPersons} people</p><p>${timeOfReq}</p>`
    res.send(response)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})