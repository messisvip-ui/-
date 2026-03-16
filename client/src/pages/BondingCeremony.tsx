import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '@/store/gameStore'
import { motion } from 'framer-motion'

const ELEMENTS = [
  { id: 'light', name: '光', icon: '✨', color: 'from-yellow-300 to-yellow-500' },
  { id: 'forest', name: '森', icon: '🌿', color: 'from-green-300 to-green-500' },
  { id: 'star', name: '星', icon: '⭐', color: 'from-purple-300 to-purple-500' },
  { id: 'wind', name: '风', icon: '💨', color: 'from-blue-300 to-blue-500' },
  { id: 'water', name: '水', icon: '💧', color: 'from-cyan-300 to-cyan-500' },
]

const FORMS = ['seedling', 'bloom', 'tree']

export default function BondingCeremony() {
  const navigate = useNavigate()
  const { setSprite } = useGameStore()
  const [step, setStep] = useState(1)
  const [selectedElement, setSelectedElement] = useState('')
  const [spriteName, setSpriteName] = useState('')

  const handleComplete = () => {
    // 生成精灵
    const sprite = {
      id: `sprite-${Date.now()}`,
      name: spriteName || '小光',
      form: 'seedling' as const,
      element: selectedElement as any || 'light',
      color: ELEMENTS.find(e => e.id === selectedElement)?.color || 'from-yellow-300 to-yellow-500',
      intimacyLevel: 1,
      starlight: 100,
      unlockedAnimations: ['idle', 'happy'],
    }

    setSprite(sprite)
    navigate('/')
  }

  return (
    <div className="fixed inset-0 z-[200] bg-gradient-to-b from-starlight-300 to-forest-200 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex justify-between text-white mb-2">
            <span>缔结契约</span>
            <span>步骤 {step}/3</span>
          </div>
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="card">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                🌟 选择你的元素属性
              </h2>
              <p className="text-gray-600 text-center mb-8">
                这将决定你的光之精灵的元素亲和
              </p>

              <div className="grid grid-cols-5 gap-4">
                {ELEMENTS.map((element) => (
                  <button
                    key={element.id}
                    onClick={() => setSelectedElement(element.id)}
                    className={`p-4 rounded-xl transition-all ${
                      selectedElement === element.id
                        ? `bg-gradient-to-br ${element.color} text-white shadow-lg scale-105`
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-3xl mb-2">{element.icon}</div>
                    <div className="font-semibold">{element.name}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!selectedElement}
                className="btn-primary w-full mt-8 disabled:opacity-50"
              >
                下一步
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                💫 为你的精灵命名
              </h2>
              <p className="text-gray-600 text-center mb-8">
                取一个特别的名字，它将陪伴你成长
              </p>

              <input
                type="text"
                value={spriteName}
                onChange={(e) => setSpriteName(e.target.value)}
                placeholder="输入精灵的名字..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-starlight-500 focus:outline-none text-center text-lg"
                maxLength={10}
              />

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1"
                >
                  上一步
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="btn-primary flex-1"
                >
                  下一步
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center"
            >
              <div className="text-8xl mb-6 animate-pulse">
                {ELEMENTS.find(e => e.id === selectedElement)?.icon || '✨'}
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                契约即将缔结
              </h2>
              <p className="text-gray-600 mb-8">
                你的光之精灵 <span className="font-semibold text-starlight-600">{spriteName || '小光'}</span> 正在等待与你相遇
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="btn-secondary flex-1"
                >
                  上一步
                </button>
                <button
                  onClick={handleComplete}
                  className="btn-primary flex-1"
                >
                  ✨ 缔结契约
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
