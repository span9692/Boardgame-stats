require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')
const { XMLParser } = require('fast-xml-parser')

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000
const xmlParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })

app.use(cors())
app.use(express.json())

async function findBggIcon(title) {
  if (!process.env.BGG_API_TOKEN) return null

  const bggHeaders = { Authorization: `Bearer ${process.env.BGG_API_TOKEN}` }

  const searchResponse = await fetch(`https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(title)}&type=boardgame`, { headers: bggHeaders })
  const searchXml = xmlParser.parse(await searchResponse.text())
  const rawItems = searchXml.items?.item
  const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : []
  if (items.length === 0) return null

  const match = items.find(item => item.name?.['@_value']?.toLowerCase() === title.toLowerCase()) || items[0]
  const id = match['@_id']

  const thingResponse = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${id}`, { headers: bggHeaders })
  const thingXml = xmlParser.parse(await thingResponse.text())
  const rawThingItems = thingXml.items?.item
  const thingItem = Array.isArray(rawThingItems) ? rawThingItems[0] : rawThingItems
  return thingItem?.image || null
}

async function searchBggTitles(query) {
  if (!process.env.BGG_API_TOKEN) return []

  const bggHeaders = { Authorization: `Bearer ${process.env.BGG_API_TOKEN}` }
  const response = await fetch(`https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(query)}&type=boardgame`, { headers: bggHeaders })
  const xml = xmlParser.parse(await response.text())
  const rawItems = xml.items?.item
  const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : []

  return items
    .map(item => ({
      id: item['@_id'],
      name: item.name?.['@_value'],
      year: item.yearpublished?.['@_value'] ?? null
    }))
    .filter(item => item.name)
    .slice(0, 8)
}

async function resolveGameIcon(game) {
  if (game.iconCheckedAt) {
    return game.iconUrl
  }

  let iconUrl = null
  try {
    iconUrl = await findBggIcon(game.title)
  } catch (error) {
    iconUrl = null
  }

  await prisma.game.update({
    where: { id: game.id },
    data: { iconUrl, iconCheckedAt: new Date() }
  })

  return iconUrl
}

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Board Games API' })
})

app.get('/api/bgg/search', async (req, res) => {
  const query = (req.query.query || '').trim()
  if (query.length < 2) {
    return res.json([])
  }
  try {
    const results = await searchBggTitles(query)
    res.json(results)
  } catch (error) {
    res.json([])
  }
})

app.get('/api/games', async (req, res) => {
  try {
    const games = await prisma.game.findMany({ include: { roles: true } })
    const gamesWithIcons = await Promise.all(
      games.map(async game => ({ ...game, iconUrl: await resolveGameIcon(game) }))
    )
    res.json(gamesWithIcons)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games' })
  }
})

app.post('/api/games', async (req, res) => {
  const { title, gameType, roles, notes } = req.body
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
    res.json({ ...game, iconUrl: await resolveGameIcon(game) })
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

app.get('/api/games/:id/stats', async (req, res) => {
  const { id } = req.params
  try {
    const gameId = parseInt(id)
    const sessionsPlayed = await prisma.gameSession.count({ where: { gameId } })

    const gamePlayers = await prisma.gamePlayer.findMany({
      where: { session: { gameId } },
      include: { player: { select: { id: true, firstName: true, lastName: true, username: true } } }
    })

    const byPlayerMap = new Map()
    for (const gp of gamePlayers) {
      const p = gp.player
      if (!byPlayerMap.has(p.id)) {
        byPlayerMap.set(p.id, {
          playerId: p.id,
          firstName: p.firstName,
          lastName: p.lastName,
          username: p.username,
          sessionsPlayed: 0
        })
      }
      byPlayerMap.get(p.id).sessionsPlayed += 1
    }

    const topPlayers = Array.from(byPlayerMap.values())
      .sort((a, b) => b.sessionsPlayed - a.sessionsPlayed)
      .slice(0, 3)

    res.json({ sessionsPlayed, topPlayers })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game stats' })
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

app.get('/api/players/:id/stats', async (req, res) => {
  const { id } = req.params
  try {
    const gamePlayers = await prisma.gamePlayer.findMany({
      where: { playerId: parseInt(id) },
      include: {
        session: {
          select: {
            game: { select: { id: true, title: true, gameType: true, iconUrl: true, iconCheckedAt: true } }
          }
        }
      }
    })

    const byGameMap = new Map()
    for (const gp of gamePlayers) {
      const game = gp.session.game
      if (!byGameMap.has(game.id)) {
        byGameMap.set(game.id, { game, sessionsPlayed: 0, wins: 0, losses: 0 })
      }
      const entry = byGameMap.get(game.id)
      entry.sessionsPlayed += 1
      if (gp.winner) entry.wins += 1
      else entry.losses += 1
    }

    const byGame = await Promise.all(
      Array.from(byGameMap.values()).map(async ({ game, sessionsPlayed, wins, losses }) => ({
        gameId: game.id,
        title: game.title,
        gameType: game.gameType,
        iconUrl: await resolveGameIcon(game),
        sessionsPlayed,
        wins,
        losses,
        winRate: sessionsPlayed > 0 ? wins / sessionsPlayed : 0
      }))
    )

    const overall = byGame.reduce(
      (acc, g) => ({
        sessionsPlayed: acc.sessionsPlayed + g.sessionsPlayed,
        wins: acc.wins + g.wins,
        losses: acc.losses + g.losses
      }),
      { sessionsPlayed: 0, wins: 0, losses: 0 }
    )
    overall.winRate = overall.sessionsPlayed > 0 ? overall.wins / overall.sessionsPlayed : 0

    res.json({ overall, byGame })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch player stats' })
  }
})

app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await prisma.gameSession.findMany({
      orderBy: { playedAt: 'desc' },
      include: {
        game: { select: { title: true, gameType: true } },
        players: {
          include: {
            player: { select: { username: true } }
          }
        }
      }
    })
    res.json(sessions)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' })
  }
})

app.post('/api/sessions', async (req, res) => {
  const { gameId, outcome, players, notes } = req.body
  try {
    const game = await prisma.game.findUnique({ where: { id: gameId } })
    const isCooperative = game.gameType === 'COOPERATIVE'

    const hasPlacement = players.some(p => p.placement != null)
    const maxScore = !hasPlacement ? Math.max(...players.map(p => p.score ?? -Infinity)) : null

    const session = await prisma.gameSession.create({
      data: {
        gameId,
        outcome: outcome || null,
        notes: notes || null,
        players: {
          create: players.map(p => ({
            playerId: p.playerId,
            roleId: p.roleId || null,
            score: p.score ?? null,
            placement: p.placement ?? null,
            winner: isCooperative
              ? outcome === 'WIN'
              : hasPlacement
                ? p.placement === 1
                : p.score === maxScore,
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