import { useEffect, useState } from 'react'
import GameIcon from '../GameIcon.jsx'
import PlayerAvatar from '../PlayerAvatar.jsx'
import { getGameTypeMeta } from '../../utils/gameTheme.js'
import { playersApi } from '../../api.js'
import './PlayerDetailModal.css'

function PlayerDetailModal({ player }) {
    const [stats, setStats] = useState(null)

    useEffect(() => {
        const load = async () => {
            const data = await playersApi.getStats(player.id)
            setStats(data)
        }
        load()
    }, [player.id])

    return (
        <div className="player-detail-modal-container">
            <div className="player-detail-header">
                <PlayerAvatar username={player.username} size="lg" />
                <div>
                    <div className="player-detail-name">{player.firstName} {player.lastName}</div>
                    <div className="player-detail-username">@{player.username}</div>
                </div>
            </div>

            {!stats && <div className="player-detail-loading">Loading stats...</div>}

            {stats && (
                <>
                    <div className="player-stat-grid">
                        <div className="player-stat-tile">
                            <div className="player-stat-value">{stats.overall.sessionsPlayed}</div>
                            <div className="player-stat-tile-label">Sessions</div>
                        </div>
                        <div className="player-stat-tile">
                            <div className="player-stat-value">{stats.overall.wins}</div>
                            <div className="player-stat-tile-label">Wins</div>
                        </div>
                        <div className="player-stat-tile">
                            <div className="player-stat-value">{stats.overall.losses}</div>
                            <div className="player-stat-tile-label">Losses</div>
                        </div>
                        <div className="player-stat-tile">
                            <div className="player-stat-value">{Math.round(stats.overall.winRate * 100)}%</div>
                            <div className="player-stat-tile-label">Win Rate</div>
                        </div>
                    </div>

                    <div className="player-detail-section">
                        <div className="player-detail-label">Games Played</div>
                        {stats.byGame.length === 0 && (
                            <div className="player-detail-empty">No sessions recorded yet.</div>
                        )}
                        <div className="player-game-list">
                            {stats.byGame.map(g => {
                                const typeMeta = getGameTypeMeta(g.gameType)
                                return (
                                    <div key={g.gameId} className="list-item player-game-row">
                                        <GameIcon title={g.title} iconUrl={g.iconUrl} size="md" />
                                        <div className="player-game-info">
                                            <div className="player-game-title">{g.title}</div>
                                            <span className="type-badge" style={{ background: typeMeta.soft, color: typeMeta.color }}>{typeMeta.label}</span>
                                        </div>
                                        <div className="player-game-record">
                                            <div className="player-game-record-main">{g.wins}W – {g.losses}L</div>
                                            <div className="player-game-record-sub">{Math.round(g.winRate * 100)}% win rate</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default PlayerDetailModal
