import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { gamesApi } from './api'
import './App.css'

function App() {
  const [gameList, setGameList] = useState([])

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await gamesApi.getAll()
        setGameList(data)
      } catch (error) {
        console.error('Error fetching games:', error)
      }
    }

    fetchGames()
  }, [])


  const addGame = async () => {
    try {
      const newGame = await gamesApi.add('Monopoly', 'COMPETITIVE')
      setGameList([...gameList, newGame])
    } catch (error) {
      console.error('Error adding game:', error)
    }
  }

  const removeGame = async () => {
    try {
      const data = await gamesApi.remove('Monopoly')
      setGameList(gameList.filter(game => game.id !== data.id))
    } catch (error) {
      console.error('Error removing game:', error)
    }
  }

  return (
    <div id="app">
      <button onClick={() => addGame()}>
        Add Monopoly!
      </button>
      <button onClick={() => removeGame()}>
        Remove Monopoly!
      </button>
    </div>
  )
}

export default App
