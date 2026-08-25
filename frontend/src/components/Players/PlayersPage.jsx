import { useState } from 'react'
import { useSelector } from 'react-redux'
import Modal from '../Modal.jsx'
import AddPlayerModal from './AddPlayerModal.jsx'
import EditPlayerModal from './EditPlayerModal.jsx'
import PlayerDetailModal from './PlayerDetailModal.jsx'
import PlayerAvatar from '../PlayerAvatar.jsx'
import './PlayersPage.css'

function PlayersPage() {
    const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false)
    const [isEditPlayerModalOpen, setIsEditPlayerModalOpen] = useState(false)
    const [selectedPlayer, setSelectedPlayer] = useState(null)
    const playerList = useSelector(state => state.players)
    const sortedPlayerList = [...playerList].sort((a, b) => a.firstName.localeCompare(b.firstName))

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
                {sortedPlayerList.map(player => (
                    <div key={player.id} className="list-item player-card" onClick={() => setSelectedPlayer(player)}>
                        <PlayerAvatar username={player.username} size="sm" />
                        <span className="player-card-name">{player.firstName} {player.lastName}</span>
                        <span className="player-card-username">@{player.username}</span>
                    </div>
                ))}
            </div>
            <Modal isOpen={isAddPlayerModalOpen} onClose={() => setIsAddPlayerModalOpen(false)} title="Add Player" children={<AddPlayerModal closeModal={closeAddPlayerModal} />} />
            <Modal isOpen={isEditPlayerModalOpen} onClose={() => setIsEditPlayerModalOpen(false)} title="Edit Player" children={<EditPlayerModal closeModal={closeEditPlayerModal} />} />
            <Modal isOpen={!!selectedPlayer} onClose={() => setSelectedPlayer(null)} title="Player Stats" children={selectedPlayer && <PlayerDetailModal player={selectedPlayer} />} />
        </div>
    )
}

export default PlayersPage