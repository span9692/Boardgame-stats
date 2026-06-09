import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { gamesApi, playersApi } from './api'
import './App.css'

function App() {
  const [gameList, setGameList] = useState([])
  const [playerList, setPlayerList] = useState([])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')

  console.log('Game list:', gameList)
  console.log('Player list:', playerList)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await gamesApi.getAll()
        setGameList(data)
      } catch (error) {
        console.error('Error fetching games:', error)
      }
    }

    const fetchPlayers = async () => {
      try {
        const data = await playersApi.getAll()
        setPlayerList(data)
      } catch (error) {
        console.error('Error fetching players:', error)
      }
    }

    fetchPlayers()
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

  const addPlayer = async () => {
    try {
      const newPlayer = await playersApi.add(firstName, lastName, username)
      setPlayerList([...playerList, newPlayer])
    } catch (error) {
      console.error('Error adding player:', error)
    }
  }

  const removePlayer = async () => {
    try {
      const data = await playersApi.remove(playerList[0].id)
      setPlayerList(playerList.filter(player => player.id !== data.id))
    } catch (error) {
      console.error('Error removing player:', error)
    }
  }

  return (
    <div className="home-main-container">
      <div>
        <button onClick={() => addGame()}>
          Add Monopoly!
        </button>
        <button onClick={() => removeGame()}>
          Remove Monopoly!
        </button>
      </div>
      <div>
        <button onClick={() => addPlayer()}>
          Add player
        </button>
        <input
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <button onClick={() => removePlayer()}>
          Remove player
        </button>
      </div>
      <br />
      All Players:
      {playerList.map(player => (
        <div key={player.id}>{player.firstName} {player.lastName} ({player.username})</div>
      ))}
      <br />
      All Games:
      {gameList.map(game => (
        <div key={game.id}>{game.title} ({game.gameType})</div>
      ))}
    </div>
  )
}

export default App
