import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const [stats] = useState({
    totalStudents: 45,
    totalStarlight: 12580,
    activeTasks: 8,
    unlockedAreas: 1,
  })

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">班级总览</h2>

      {/* 统计卡片 */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-starlight-100 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">学生总数</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">班级星光</p>
              <p className="text-2xl font-bold text-starlight-600">{stats.totalStarlight}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">进行中任务</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeTasks}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-2xl">🗺️</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">已解锁区域</p>
              <p className="text-2xl font-bold text-purple-600">{stats.unlockedAreas}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 森林解锁进度 */}
      <div className="card mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">森林解锁进度</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">晨雾山谷</span>
              <span className="text-green-600 font-semibold">已解锁 ✅</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">星夜湖泊</span>
              <span className="text-gray-400">还需 2420 星光</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-starlight-500" style={{ width: '83.6%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">云端秘境</span>
              <span className="text-gray-400">还需 5000 星光</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-starlight-500" style={{ width: '50%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="grid md:grid-cols-2 gap-6">
        <a href="/tasks" className="card hover:shadow-xl transition-shadow cursor-pointer">
          <h3 className="text-xl font-bold text-gray-800 mb-2">📝 发布新任务</h3>
          <p className="text-gray-600">为学生们创建新的星光委托</p>
        </a>

        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-2">🎉 最近成就</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-yellow-500">🏆</span>
              <span className="text-gray-600">李明 获得了"连续勤快王"徽章</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-yellow-500">🏆</span>
              <span className="text-gray-600">王芳 获得了"乐于助人"徽章</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
