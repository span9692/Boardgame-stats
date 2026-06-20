import { useState } from 'react'
import { useSelector } from 'react-redux'
import Modal from '../Modal.jsx'
import AddGameModal from './AddGameModal.jsx'
import './GamesPage.css'

function GamesPage() {
    const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false)
    const gameList = useSelector(state => state.games)

    const closeAddGameModal = () => {
        setIsAddGameModalOpen(false)
    }

    return (
        <div className="games-page-container">
            <button onClick={() => setIsAddGameModalOpen(true)}>
                Add game
            </button>
            <br />
            <h2>Games</h2>
            {gameList.map(game => (
                <div key={game.id}>{game.title}</div>
            ))}
            <Modal isOpen={isAddGameModalOpen} onClose={() => setIsAddGameModalOpen(false)} title="Add Game" children={<AddGameModal closeModal={closeAddGameModal} />} />
        </div>
    )
}

export default GamesPage