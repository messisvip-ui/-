import { useState, useEffect } from 'react'
import { useGameStore } from '@/store/gameStore-demo'
import { motion } from 'framer-motion'

export default function TaskBoard() {
  const { tasks, completeTask, isInitialized } = useGameStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return null // LoadingScreen 会显示
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl">请先访问首页初始化</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">
          📋 星光委托
        </h1>

        {tasks.length === 0 ? (
          <div className="card text-center py-12">
            <span className="text-6xl mb-4 block">✨</span>
            <p className="text-gray-600">暂时没有委托任务</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card ${task.completed ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {task.starlightReward >= 50 ? '🌟' : '⭐'}
                      </span>
                      <h3 className={`text-xl font-bold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.title}
                      </h3>
                    </div>
                    
                    {task.story && (
                      <p className="text-sm text-forest-600 mb-2 italic">
                        📖 {task.story}
                      </p>
                    )}
                    
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-starlight-600 font-semibold">
                        +{task.starlightReward} 星光
                      </span>
                      <span className="text-pink-500 font-semibold">
                        +{task.intimacyReward} 亲密度
                      </span>
                      <span className="text-gray-400">
                        截止：{new Date(task.dueDate).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                  </div>

                  {!task.completed && (
                    <button
                      onClick={() => completeTask(task.id)}
                      className="btn-primary ml-4"
                    >
                      完成任务
                    </button>
                  )}

                  {task.completed && (
                    <div className="flex items-center gap-2 text-forest-600">
                      <span className="text-2xl">✅</span>
                      <span className="font-semibold">已完成</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
