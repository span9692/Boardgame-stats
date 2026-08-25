import './PlayerAvatar.css'

function PlayerAvatar({ username, size = 'md' }) {
    return (
        <span className={`player-avatar player-avatar-${size}`}>
            {username.charAt(0).toUpperCase()}
        </span>
    )
}

export default PlayerAvatar
