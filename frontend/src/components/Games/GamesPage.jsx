import { useState } from 'react'
import { useSelector } from 'react-redux'
import Modal from '../Modal.jsx'
import AddGameModal from './AddGameModal.jsx'
import GameDetailModal from './GameDetailModal.jsx'
import GameIcon from '../GameIcon.jsx'
import { getGameTypeMeta } from '../../utils/gameTheme.js'
import './GamesPage.css'

function GamesPage() {
    const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false)
    const [selectedGame, setSelectedGame] = useState(null)
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
                    const typeMeta = getGameTypeMeta(game.gameType)
                    return (
                        <div key={game.id} className="list-item game-card" onClick={() => setSelectedGame(game)}>
                            <GameIcon title={game.title} iconUrl={game.iconUrl} size="md" />
                            <span className="game-card-title">{game.title}</span>
                            <span className="type-badge" style={{ background: typeMeta.soft, color: typeMeta.color }}>{typeMeta.label}</span>
                        </div>
                    )
                })}
            </div>
            <Modal isOpen={isAddGameModalOpen} onClose={() => setIsAddGameModalOpen(false)} title="Add Game" children={<AddGameModal closeModal={closeAddGameModal} />} />
            <Modal isOpen={!!selectedGame} onClose={() => setSelectedGame(null)} title="Game Stats" children={selectedGame && <GameDetailModal game={selectedGame} />} />
        </div>
    )
}

export default GamesPage