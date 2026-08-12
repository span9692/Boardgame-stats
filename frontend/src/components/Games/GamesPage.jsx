import { useState } from 'react'
import { useSelector } from 'react-redux'
import Modal from '../Modal.jsx'
import AddGameModal from './AddGameModal.jsx'
import { getGameTheme, getGameTypeMeta } from '../../utils/gameTheme.js'
import './GamesPage.css'

function GamesPage() {
    const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false)
    const gameList = useSelector(state => state.games)

    const closeAddGameModal = () => {
        setIsAddGameModalOpen(false)
    }

    return (
        <div className="games-page-container">
            <div className="page-header">
                <h2>Games</h2>
                <button onClick={() => setIsAddGameModalOpen(true)}>
                    Add game
                </button>
            </div>
            <div className="games-list">
                {gameList.map(game => {
                    const theme = getGameTheme(game.title)
                    const typeMeta = getGameTypeMeta(game.gameType)
                    return (
                        <div key={game.id} className="list-item game-card">
                            <span className="game-icon" style={{ background: theme.soft, color: theme.color }}>{theme.icon}</span>
                            <span className="game-card-title">{game.title}</span>
                            <span className="type-badge" style={{ background: typeMeta.soft, color: typeMeta.color }}>{typeMeta.label}</span>
                        </div>
                    )
                })}
            </div>
            <Modal isOpen={isAddGameModalOpen} onClose={() => setIsAddGameModalOpen(false)} title="Add Game" children={<AddGameModal closeModal={closeAddGameModal} />} />
        </div>
    )
}

export default GamesPage