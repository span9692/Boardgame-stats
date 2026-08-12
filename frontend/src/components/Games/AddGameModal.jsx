import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { gamesApi } from '../../api.js'
import { addGame } from '../../store/gameSlice.js'
import './AddGameModal.css'

function AddGameModal({ closeModal }) {
    const dispatch = useDispatch()
    const [gameTitle, setGameTitle] = useState('')
    const [gameType, setGameType] = useState('')
    const [roles, setRoles] = useState([])

    const handleAddGame = async () => {
        try {
            const newGame = await gamesApi.add(gameTitle, gameType, roles)
            if (!newGame.error) {
                dispatch(addGame(newGame))
                setRoles([])
                closeModal()
            }
        } catch (error) {
            console.error('Error adding game:', error)
        }
    }
    const addRole = () => {
        setRoles([...roles, { id: Date.now(), name: '' }])
    }
    const removeRole = (id) => {
        setRoles(roles.filter(role => role.id !== id))
    }
    const updateRole = (id, value) => {
        setRoles(roles.map(role => role.id === id ? { ...role, name: value } : role))
    }


    return (
        <div className="add-game-modal-container">
            <div>
                Game
                <input
                    onChange={(e) => setGameTitle(e.target.value)}
                    value={gameTitle}
                    placeholder="Enter title"
                />
            </div>
            <div>
                Type
                <select value={gameType} onChange={e => setGameType(e.target.value)}>
                    <option value="" disabled>Select type</option>
                    <option value="COMPETITIVE">Competitive</option>
                    <option value="COOPERATIVE">Cooperative</option>
                    <option value="SOLO">Solo</option>
                </select>
            </div>
            <div>
                Roles (if applicable)
                <button className="btn-secondary" onClick={addRole}>Add role</button>
                {roles.map(role => (
                    <div key={role.id} style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <input
                            value={role.name}
                            onChange={e => updateRole(role.id, e.target.value)}
                            placeholder="Role name"
                        />
                        <button className="btn-ghost" onClick={() => removeRole(role.id)}>Remove</button>
                    </div>
                ))}
            </div>
            <button onClick={() => handleAddGame()}>
                Add
            </button>
        </div>
    )
}

export default AddGameModal