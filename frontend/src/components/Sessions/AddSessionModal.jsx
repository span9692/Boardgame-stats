import { useState } from 'react'
import { useSelector } from 'react-redux'
import { sessionsApi } from '../../api.js'
import './AddSessionModal.css'

function AddSessionModal({ closeModal }) {
    const [selectedGameId, setSelectedGameId] = useState('')
    const [participants, setParticipants] = useState([])
    const gameList = useSelector(state => state.games)
    const playerList = useSelector(state => state.players)

    const selectedGame = gameList.find(g => g.id === parseInt(selectedGameId))

    const addParticipant = () => {
        setParticipants([...participants, { id: Date.now(), playerId: '', roleId: '' }])
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
                players: participants.map(p => ({
                    playerId: parseInt(p.playerId),
                    roleId: parseInt(p.roleId)
                }))
            }
            console.log('Session data to add:', sessionData)
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
                <select value={selectedGameId} onChange={e => setSelectedGameId(e.target.value)}>
                    <option value="" disabled>Select game</option>
                    {gameList.map(game => (
                        <option key={game.id} value={game.id}>{game.title}</option>
                    ))}
                </select>
            </div>

            <div>
                Players
                <button onClick={addParticipant}>Add player</button>
                {participants.map(participant => (
                    <div key={participant.id} style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
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
                        <button onClick={() => removeParticipant(participant.id)}>Remove</button>
                    </div>
                ))}
            </div>

            <button onClick={handleAddSession}>Add</button>
        </div>
    )
}

export default AddSessionModal
