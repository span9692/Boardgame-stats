import { createSlice } from '@reduxjs/toolkit'

const gameSlice = createSlice({
  name: 'games',
  initialState: [],
  reducers: {
    setGames: (state, action) => action.payload,
    addGame: (state, action) => {
      state.push(action.payload)
    },
    removeGame: (state, action) => {
      return state.filter(game => game.id !== action.payload)
    }
  }
})

export const { setGames, addGame, removeGame } = gameSlice.actions
export default gameSlice.reducer
