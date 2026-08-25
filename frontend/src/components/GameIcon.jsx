import { getGameTheme } from '../utils/gameTheme.js'
import './GameIcon.css'

function GameIcon({ title, iconUrl, size = 'md' }) {
    if (iconUrl) {
        return <img className={`game-icon game-icon-${size}`} src={iconUrl} alt={title} />
    }

    const theme = getGameTheme(title)
    return (
        <span
            className={`game-icon game-icon-${size} game-icon-fallback`}
            style={{ background: theme.soft, color: theme.color }}
        >
            {theme.icon}
        </span>
    )
}

export default GameIcon
