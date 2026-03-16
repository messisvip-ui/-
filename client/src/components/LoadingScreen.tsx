import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'

export default function LoadingScreen() {
  const { currentStudent } = useGameStore()

  // 如果已加载，不显示
  if (currentStudent) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-gradient-to-b from-starlight-200 to-forest-200 flex items-center justify-center"
      >
        <div className="text-center">
          {/* 加载动画 */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="w-24 h-24 mx-auto mb-8 relative"
          >
            <div className="absolute inset-0 rounded-full bg-starlight-400 opacity-50 blur-xl"></div>
            <div className="absolute inset-4 rounded-full bg-starlight-500 flex items-center justify-center">
              <span className="text-4xl">✨</span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-starlight-700 mb-4"
          >
            正在连接精灵森境...
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-forest-600"
          >
            你的光之精灵正在等待与你相遇
          </motion.p>

          {/* 加载进度点 */}
          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-3 h-3 rounded-full bg-starlight-500"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
