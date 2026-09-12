import './PlayerAvatar.css'

function PlayerAvatar({ username, label, size = 'md', bare = false }) {
    return (
        <span className={`player-avatar player-avatar-${size} ${bare ? 'player-avatar-bare' : ''}`}>
            {label ?? username.charAt(0).toUpperCase()}
        </span>
    )
}

export default PlayerAvatar
