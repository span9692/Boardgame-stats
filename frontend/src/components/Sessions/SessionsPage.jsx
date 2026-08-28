import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Modal from '../Modal.jsx'
import AddSessionModal from './AddSessionModal.jsx'
import SessionDetailModal from './SessionDetailModal.jsx'
import GameIcon from '../GameIcon.jsx'
import { sessionsApi } from '../../api.js'
import './SessionsPage.css'

function SessionsPage() {
    const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false)
    const [selectedSession, setSelectedSession] = useState(null)
    const [sessions, setSessions] = useState([])
    const [refreshKey, setRefreshKey] = useState(0)
    const [gameFilterId, setGameFilterId] = useState('')
    const [playerFilterId, setPlayerFilterId] = useState('')
    const [pageSize, setPageSize] = useState(20)
    const [currentPage, setCurrentPage] = useState(1)
    const gameList = useSelector(state => state.games)
    const playerList = useSelector(state => state.players)

    const filteredSessions = sessions.filter(session => {
        const matchesGame = !gameFilterId || session.gameId === parseInt(gameFilterId)
        const matchesPlayer = !playerFilterId || session.players.some(p => p.playerId === parseInt(playerFilterId))
        return matchesGame && matchesPlayer
    })

    const totalPages = Math.max(1, Math.ceil(filteredSessions.length / pageSize))

    const filterKey = `${gameFilterId}|${playerFilterId}|${pageSize}`
    const [prevFilterKey, setPrevFilterKey] = useState(filterKey)
    if (filterKey !== prevFilterKey) {
        setPrevFilterKey(filterKey)
        setCurrentPage(1)
    }

    const safePage = Math.min(currentPage, totalPages)
    const paginatedSessions = filteredSessions.slice((safePage - 1) * pageSize, safePage * pageSize)

    const maxVisiblePages = 3
    let pageWindowStart = Math.max(1, safePage - Math.floor(maxVisiblePages / 2))
    const pageWindowEnd = Math.min(totalPages, pageWindowStart + maxVisiblePages - 1)
    pageWindowStart = Math.max(1, pageWindowEnd - maxVisiblePages + 1)
    const pageNumbers = Array.from({ length: pageWindowEnd - pageWindowStart + 1 }, (_, i) => pageWindowStart + i)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await sessionsApi.getRecent()
                setSessions(data)
            } catch (error) {
                console.error('Error fetching sessions:', error)
            }
        }
        load()
    }, [refreshKey])

    const closeAddSessionModal = () => {
        setIsAddSessionModalOpen(false)
        setRefreshKey(k => k + 1)
    }

    const getResult = (session) => {
        if (session.game.gameType === 'COOPERATIVE') {
            if (!session.outcome) return '—'
            return session.outcome === 'WIN' ? 'Win' : 'Loss'
        }
        const winners = session.players.filter(p => p.winner).map(p => p.player.username)
        return winners.length > 0 ? winners.join(', ') : '—'
    }

    return (
        <div className="sessions-page-container">
            <div className="page-header">
                <h2>Sessions</h2>
                <button onClick={() => setIsAddSessionModalOpen(true)}>
                    Add session
                </button>
            </div>

            <div className="sessions-filters">
                <select value={gameFilterId} onChange={e => setGameFilterId(e.target.value)}>
                    <option value="">All games</option>
                    {gameList.map(game => (
                        <option key={game.id} value={game.id}>{game.title}</option>
                    ))}
                </select>
                <select value={playerFilterId} onChange={e => setPlayerFilterId(e.target.value)}>
                    <option value="">All players</option>
                    {playerList.map(player => (
                        <option key={player.id} value={player.id}>{player.username}</option>
                    ))}
                </select>
                <button
                    className="btn-secondary"
                    disabled={!gameFilterId && !playerFilterId}
                    onClick={() => { setGameFilterId(''); setPlayerFilterId('') }}
                >
                    Clear filters
                </button>
            </div>

            {filteredSessions.length === 0 && (
                <div className="sessions-empty">
                    {gameFilterId || playerFilterId ? 'No sessions match those filters.' : 'No sessions recorded yet.'}
                </div>
            )}

            {filteredSessions.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Game</th>
                            <th>Players</th>
                            <th>Result</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedSessions.map(session => {
                            const iconUrl = gameList.find(g => g.id === session.gameId)?.iconUrl
                            const result = getResult(session)
                            return (
                                <tr key={session.id} onClick={() => setSelectedSession(session)}>
                                    <td>
                                        <GameIcon title={session.game.title} iconUrl={iconUrl} size="sm" />
                                        {session.game.title}
                                    </td>
                                    <td>{session.players.map(p => p.player.username).join(', ')}</td>
                                    <td>{result !== '—' ? `🏆 ${result}` : '—'}</td>
                                    <td>{new Date(session.playedAt).toLocaleDateString()}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )}

            {filteredSessions.length > 0 && (
                <div className="sessions-pagination">
                    <div className="sessions-page-size">
                        Rows per page
                        <select value={pageSize} onChange={e => setPageSize(parseInt(e.target.value))}>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                    <div className="sessions-page-controls">
                        <button
                            className="btn-secondary"
                            disabled={safePage <= 1}
                            onClick={() => setCurrentPage(safePage - 1)}
                        >
                            Previous
                        </button>
                        <div className="sessions-page-numbers">
                            {pageNumbers.map(num => (
                                <button
                                    key={num}
                                    className={num === safePage ? 'sessions-page-number' : 'sessions-page-number btn-secondary'}
                                    onClick={() => setCurrentPage(num)}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        <button
                            className="btn-secondary"
                            disabled={safePage >= totalPages}
                            onClick={() => setCurrentPage(safePage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            <Modal isOpen={isAddSessionModalOpen} onClose={() => setIsAddSessionModalOpen(false)} title="Add Session" children={<AddSessionModal closeModal={closeAddSessionModal} />} />
            <Modal isOpen={!!selectedSession} onClose={() => setSelectedSession(null)} title="Session Details" children={selectedSession && <SessionDetailModal session={selectedSession} />} />
        </div>
    )
}

export default SessionsPage
