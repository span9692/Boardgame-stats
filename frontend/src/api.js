const BASE_URL = 'http://localhost:3000/api'

export const gamesApi = {
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/games`)
    return response.json()
  },

  add: async (title, gameType) => {
    const response = await fetch(`${BASE_URL}/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, gameType })
    })
    return response.json()
  },

  remove: async (title) => {
    const response = await fetch(`${BASE_URL}/games/${title}`, {
      method: 'DELETE'
    })
    return response.json()
  }
}

export const playersApi = {
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/players`)
    return response.json()
  },

  add: async (player) => {
    const response = await fetch(`${BASE_URL}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(player)
    })
    return response.json()
  }
}

export const sessionsApi = {
  getRecent: async () => {
    const response = await fetch(`${BASE_URL}/sessions`)
    return response.json()
  },

  add: async (session) => {
    const response = await fetch(`${BASE_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    })
    return response.json()
  }
}