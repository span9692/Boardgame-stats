import { useState } from 'react'
import { useSelector } from 'react-redux'
import Modal from '../Modal.jsx'
import AddPlayerModal from './AddPlayerModal.jsx'
import EditPlayerModal from './EditPlayerModal.jsx'
import './PlayersPage.css'

function PlayersPage() {
    const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false)
    const [isEditPlayerModalOpen, setIsEditPlayerModalOpen] = useState(false)
    const playerList = useSelector(state => state.players)

    const closeAddPlayerModal = () => {
        setIsAddPlayerModalOpen(false)
    }
    const closeEditPlayerModal = () => {
        setIsEditPlayerModalOpen(false)
    }

    return (
        <div className="players-page-container">
            <div className="page-header">
                <h2>Players</h2>
                <div className="page-header-actions">
                    <button onClick={() => setIsAddPlayerModalOpen(true)}>
                        Add player
                    </button>
                    <button className="btn-secondary" onClick={() => setIsEditPlayerModalOpen(true)}>
                        Edit player
                    </button>
                </div>
            </div>
            <div className="players-list">
                {playerList.map(player => (
                    <div key={player.id} className="list-item">{player.firstName} {player.lastName} ({player.username})</div>
                ))}
            </div>
            <Modal isOpen={isAddPlayerModalOpen} onClose={() => setIsAddPlayerModalOpen(false)} title="Add Player" children={<AddPlayerModal closeModal={closeAddPlayerModal} />} />
            <Modal isOpen={isEditPlayerModalOpen} onClose={() => setIsEditPlayerModalOpen(false)} title="Edit Player" children={<EditPlayerModal closeModal={closeEditPlayerModal} />} />
        </div>
    )
}

export default PlayersPage