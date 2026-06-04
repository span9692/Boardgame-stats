import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  // call GET games endpoint
  const getGames = async () => {
    try {
      const response = await fetch('http://localhost:3000/games')
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error('Error fetching games:', error)
    }
  }

  return (
    <div id="app">
      <button onClick={() => getGames()}>
        We playing board games!
      </button>
    </div>
  )
}

export default App
