import { useState, useEffect } from 'react'
import Modal from '../Modal.jsx'
import AddSessionModal from './AddSessionModal.jsx'
import SessionDetailModal from './SessionDetailModal.jsx'
import { sessionsApi } from '../../api.js'
import { getGameTheme } from '../../utils/gameTheme.js'
import './SessionsPage.css'

function SessionsPage() {
    const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false)
    const [selectedSession, setSelectedSession] = useState(null)
    const [sessions, setSessions] = useState([])
    const [refreshKey, setRefreshKey] = useState(0)

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
                    {sessions.map(session => {
                        const theme = getGameTheme(session.game.title)
                        const result = getResult(session)
                        return (
                            <tr key={session.id} onClick={() => setSelectedSession(session)}>
                                <td>
                                    <span className="game-icon game-icon-sm" style={{ background: theme.soft, color: theme.color }}>{theme.icon}</span>
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

            <Modal isOpen={isAddSessionModalOpen} onClose={() => setIsAddSessionModalOpen(false)} title="Add Session" children={<AddSessionModal closeModal={closeAddSessionModal} />} />
            <Modal isOpen={!!selectedSession} onClose={() => setSelectedSession(null)} title="Session Details" children={selectedSession && <SessionDetailModal session={selectedSession} />} />
        </div>
    )
}

export default SessionsPage
