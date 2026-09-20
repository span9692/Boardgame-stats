import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { gamesApi, playersApi } from './api'
import { setGames } from './store/gameSlice'
import { getPlayers } from './store/playerSlice'
import './App.css'
import PlayersPage from './components/Players/PlayersPage.jsx'
import GamesPage from './components/Games/GamesPage.jsx'
import SessionsPage from './components/Sessions/SessionsPage.jsx'

const LOADING_MESSAGES = [
    "Pulling up everyone's bragging rights can take up to 30 seconds.",
    'Dusting off the scorecards can take up to 30 seconds.',
    'Fetching your win streaks can take up to 30 seconds.'
]

function App() {
    const dispatch = useDispatch()
    const [pageType, setPageType] = useState('SESSIONS')
    const [isLoading, setIsLoading] = useState(true)
    const [loadingMessage] = useState(() => LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)])

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

        Promise.all([fetchPlayers(), fetchGames()]).finally(() => setIsLoading(false))
    }, [dispatch])

    return (
        <div className="home-main-container">
            <div className="home-title">
                Meeple Metrics
            </div>
            <div className="home-subtitle">
                Track scores, sessions, and bragging rights across your game nights 🎲
            </div>

            {isLoading ? (
                <div className="app-loading">
                    <div className="app-loading-dice">🎲</div>
                    <div className="app-loading-text">Rolling the dice...</div>
                    <div className="app-loading-subtext">{loadingMessage}</div>
                </div>
            ) : (
                <>
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
                </>
            )}
        </div>
    )
}

export default App
