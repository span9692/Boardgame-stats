import { useState } from 'react'
import { useSelector } from 'react-redux'
import { sessionsApi } from '../../api.js'
import './AddSessionModal.css'

function AddSessionModal({ closeModal }) {
    const [selectedGameId, setSelectedGameId] = useState('')
    const [outcome, setOutcome] = useState('')
    const [participants, setParticipants] = useState([])
    const [notes, setNotes] = useState('')
    const gameList = useSelector(state => state.games)
    const playerList = useSelector(state => state.players)

    const selectedGame = gameList.find(g => g.id === parseInt(selectedGameId))
    const isCooperative = selectedGame?.gameType === 'COOPERATIVE'
    const isCompetitive = selectedGame?.gameType === 'COMPETITIVE'
    const hasRoles = selectedGame?.roles?.length > 0

    const hasAnyScore = participants.some(p => p.score !== '')
    const allHaveScore = participants.every(p => p.score !== '')
    const hasAnyPlacement = participants.some(p => p.placement !== '')
    const allHavePlacement = participants.every(p => p.placement !== '')

    const isAddDisabled = (
        !selectedGameId ||
        (isCompetitive && participants.length < 2) ||
        (isCompetitive && participants.some(p => p.score === '' && p.placement === '')) ||
        (isCompetitive && hasAnyScore && !allHaveScore) ||
        (isCompetitive && hasAnyPlacement && !allHavePlacement) ||
        (isCooperative && !outcome) ||
        (hasRoles && participants.some(p => !p.roleId))
    )

    const handleGameChange = (gameId) => {
        setSelectedGameId(gameId)
        setOutcome('')
        setNotes('')
    }

    const addParticipant = () => {
        setParticipants([...participants, { id: Date.now(), playerId: '', roleId: '', score: '', placement: '' }])
    }

    const removeParticipant = (id) => {
        setParticipants(participants.filter(p => p.id !== id))
    }

    const updateParticipant = (id, field, value) => {
        setParticipants(participants.map(p => p.id === id ? { ...p, [field]: value } : p))
    }

    const handleAddSession = async () => {
        try {
            const sessionData = {
                gameId: parseInt(selectedGameId),
                outcome: isCooperative ? outcome || null : null,
                notes: notes || null,
                players: participants.map(p => ({
                    playerId: parseInt(p.playerId),
                    roleId: p.roleId ? parseInt(p.roleId) : null,
                    score: isCompetitive && p.score !== '' ? parseInt(p.score) : null,
                    placement: isCompetitive && p.placement !== '' ? parseInt(p.placement) : null,
                }))
            }
            console.log("sessionData", sessionData)
            const newSession = await sessionsApi.add(sessionData)
            console.log(newSession)
            closeModal()
        } catch (error) {
            console.error('Error adding session:', error)
        }
    }

    return (
        <div className="add-session-modal-container">
            <div>
                Game
                <select value={selectedGameId} onChange={e => handleGameChange(e.target.value)}>
                    <option value="" disabled>Select game</option>
                    {gameList.map(game => (
                        <option key={game.id} value={game.id}>{game.title}</option>
                    ))}
                </select>
            </div>

            {isCooperative && (
                <div>
                    Outcome
                    <select value={outcome} onChange={e => setOutcome(e.target.value)}>
                        <option value="" disabled>Select outcome</option>
                        <option value="WIN">Win</option>
                        <option value="LOSS">Loss</option>
                    </select>
                </div>
            )}

            <div>
                Players
                <button className="btn-secondary" onClick={addParticipant}>Add player</button>
                {participants.map(participant => (
                    <div key={participant.id} className="participant-row">
                        <select value={participant.playerId} onChange={e => updateParticipant(participant.id, 'playerId', e.target.value)}>
                            <option value="" disabled>Select player</option>
                            {playerList.map(player => (
                                <option key={player.id} value={player.id}>{player.username}</option>
                            ))}
                        </select>
                        {selectedGame?.roles?.length > 0 && (
                            <select value={participant.roleId} onChange={e => updateParticipant(participant.id, 'roleId', e.target.value)}>
                                <option value="" disabled>Select role</option>
                                {selectedGame.roles.map(role => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                        )}
                        {isCompetitive && (
                            <>
                                <input
                                    type="number"
                                    placeholder="Score"
                                    className="participant-number-input"
                                    value={participant.score}
                                    onChange={e => updateParticipant(participant.id, 'score', e.target.value)}
                                />
                                <input
                                    type="number"
                                    placeholder="Place"
                                    className="participant-number-input"
                                    value={participant.placement}
                                    onChange={e => updateParticipant(participant.id, 'placement', e.target.value)}
                                />
                            </>
                        )}
                        <button className="btn-ghost" onClick={() => removeParticipant(participant.id)}>Remove</button>
                    </div>
                ))}
            </div>
            <div>
                Notes
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Add notes..."
                />
            </div>

            <button onClick={handleAddSession} disabled={isAddDisabled}>Add</button>
        </div>
    )
}

export default AddSessionModal
