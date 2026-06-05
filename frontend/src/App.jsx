import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { gamesApi } from './api'
import './App.css'

function App() {
  const addGame = async () => {
    try {
      const data = await gamesApi.add('Monopoly', 'COMPETITIVE')
      console.log(data)
    } catch (error) {
      console.error('Error adding game:', error)
    }
  }

  return (
    <div id="app">
      <button onClick={() => addGame()}>
        We playing board games!
      </button>
    </div>
  )
}

export default App
