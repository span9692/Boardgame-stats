import { useSelector } from 'react-redux'
import GameIcon from '../GameIcon.jsx'
import PlayerAvatar from '../PlayerAvatar.jsx'
import { getGameTypeMeta } from '../../utils/gameTheme.js'
import './SessionDetailModal.css'

const RANK_MEDALS = ['🥇', '🥈', '🥉']

function SessionDetailModal({ session }) {
    const gameList = useSelector(state => state.games)

    const typeMeta = getGameTypeMeta(session.game.gameType)
    const gameData = gameList.find(g => g.id === session.gameId)
    const isCooperative = session.game.gameType === 'COOPERATIVE'

    const rankedPlayers = (() => {
        if (isCooperative) {
            return session.players.map(p => ({ ...p, rank: null }))
        }
        if (session.players.some(p => p.placement != null)) {
            return [...session.players]
                .sort((a, b) => a.placement - b.placement)
                .map(p => ({ ...p, rank: p.placement }))
        }
        if (session.players.some(p => p.score != null)) {
            return [...session.players]
                .sort((a, b) => b.score - a.score)
                .map((p, i) => ({ ...p, rank: i + 1 }))
        }
        return session.players.map(p => ({ ...p, rank: null }))
    })()

    return (
        <div className="session-detail-modal-container">
            <div className="session-detail-header">
                <GameIcon title={session.game.title} iconUrl={gameData?.iconUrl} size="lg" />
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
                    {rankedPlayers.map(p => {
                        const roleName = gameData?.roles?.find(r => r.id === p.roleId)?.name
                        return (
                            <div key={p.id} className={`player-row ${p.winner ? 'winner' : ''}`}>
                                <PlayerAvatar
                                    username={p.player.username}
                                    label={p.rank && p.rank <= 3 ? RANK_MEDALS[p.rank - 1] : p.rank}
                                    bare={p.rank && p.rank <= 3}
                                    size="md"
                                />
                                <span className="player-name">{p.player.username}</span>
                                {roleName && <span className="type-badge role-badge">{roleName}</span>}
                                {!isCooperative && p.score != null && (
                                    <span className={`player-stat ${p.winner ? 'winner-stat' : ''}`}>
                                        {p.winner && '🏆 '}Score: {p.score}
                                    </span>
                                )}
                                {!isCooperative && p.placement != null && (
                                    <span className={`player-stat ${p.winner ? 'winner-stat' : ''}`}>
                                        {p.winner && '🏆 '}Place: {p.placement}
                                    </span>
                                )}
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
