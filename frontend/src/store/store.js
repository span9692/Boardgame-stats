import { configureStore } from '@reduxjs/toolkit'
import gameReducer from './gameSlice'
import playerReducer from './playerSlice'

export const store = configureStore({
  reducer: {
    games: gameReducer,
    players: playerReducer
  }
})
