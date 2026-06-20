require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')

const app = express()
const prisma = new PrismaClient()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Board Games API' })
})

app.get('/api/games', async (req, res) => {
  try {
    const games = await prisma.game.findMany({ include: { roles: true } })
    res.json(games)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games' })
  }
})

app.post('/api/games', async (req, res) => {
  const { title, gameType, roles } = req.body
  try {
    const game = await prisma.game.create({
      data: {
        title,
        gameType,
        ...(roles?.length && {
          roles: { create: roles.map(name => ({ name })) }
        })
      },
      include: { roles: true }
    })
    res.json(game)
  } catch (error) {
    res.status(400).json({ error: 'Failed to create game' })
  }
})

app.delete('/api/games/:title', async (req, res) => {
  const { title } = req.params
  try {
    const game = await prisma.game.delete({
      where: { title }
    })
    res.json(game)
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete game' })
  }
})

app.get('/api/players', async (req, res) => {
  try {
    const players = await prisma.player.findMany({
      where: { deletedAt: null }
    })
    res.json(players)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch players' })
  }
})

app.post('/api/players', async (req, res) => {
  const { firstName, lastName, username } = req.body
  try {
    const player = await prisma.player.create({
      data: {
        firstName,
        lastName,
        username,
        passwordHash: ''
      }
    })
    res.json(player)
  } catch (error) {
    res.status(400).json({ error: 'Failed to create player' })
  }
})

app.put('/api/players/:id', async (req, res) => {
  const { id } = req.params
  const { firstName, lastName, username } = req.body
  try {
    const player = await prisma.player.update({
      where: { id: parseInt(id) },
      data: { firstName, lastName, username }
    })
    res.json(player)
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Username already taken' })
    }
    res.status(400).json({ error: 'Failed to update player' })
  }
})

app.delete('/api/players/:id', async (req, res) => {
  const { id } = req.params
  try {
    const player = await prisma.player.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() }
    })
    res.json(player)
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete player' })
  }
})

app.post('/api/sessions', async (req, res) => {
  const { gameId, outcome, players } = req.body
  try {
    const game = await prisma.game.findUnique({ where: { id: gameId } })
    const isCooperative = game.gameType === 'COOPERATIVE'

    const session = await prisma.gameSession.create({
      data: {
        gameId,
        outcome: outcome || null,
        players: {
          create: players.map(p => ({
            playerId: p.playerId,
            roleId: p.roleId || null,
            score: p.score ?? null,
            placement: p.placement ?? null,
            winner: isCooperative ? outcome === 'WIN' : p.placement === 1,
          }))
        }
      }
    })
    res.json(session)
  } catch (error) {
    res.status(400).json({ error: 'Failed to create session' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})