import { useState } from 'react'
import Modal from '../Modal.jsx'
import AddSessionModal from './AddSessionModal.jsx'
import './SessionsPage.css'

function SessionsPage() {
    const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false)

    const closeAddSessionModal = () => {
        setIsAddSessionModalOpen(false)
    }

    return (
        <div className="sessions-page-container">
            <button onClick={() => setIsAddSessionModalOpen(true)}>
                Add session
            </button>
            <br />

            <Modal isOpen={isAddSessionModalOpen} onClose={() => setIsAddSessionModalOpen(false)} title="Add Session" children={<AddSessionModal closeModal={closeAddSessionModal} />} />
            {/* <Modal isOpen={isEditPlayerModalOpen} onClose={() => setIsEditPlayerModalOpen(false)} title="Edit Player" children={<EditPlayerModal closeModal={closeEditPlayerModal} />} /> */}
        </div>
    )
}

export default SessionsPage