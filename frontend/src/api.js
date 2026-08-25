const BASE_URL = 'http://localhost:3000/api'

export const gamesApi = {
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/games`)
    return response.json()
  },

  add: async (title, gameType, roles) => {
    const response = await fetch(`${BASE_URL}/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title, 
        gameType, 
        roles: roles.map(r => r.name).filter(name => name.trim() !== '')})
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

  add: async (firstName, lastName, username) => {
    const response = await fetch(`${BASE_URL}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, username })
    })
    return response.json()
  },

  edit: async (id, firstName, lastName, username) => {
    const response = await fetch(`${BASE_URL}/players/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, username })
    })
    if (response.status === 200) {
      return response.json()
    } else {
      return { error: "username already exists" }
    }
  },

  remove: async (id) => {
    const response = await fetch(`${BASE_URL}/players/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  },

  getStats: async (id) => {
    const response = await fetch(`${BASE_URL}/players/${id}/stats`)
    return response.json()
  }
}

export const bggApi = {
  search: async (query) => {
    const response = await fetch(`${BASE_URL}/bgg/search?query=${encodeURIComponent(query)}`)
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