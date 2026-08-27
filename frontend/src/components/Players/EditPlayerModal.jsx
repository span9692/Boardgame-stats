import { React, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { playersApi } from '../../api.js'
import { updatePlayer, removePlayer } from '../../store/playerSlice.js'
import './EditPlayerModal.css'

function EditPlayerModal({ closeModal }) {
    const playerList = useSelector(state => state.players)
    const dispatch = useDispatch()
    const [playerId, setPlayerId] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')

    const handlePlayerChange = (e) => {
        const selectedId = e.target.value
        setPlayerId(selectedId)

        const selectedPlayer = playerList.find(p => p.id === parseInt(selectedId))
        if (selectedPlayer) {
            setFirstName(selectedPlayer.firstName)
            setLastName(selectedPlayer.lastName)
            setUsername(selectedPlayer.username)
        }
    }

    const handleSavePlayer = async () => {
        try {
            const updatedPlayer = await playersApi.edit(playerId, firstName, lastName, username)
            if (!updatedPlayer.error) {
                dispatch(updatePlayer(updatedPlayer))
                closeModal()
            }
        } catch (error) {
            console.error('Error editing player:', error)
        }
    }

    // const handleDeletePlayer = async () => {
    //     try {
    //         await playersApi.remove(playerId)
    //         dispatch(removePlayer({ id: parseInt(playerId) }))
    //         closeModal()
    //     } catch (error) {
    //         console.error('Error editing player:', error)
    //     }
    // }

    return (
        <div className="add-player-modal-container">
            <select
                value={playerId}
                onChange={handlePlayerChange}
            >
                <option value="" disabled>Select a player</option>
                {playerList.map(player => (
                    <option key={player.id} value={player.id}>
                        {player.firstName} {player.lastName} ({player.username})
                    </option>
                ))}
            </select>
            {firstName && (
                <>
                    <input
                        placeholder="First Name"
                        value={firstName}
                        disabled
                    />

                    <input
                        placeholder="Last Name"
                        value={lastName}
                        disabled
                    />
                    <input
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="edit-player-modal-actions">
                        <button onClick={() => handleSavePlayer()}>
                            Save
                        </button>
                        {/* <button className="btn-danger" onClick={() => handleDeletePlayer()}>
                            Delete
                        </button> */}
                    </div>
                </>
            )}
        </div>
    )
}

export default EditPlayerModal