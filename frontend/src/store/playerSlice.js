import { createSlice } from '@reduxjs/toolkit'

const playerSlice = createSlice({
  name: 'players',
  initialState: [],
  reducers: {
    getPlayers: (state, action) => action.payload,
    addPlayer: (state, action) => {
      state.push(action.payload)
    },
    removePlayer: (state, action) => {
      return state.filter(player => player.id !== action.payload)
    }
  }
})

export const { getPlayers, addPlayer, removePlayer } = playerSlice.actions
export default playerSlice.reducer
