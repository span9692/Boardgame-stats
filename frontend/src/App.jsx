import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { gamesApi, playersApi } from './api'
import { setGames, addGame, removeGame } from './store/gameSlice'
import { getPlayers } from './store/playerSlice'
import './App.css'
import PlayersPage from './components/Players/PlayersPage.jsx'

function App() {
    const dispatch = useDispatch()
    const gameList = useSelector(state => state.games)
    const playerList = useSelector(state => state.players)
    const [pageType, setPageType] = useState('STATS')

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const data = await gamesApi.getAll()
                dispatch(setGames(data))
            } catch (error) {
                console.error('Error fetching games:', error)
            }
        }

        const fetchPlayers = async () => {
            try {
                const data = await playersApi.getAll()
                dispatch(getPlayers(data))
            } catch (error) {
                console.error('Error fetching players:', error)
            }
        }

        fetchPlayers()
        fetchGames()
    }, [dispatch])

    const handleAddGame = async () => {
        try {
            const newGame = await gamesApi.add('Monopoly', 'COMPETITIVE')
            dispatch(addGame(newGame))
        } catch (error) {
            console.error('Error adding game:', error)
        }
    }

    const handleRemoveGame = async () => {
        try {
            const data = await gamesApi.remove('Monopoly')
            dispatch(removeGame(data.id))
        } catch (error) {
            console.error('Error removing game:', error)
        }
    }

    return (
        <div className="home-main-container">
            <div className="home-title">
                Hall of Gamers
            </div>
            <div className="navigation-button-container">
                <button className="navigation-button" onClick={() => setPageType('STATS')}>
                    Stats
                </button>
                <button className="navigation-button" onClick={() => setPageType('GAMES')}>
                    Games
                </button>
                <button className="navigation-button" onClick={() => setPageType('PLAYERS')}>
                    Players
                </button>
            </div>

            {pageType === 'STATS' && (
                <div className="stats-page-container">
                    <h2>Statistics</h2>
                    <p>Here are some cool stats!</p>
                </div>
            )}

            {pageType === 'GAMES' && (
                <div className="games-page-container">
                    <h2>Games</h2>
                    <p>Here are all the games!</p>
                </div>
            )}

            {pageType === 'PLAYERS' && (
                <PlayersPage />
            )}


            <br />
            <br />
            <br />
            <br />
            <br />
            <div>
                <button onClick={handleAddGame}>
                    Add Monopoly!
                </button>
                <button onClick={handleRemoveGame}>
                    Remove Monopoly!
                </button>
            </div>
            <br />
            All Games:
            {gameList.map(game => (
                <div key={game.id}>{game.title} ({game.gameType})</div>
            ))}
        </div>
    )
}

export default App
