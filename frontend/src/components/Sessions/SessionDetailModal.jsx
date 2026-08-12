import { useSelector } from 'react-redux'
import { getGameTheme, getGameTypeMeta } from '../../utils/gameTheme.js'
import './SessionDetailModal.css'

function SessionDetailModal({ session }) {
    const gameList = useSelector(state => state.games)

    const theme = getGameTheme(session.game.title)
    const typeMeta = getGameTypeMeta(session.game.gameType)
    const gameData = gameList.find(g => g.id === session.gameId)
    const isCooperative = session.game.gameType === 'COOPERATIVE'

    return (
        <div className="session-detail-modal-container">
            <div className="session-detail-header">
                <span className="game-icon" style={{ background: theme.soft, color: theme.color }}>{theme.icon}</span>
                <div>
                    <div className="session-detail-title">{session.game.title}</div>
                    <div className="session-detail-date">
                        {new Date(session.playedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
                <span className="type-badge" style={{ background: typeMeta.soft, color: typeMeta.color }}>{typeMeta.label}</span>
            </div>

            {isCooperative && (
                <div className={`outcome-banner ${session.outcome === 'WIN' ? 'win' : session.outcome === 'LOSS' ? 'loss' : ''}`}>
                    {session.outcome === 'WIN' && '🏆 The team won!'}
                    {session.outcome === 'LOSS' && '💀 The team lost'}
                    {!session.outcome && 'No outcome recorded'}
                </div>
            )}

            <div className="session-detail-section">
                <div className="session-detail-label">Players</div>
                <div className="session-detail-players">
                    {session.players.map(p => {
                        const roleName = gameData?.roles?.find(r => r.id === p.roleId)?.name
                        return (
                            <div key={p.id} className={`player-row ${p.winner ? 'winner' : ''}`}>
                                <span className="player-avatar">{p.player.username.charAt(0).toUpperCase()}</span>
                                <span className="player-name">{p.player.username}</span>
                                {roleName && <span className="type-badge role-badge">{roleName}</span>}
                                {!isCooperative && p.score != null && <span className="player-stat">Score: {p.score}</span>}
                                {!isCooperative && p.placement != null && <span className="player-stat">Place: {p.placement}</span>}
                                {p.winner && <span className="winner-tag">🏆 Winner</span>}
                            </div>
                        )
                    })}
                </div>
            </div>

            {session.notes && (
                <div className="session-detail-section">
                    <div className="session-detail-label">Notes</div>
                    <div className="session-detail-notes">{session.notes}</div>
                </div>
            )}
        </div>
    )
}

export default SessionDetailModal
