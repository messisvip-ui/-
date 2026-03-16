import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'

export default function BirthdaySystem() {
  const { currentStudent } = useGameStore()
  const [isBirthday, setIsBirthday] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    if (!currentStudent?.birthday) return

    const today = new Date()
    const birthday = new Date(currentStudent.birthday)
    
    // 检查是否是生日（月和日相同）
    const isBirthdayToday = 
      today.getMonth() === birthday.getMonth() &&
      today.getDate() === birthday.getDate()

    setIsBirthday(isBirthdayToday)

    if (isBirthdayToday) {
      // 显示庆祝动画
      setShowCelebration(true)
      
      // 检查是否已经庆祝过（避免重复）
      const hasCelebrated = localStorage.getItem(`birthday-${today.getFullYear()}`)
      if (!hasCelebrated) {
        // 发放生日奖励
        setTimeout(() => {
          alert('🎂 生日快乐！获得 100 星光奖励！')
          localStorage.setItem(`birthday-${today.getFullYear()}`, 'true')
        }, 2000)
      }
    }
  }, [currentStudent])

  if (!isBirthday) return null

  return (
    <>
      {showCelebration && (
        <BirthdayCelebration onClose={() => setShowCelebration(false)} />
      )}
      
      {/* 生日徽章 */}
      <div className="fixed bottom-6 left-6 z-50">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3"
        >
          <span className="text-3xl">🎂</span>
          <div>
            <p className="font-bold">生日快乐!</p>
            <p className="text-xs opacity-80">今天是你的特别日子</p>
          </div>
        </motion.div>
      </div>
    </>
  )
}

function BirthdayCelebration({ onClose }: { onClose: () => void }) {
  // 生成彩带
  const confettis = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    color: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'][Math.floor(Math.random() * 5)],
  }))

  return (
    <div className="fixed inset-0 z-[500] pointer-events-none">
      {/* 彩带动画 */}
      {confettis.map((confetti) => (
        <motion.div
          key={confetti.id}
          initial={{ top: -20, opacity: 1 }}
          animate={{ top: '100vh', rotate: 720 }}
          transition={{ 
            duration: confetti.duration, 
            delay: confetti.delay,
            ease: 'linear',
            repeat: Infinity,
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ 
            left: `${confetti.left}%`,
            backgroundColor: confetti.color,
          }}
        />
      ))}

      {/* 庆祝中心弹窗 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card bg-gradient-to-br from-pink-100 to-purple-100 text-center p-12 max-w-lg"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            🎂
          </motion.div>
          
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            生日快乐!
          </h2>
          
          <p className="text-xl text-gray-600 mb-8">
            愿你的每一天都充满星光与快乐 ✨
          </p>

          <div className="flex justify-center gap-4 mb-8">
            {['🎁', '🎈', '🎉', '🌟', '💝'].map((emoji, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                className="text-4xl"
              >
                {emoji}
              </motion.span>
            ))}
          </div>

          <div className="space-y-4">
            <div className="bg-white/50 rounded-xl p-4">
              <p className="text-sm text-gray-500">生日奖励</p>
              <p className="text-2xl font-bold text-starlight-600">⭐ +100 星光</p>
            </div>
            
            <div className="bg-white/50 rounded-xl p-4">
              <p className="text-sm text-gray-500">特别礼物</p>
              <p className="text-lg font-bold text-pink-600">🎁 限定生日装饰</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-primary mt-8"
          >
            谢谢！
          </button>
        </motion.div>
      </div>
    </div>
  )
}

// 生日装饰组件（用于家园）
export function BirthdayDecoration() {
  return (
    <div className="absolute top-4 right-4 text-4xl animate-bounce">
      🎂
    </div>
  )
}
