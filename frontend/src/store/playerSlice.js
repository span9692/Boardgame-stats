import { createSlice } from '@reduxjs/toolkit'

const playerSlice = createSlice({
  name: 'players',
  initialState: [],
  reducers: {
    getPlayers: (state, action) => action.payload,
    addPlayer: (state, action) => {
      state.push(action.payload)
    },
    updatePlayer: (state, action) => {
      const index = state.findIndex(player => player.id === action.payload.id)
      if (index !== -1) {
        state[index] = action.payload
      }
    },
    removePlayer: (state, action) => {
      return state.filter(player => player.id !== action.payload.id)
    }
  }
})

export const { getPlayers, addPlayer, removePlayer, updatePlayer } = playerSlice.actions
export default playerSlice.reducer
