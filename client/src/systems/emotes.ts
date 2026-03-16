import { useEffect, useState } from 'react'

// 表情包定义
export interface Emote {
  id: string
  emoji: string
  name: string
  category: 'emotion' | 'action' | 'special'
  unlockCondition?: (state: any) => boolean
}

export const EMOTES: Emote[] = [
  // 情感类
  { id: 'happy', emoji: '😊', name: '开心', category: 'emotion' },
  { id: 'excited', emoji: '🤩', name: '兴奋', category: 'emotion' },
  { id: 'love', emoji: '😍', name: '喜爱', category: 'emotion' },
  { id: 'proud', emoji: '😤', name: '骄傲', category: 'emotion' },
  { id: 'sleepy', emoji: '😴', name: '困倦', category: 'emotion' },
  { id: 'surprised', emoji: '😲', name: '惊讶', category: 'emotion' },
  { id: 'thinking', emoji: '🤔', name: '思考', category: 'emotion' },
  { id: 'confused', emoji: '😕', name: '困惑', category: 'emotion' },

  // 动作类
  { id: 'wave', emoji: '👋', name: '挥手', category: 'action' },
  { id: 'clap', emoji: '👏', name: '鼓掌', category: 'action' },
  { id: 'thumbs_up', emoji: '👍', name: '点赞', category: 'action' },
  { id: 'heart', emoji: '❤️', name: '比心', category: 'action' },
  { id: 'dance', emoji: '💃', name: '跳舞', category: 'action' },
  { id: 'jump', emoji: '🦘', name: '跳跃', category: 'action' },
  { id: 'run', emoji: '🏃', name: '奔跑', category: 'action' },

  // 特殊类
  { id: 'star', emoji: '⭐', name: '星光', category: 'special', unlockCondition: (s) => s.totalStarlight >= 1000 },
  { id: 'crown', emoji: '👑', name: '皇冠', category: 'special', unlockCondition: (s) => s.rank === 1 },
  { id: 'trophy', emoji: '🏆', name: '奖杯', category: 'special', unlockCondition: (s) => s.achievements >= 10 },
  { id: 'gift', emoji: '🎁', name: '礼物', category: 'special' },
  { id: 'firework', emoji: '🎆', name: '烟花', category: 'special' },
  { id: 'rainbow', emoji: '🌈', name: '彩虹', category: 'special' },
]

export function useEmoteSystem() {
  const [unlockedEmotes, setUnlockedEmotes] = useState<string[]>([])
  const [recentEmotes, setRecentEmotes] = useState<string[]>([])
  const [showPanel, setShowPanel] = useState(false)

  useEffect(() => {
    // 从 localStorage 读取已解锁表情
    const stored = localStorage.getItem('unlockedEmotes')
    if (stored) {
      setUnlockedEmotes(JSON.parse(stored))
    } else {
      // 默认解锁基础表情
      const defaultEmotes = EMOTES.filter(e => !e.unlockCondition).map(e => e.id)
      setUnlockedEmotes(defaultEmotes)
    }

    // 读取最近使用的表情
    const recent = localStorage.getItem('recentEmotes')
    if (recent) {
      setRecentEmotes(JSON.parse(recent))
    }
  }, [])

  // 检查表情解锁
  const checkEmoteUnlocks = (state: any) => {
    EMOTES.forEach(emote => {
      if (emote.unlockCondition && !unlockedEmotes.includes(emote.id)) {
        if (emote.unlockCondition(state)) {
          unlockEmote(emote.id)
        }
      }
    })
  }

  // 解锁表情
  const unlockEmote = (emoteId: string) => {
    if (unlockedEmotes.includes(emoteId)) return

    const newUnlocked = [...unlockedEmotes, emoteId]
    setUnlockedEmotes(newUnlocked)
    localStorage.setItem('unlockedEmotes', JSON.stringify(newUnlocked))

    // 显示解锁提示
    const emote = EMOTES.find(e => e.id === emoteId)
    if (emote) {
      alert(`🎉 解锁新表情：${emote.emoji} ${emote.name}`)
    }
  }

  // 使用表情
  const useEmote = (emoteId: string) => {
    if (!unlockedEmotes.includes(emoteId)) return

    // 添加到最近使用
    const newRecent = [emoteId, ...recent.filter(id => id !== emoteId)].slice(0, 8)
    setRecentEmotes(newRecent)
    localStorage.setItem('recentEmotes', JSON.stringify(newRecent))

    // 触发表情动画（通过自定义事件）
    const event = new CustomEvent('emote-use', { detail: { emoteId } })
    window.dispatchEvent(event)

    setShowPanel(false)
  }

  // 获取分类表情
  const getEmotesByCategory = (category: string) => {
    return EMOTES.filter(e => {
      if (e.category !== category) return false
      return unlockedEmotes.includes(e.id)
    })
  }

  return {
    unlockedEmotes,
    recentEmotes,
    showPanel,
    setShowPanel,
    unlockEmote,
    useEmote,
    checkEmoteUnlocks,
    getEmotesByCategory,
    EmotePanel: () => (
      <EmotePanel
        show={showPanel}
        onClose={() => setShowPanel(false)}
        onSelect={useEmote}
        unlocked={unlockedEmotes}
        recent={recentEmotes}
      />
    ),
  }
}

// 表情面板组件
function EmotePanel({ 
  show, 
  onClose, 
  onSelect,
  unlocked,
  recent,
}: {
  show: boolean
  onClose: () => void
  onSelect: (emoteId: string) => void
  unlocked: string[]
  recent: string[]
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('recent')

  if (!show) return null

  const categories = [
    { id: 'recent', name: '最近', icon: '🕐' },
    { id: 'emotion', name: '情感', icon: '😊' },
    { id: 'action', name: '动作', icon: '👋' },
    { id: 'special', name: '特殊', icon: '⭐' },
  ]

  const getEmotesForCategory = () => {
    if (selectedCategory === 'recent') {
      return recent.map(id => EMOTES.find(e => e.id === id)).filter(Boolean) as Emote[]
    }
    return EMOTES.filter(e => e.category === selectedCategory)
  }

  const emotes = getEmotesForCategory()

  return (
    <div className="fixed inset-0 z-[400] flex items-end justify-center pb-24" onClick={onClose}>
      <div 
        className="bg-white rounded-t-3xl shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">✨ 表情包</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        {/* 分类选择 */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-starlight-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* 表情网格 */}
        <div className="grid grid-cols-6 gap-3">
          {emotes.map(emote => {
            const isUnlocked = unlocked.includes(emote.id)
            return (
              <button
                key={emote.id}
                onClick={() => isUnlocked && onSelect(emote.id)}
                className={`text-3xl p-2 rounded-xl transition-all ${
                  isUnlocked 
                    ? 'hover:bg-starlight-100 hover:scale-110' 
                    : 'opacity-30 cursor-not-allowed'
                }`}
                title={emote.name}
              >
                {isUnlocked ? emote.emoji : '🔒'}
              </button>
            )
          })}
        </div>

        {/* 统计信息 */}
        <div className="mt-4 pt-4 border-t text-center text-sm text-gray-500">
          已解锁 {unlocked.length} / {EMOTES.length} 个表情
        </div>
      </div>
    </div>
  )
}

// 表情动画组件
export function EmoteAnimation({ emoteId }: { emoteId: string }) {
  const emote = EMOTES.find(e => e.id === emoteId)
  if (!emote) return null

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[500] pointer-events-none">
      <div className="text-9xl animate-bounce">{emote.emoji}</div>
    </div>
  )
}

export default useEmoteSystem
