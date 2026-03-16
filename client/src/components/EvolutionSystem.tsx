import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore-demo'

// 进化阶段定义
export const EVOLUTION_STAGES = [
  { level: 1, form: 'seedling', name: '幼苗形态', requiredExp: 0 },
  { level: 5, form: 'bloom', name: '开花形态', requiredExp: 500 },
  { level: 10, form: 'tree', name: '参天形态', requiredExp: 2000 },
  { level: 15, form: 'crystal', name: '水晶形态', requiredExp: 5000 },
  { level: 20, form: 'dragon', name: '神龙形态', requiredExp: 10000 },
]

export default function EvolutionSystem() {
  const { sprite, addIntimacy } = useGameStore()
  const [showEvolutionModal, setShowEvolutionModal] = useState(false)
  const [canEvolve, setCanEvolve] = useState(false)
  const [nextStage, setNextStage] = useState<typeof EVOLUTION_STAGES[0] | null>(null)

  useEffect(() => {
    if (!sprite) return

    const currentStageIndex = EVOLUTION_STAGES.findIndex(s => s.form === sprite.form)
    const nextStageIndex = currentStageIndex + 1

    if (nextStageIndex < EVOLUTION_STAGES.length) {
      const next = EVOLUTION_STAGES[nextStageIndex]
      setNextStage(next)
      setCanEvolve(sprite.intimacyLevel >= next.level && sprite.starlight >= next.requiredExp)
    } else {
      setNextStage(null)
      setCanEvolve(false)
    }
  }, [sprite])

  const handleEvolution = () => {
    if (!nextStage || !sprite) return

    // 进化动画后更新状态
    setShowEvolutionModal(true)
    
    // 模拟进化过程
    setTimeout(() => {
      alert(`✨ 恭喜！精灵进化为 ${nextStage.name}！`)
      setShowEvolutionModal(false)
    }, 3000)
  }

  return {
    canEvolve,
    nextStage,
    handleEvolution,
    EvolutionButton: () => (
      canEvolve && nextStage ? (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleEvolution}
          className="fixed bottom-32 right-6 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold"
        >
          <span className="text-3xl">🦋</span>
          <div className="text-left">
            <p className="text-sm opacity-80">可以进化!</p>
            <p>→ {nextStage.name}</p>
          </div>
        </motion.button>
      ) : nextStage ? (
        <div className="fixed bottom-32 right-6 z-50 card text-sm">
          <p className="text-gray-600">下一形态：{nextStage.name}</p>
          <p className="text-xs text-gray-400 mt-1">
            需要 Lv.{nextStage.level} + {nextStage.requiredExp} 星光
          </p>
        </div>
      ) : null
    ),
    EvolutionModal: () => showEvolutionModal && nextStage && (
      <EvolutionAnimation nextStage={nextStage} />
    ),
  }
}

function EvolutionAnimation({ nextStage }: { nextStage: typeof EVOLUTION_STAGES[0] }) {
  return (
    <div className="fixed inset-0 z-[500] bg-black flex items-center justify-center">
      <div className="text-center">
        {/* 进化光芒 */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.5, 2], opacity: [1, 0.5, 0] }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full blur-3xl"
        />

        {/* 进化文字 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.p
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            ✨
          </motion.p>
          
          <h2 className="text-4xl font-bold text-white mb-2">
            进化中...
          </h2>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
            className="text-8xl my-8"
          >
            {nextStage.form === 'seedling' && '🌱'}
            {nextStage.form === 'bloom' && '🌸'}
            {nextStage.form === 'tree' && '🌳'}
            {nextStage.form === 'crystal' && '💎'}
            {nextStage.form === 'dragon' && '🐉'}
          </motion.div>

          <p className="text-2xl text-white/80">
            {nextStage.name}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

// 亲密度进度条组件
export function IntimacyProgressBar({ currentLevel, currentExp }: { currentLevel: number; currentExp: number }) {
  const nextLevelExp = currentLevel * 100
  const progress = (currentExp / nextLevelExp) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">亲密度 Lv.{currentLevel}</span>
        <span className="text-gray-400">{currentExp} / {nextLevelExp}</span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-pink-400 to-pink-600"
        />
      </div>
      
      {/* 下一级解锁提示 */}
      {EVOLUTION_STAGES.find(s => s.level === currentLevel + 1) && (
        <p className="text-xs text-gray-400">
          下一级解锁：{EVOLUTION_STAGES.find(s => s.level === currentLevel + 1)?.name}
        </p>
      )}
    </div>
  )
}

// 解锁动作展示
export function UnlockedAnimations({ animations }: { animations: string[] }) {
  const animationNames: Record<string, string> = {
    idle: '待机',
    happy: '开心',
    wave: '挥手',
    spin: '转圈',
    hug: '拥抱',
    fly: '飞行',
  }

  return (
    <div className="space-y-2">
      <h4 className="font-bold text-gray-800">解锁动作</h4>
      <div className="flex flex-wrap gap-2">
        {animations.map((anim) => (
          <span
            key={anim}
            className="px-3 py-1 bg-starlight-100 text-starlight-700 rounded-full text-sm"
          >
            {animationNames[anim] || anim}
          </span>
        ))}
      </div>
    </div>
  )
}
