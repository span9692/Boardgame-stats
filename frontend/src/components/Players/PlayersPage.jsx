import { React, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { playersApi } from '../../api.js'
import { getPlayers, addPlayer, removePlayer } from '../../store/playerSlice.js'
import Modal from '../Modal.jsx'
import AddPlayerModal from './AddPlayerModal.jsx'
import './PlayersPage.css'

function PlayersPage() {
    const dispatch = useDispatch()
    const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false)
    const [isEditPlayerModalOpen, setIsEditPlayerModalOpen] = useState(false)
    const playerList = useSelector(state => state.players)

    const closeAddPlayerModal = () => {
        setIsAddPlayerModalOpen(false)
    }
    const closeEditPlayerModal = () => {
        setIsEditPlayerModalOpen(false)
    }

    const handleRemovePlayer = async () => {
        try {
            const data = await playersApi.remove(playerList[0].id)
            dispatch(removePlayer(data.id))
        } catch (error) {
            console.error('Error removing player:', error)
        }
    }

    return (
        <div className="players-page-container">
            <button onClick={() => setIsAddPlayerModalOpen(true)}>
                Add player
            </button>
            <button onClick={handleRemovePlayer}>
                Remove player
            </button>
            <br />
            <h2>Players</h2>
            {playerList.map(player => (
                <div key={player.id}>{player.firstName} {player.lastName} ({player.username})</div>
            ))}
            <Modal isOpen={isAddPlayerModalOpen} onClose={() => setIsAddPlayerModalOpen(false)} title="Add Player" children={<AddPlayerModal closeModal={closeAddPlayerModal} />} />
            <Modal isOpen={isEditPlayerModalOpen} onClose={() => setIsEditPlayerModalOpen(false)} title="Edit Player" children={<EditPlayerModal closeModal={closeEditPlayerModal} />} />
        </div>
    )
}

export default PlayersPage