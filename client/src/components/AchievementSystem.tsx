import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ACHIEVEMENTS, getCategoryIcon, getCategoryColor } from '@/systems/achievements'

interface AchievementPopup {
  id: number
  achievement: typeof ACHIEVEMENTS[0]
}

export default function AchievementSystem() {
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])
  const [popups, setPopups] = useState<AchievementPopup[]>([])

  // 模拟成就检查（实际应该从服务器获取）
  useEffect(() => {
    // 从 localStorage 读取已解锁成就
    const stored = localStorage.getItem('unlockedAchievements')
    if (stored) {
      setUnlockedAchievements(JSON.parse(stored))
    }
  }, [])

  // 解锁成就
  const unlockAchievement = (achievementId: string) => {
    if (unlockedAchievements.includes(achievementId)) return

    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId)
    if (!achievement) return

    // 添加到已解锁列表
    const newUnlocked = [...unlockedAchievements, achievementId]
    setUnlockedAchievements(newUnlocked)
    localStorage.setItem('unlockedAchievements', JSON.stringify(newUnlocked))

    // 显示弹窗
    const popupId = Date.now()
    setPopups(prev => [...prev, { id: popupId, achievement }])

    // 3 秒后移除弹窗
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== popupId))
    }, 3000)
  }

  // 检查所有成就
  const checkAllAchievements = (state: any) => {
    ACHIEVEMENTS.forEach(achievement => {
      if (achievement.condition(state) && !unlockedAchievements.includes(achievement.id)) {
        unlockAchievement(achievement.id)
      }
    })
  }

  return {
    unlockedAchievements,
    popups,
    checkAllAchievements,
    AchievementList: () => (
      <AchievementList unlocked={unlockedAchievements} />
    ),
  }
}

function AchievementList({ unlocked }: { unlocked: string[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', 'learning', 'social', 'exploration', 'special']

  const filteredAchievements = selectedCategory === 'all'
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter(a => a.category === selectedCategory)

  return (
    <div className="space-y-4">
      {/* 分类选择 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-starlight-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat === 'all' && '📋 全部'}
            {cat === 'learning' && '📚 学习'}
            {cat === 'social' && '🤝 社交'}
            {cat === 'exploration' && '🗺️ 探索'}
            {cat === 'special' && '🌟 特殊'}
          </button>
        ))}
      </div>

      {/* 成就列表 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => {
          const isUnlocked = unlocked.includes(achievement.id)
          return (
            <div
              key={achievement.id}
              className={`card ${!isUnlocked ? 'opacity-50 grayscale' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${
                  isUnlocked ? getCategoryColor(achievement.category) : 'bg-gray-200'
                }`}>
                  {isUnlocked ? achievement.icon : '🔒'}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                    {achievement.name}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                  {isUnlocked && (
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="text-starlight-600 font-semibold">
                        ⭐ +{achievement.reward.starlight}
                      </span>
                      {achievement.reward.title && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                          {achievement.reward.title}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 进度统计 */}
      <div className="card bg-gradient-to-r from-starlight-100 to-forest-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800 mb-1">成就进度</h3>
            <p className="text-sm text-gray-600">
              已解锁 {unlocked.length} / {ACHIEVEMENTS.length} 个成就
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-starlight-600">
              {Math.round((unlocked.length / ACHIEVEMENTS.length) * 100)}%
            </p>
          </div>
        </div>
        <div className="mt-3 h-3 bg-white/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-starlight-400 to-forest-400 transition-all"
            style={{ width: `${(unlocked.length / ACHIEVEMENTS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// 成就解锁弹窗组件
export function AchievementUnlockPopup({ achievement }: { achievement: typeof ACHIEVEMENTS[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      className="fixed top-24 right-6 z-[400] card bg-gradient-to-r from-yellow-100 to-orange-100 shadow-2xl border-2 border-yellow-400"
    >
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg"
        >
          {achievement.icon}
        </motion.div>
        <div>
          <p className="text-xs text-yellow-600 font-semibold mb-1">🎉 成就解锁!</p>
          <h4 className="font-bold text-gray-800">{achievement.name}</h4>
          <p className="text-sm text-gray-600">{achievement.description}</p>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className="text-starlight-600 font-bold">
              ⭐ +{achievement.reward.starlight}
            </span>
            {achievement.reward.title && (
              <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded-full font-semibold">
                {achievement.reward.title}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
