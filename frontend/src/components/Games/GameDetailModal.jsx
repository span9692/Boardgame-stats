import { useEffect, useState } from 'react'
import GameIcon from '../GameIcon.jsx'
import PlayerAvatar from '../PlayerAvatar.jsx'
import { getGameTypeMeta } from '../../utils/gameTheme.js'
import { gamesApi } from '../../api.js'
import './GameDetailModal.css'

const RANK_MEDALS = ['🥇', '🥈', '🥉']

function GameDetailModal({ game }) {
    const [stats, setStats] = useState(null)
    const typeMeta = getGameTypeMeta(game.gameType)

    useEffect(() => {
        const load = async () => {
            const data = await gamesApi.getStats(game.id)
            setStats(data)
        }
        load()
    }, [game.id])

    return (
        <div className="game-detail-modal-container">
            <div className="game-detail-header">
                <GameIcon title={game.title} iconUrl={game.iconUrl} size="xl" />
                <div className="game-detail-title">{game.title}</div>
                <span className="type-badge" style={{ background: typeMeta.soft, color: typeMeta.color }}>{typeMeta.label}</span>
            </div>

            {!stats && <div className="game-detail-loading">Loading stats...</div>}

            {stats && (
                <>
                    <div className="game-detail-stat-tile">
                        <div className="game-detail-stat-value">{stats.sessionsPlayed}</div>
                        <div className="game-detail-stat-label">Sessions Played</div>
                    </div>

                    <div className="game-detail-section">
                        <div className="game-detail-label">Top Players</div>
                        {stats.topPlayers.length === 0 && (
                            <div className="game-detail-empty">No sessions recorded yet.</div>
                        )}
                        <div className="game-top-player-list">
                            {stats.topPlayers.map((p, index) => (
                                <div key={p.playerId} className="list-item game-top-player-row">
                                    <span className="game-top-player-rank">{RANK_MEDALS[index]}</span>
                                    <PlayerAvatar username={p.username} size="md" />
                                    <div className="game-top-player-info">
                                        <div className="game-top-player-name">{p.firstName} {p.lastName}</div>
                                        <div className="game-top-player-username">@{p.username}</div>
                                    </div>
                                    <div className="game-top-player-count">{p.sessionsPlayed} sessions</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default GameDetailModal
