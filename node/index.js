const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
]

const generateId = () => {
  const id = notes.length > 0 ? Math.max(...notes.map(item => item.id)) : 0
  return id + 1
}

app.get('/', (req, res) => {
  res.send('home start')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(item => item.id === id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end('not found')
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(item => item.id === id)
  res.status(200).end('删除成功')
})

app.post('/api/notes', (req, res) => {
  const {content, important} = req.body || {}
  if (!content) {
    return res.status(404).json({
      error: 'miss content'
    })
  }
  const note = {
    id: generateId(),
    content,
    important: important || false,
    date: new Date().toISOString()
  }
  notes = notes.concat(note)
  res.json(notes)
})

app.put('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = req.body
  res.json(note)
})

const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})