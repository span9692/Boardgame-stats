import { React, useState } from 'react'
import { useDispatch } from 'react-redux'
import { playersApi } from '../../api.js'
import { addPlayer } from '../../store/playerSlice.js'
import './EditPlayerModal.css'

function EditPlayerModal({ closeModal }) {
    const dispatch = useDispatch()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')

    const handleAddPlayer = async () => {
        try {
            const newPlayer = await playersApi.add(firstName, lastName, username)
            if (!newPlayer.error) {
                dispatch(addPlayer(newPlayer))
                setFirstName('')
                setLastName('')
                setUsername('')
                closeModal()
            }
        } catch (error) {
            console.error('Error editing player:', error)
        }
    }

    return (
        <div className="add-player-modal-container">
            <input
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <input
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={() => handleAddPlayer()}>
                Add
            </button>
        </div>
    )
}

export default EditPlayerModal