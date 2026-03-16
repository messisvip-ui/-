import { useGameStore } from '@/store/gameStore'
import { motion } from 'framer-motion'

export default function Navigation() {
  const { sprite, classTotalStarlight } = useGameStore()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-starlight-500 flex items-center justify-center">
            <span className="text-white text-xl">✨</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg glow-text">光之契约</h1>
            <p className="text-white/70 text-xs">精灵森境</p>
          </div>
        </motion.div>

        {/* 星光显示 */}
        {sprite && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="card px-4 py-2 flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="text-xs text-gray-500">星光</p>
                <p className="font-bold text-starlight-600">{sprite.starlight}</p>
              </div>
            </div>
            
            <div className="card px-4 py-2 flex items-center gap-3">
              <span className="text-2xl">💖</span>
              <div>
                <p className="text-xs text-gray-500">亲密度</p>
                <p className="font-bold text-pink-500">Lv.{sprite.intimacyLevel}</p>
              </div>
            </div>

            <div className="card px-4 py-2">
              <p className="text-xs text-gray-500">班级星光</p>
              <p className="font-bold text-forest-600">{classTotalStarlight}</p>
            </div>
          </motion.div>
        )}

        {/* 导航按钮 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <a href="/" className="btn-secondary">首页</a>
          <a href="/forest" className="btn-secondary">森林</a>
          <a href="/tasks" className="btn-secondary">委托</a>
          <a href="/profile" className="btn-secondary">个人</a>
        </motion.div>
      </div>
    </nav>
  )
}
