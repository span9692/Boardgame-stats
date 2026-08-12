const GAME_THEMES = [
  { icon: '🎲', color: '#ff6b4a', soft: '#ffede7' },
  { icon: '🃏', color: '#7c4dff', soft: '#f1ecff' },
  { icon: '♟️', color: '#12a594', soft: '#e3f7f3' },
  { icon: '🧩', color: '#5b6ef5', soft: '#ecefff' },
  { icon: '🀄', color: '#e0507a', soft: '#fdebf1' },
  { icon: '🎯', color: '#c8931f', soft: '#faf1de' },
  { icon: '🐉', color: '#2e9e5b', soft: '#e7f6ed' },
  { icon: '🏰', color: '#5c7cfa', soft: '#ecefff' },
]

export function getGameTheme(title = '') {
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash = (hash * 31 + title.charCodeAt(i)) >>> 0
  }
  return GAME_THEMES[hash % GAME_THEMES.length]
}

const GAME_TYPE_META = {
  COMPETITIVE: { label: 'Competitive', color: '#ff6b4a', soft: '#ffede7' },
  COOPERATIVE: { label: 'Cooperative', color: '#12a594', soft: '#e3f7f3' },
  SOLO: { label: 'Solo', color: '#5b6ef5', soft: '#ecefff' },
}

export function getGameTypeMeta(gameType) {
  return GAME_TYPE_META[gameType] || { label: gameType, color: '#6e6e73', soft: '#f0eef5' }
}
