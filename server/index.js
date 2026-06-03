const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Board Games API' })
})

app.get('/games', (req, res) => {
  res.json({ message: 'games will go here' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})