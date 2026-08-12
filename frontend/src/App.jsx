import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { gamesApi, playersApi } from './api'
import { setGames } from './store/gameSlice'
import { getPlayers } from './store/playerSlice'
import './App.css'
import PlayersPage from './components/Players/PlayersPage.jsx'
import GamesPage from './components/Games/GamesPage.jsx'
import SessionsPage from './components/Sessions/SessionsPage.jsx'

function App() {
    const dispatch = useDispatch()
    const [pageType, setPageType] = useState('SESSIONS')

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

    return (
        <div className="home-main-container">
            <div className="home-title">
                Hall of Gamers
            </div>
            <div className="home-subtitle">
                Track scores, sessions, and bragging rights across your game nights 🎲
            </div>
            <div className="navigation-button-container">
                <button className={`navigation-button ${pageType === 'SESSIONS' ? 'active' : ''}`} onClick={() => setPageType('SESSIONS')}>
                    Sessions
                </button>
                <button className={`navigation-button ${pageType === 'GAMES' ? 'active' : ''}`} onClick={() => setPageType('GAMES')}>
                    Games
                </button>
                <button className={`navigation-button ${pageType === 'PLAYERS' ? 'active' : ''}`} onClick={() => setPageType('PLAYERS')}>
                    Players
                </button>
            </div>

            {pageType === 'SESSIONS' && (
                <SessionsPage />
            )}

            {pageType === 'GAMES' && (
                <GamesPage />
            )}

            {pageType === 'PLAYERS' && (
                <PlayersPage />
            )}
        </div>
    )
}

export default App
