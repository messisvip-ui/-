import { useState } from 'react'
import { motion } from 'framer-motion'

const TASK_TYPES = [
  { id: 'daily', name: '日常委托', icon: '📅', color: 'bg-green-500' },
  { id: 'weekly', name: '周常委托', icon: '📆', color: 'bg-blue-500' },
  { id: 'special', name: '特殊委托', icon: '🌟', color: 'bg-purple-500' },
]

export default function TaskManager() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [tasks] = useState([
    {
      id: '1',
      title: '晨间守护者',
      description: '按时到校，开始新一天的冒险',
      story: '清晨的第一缕阳光洒在森林中，精灵们期待着你的到来...',
      type: 'daily',
      starlightReward: 15,
      intimacyReward: 5,
      dueDate: '2026-03-16',
      completedCount: 32,
      totalStudents: 45,
    },
    {
      id: '2',
      title: '课堂积极分子',
      description: '在课堂上主动发言至少 3 次',
      story: '勇敢表达自己的想法，让智慧的火花在森林中闪耀',
      type: 'daily',
      starlightReward: 20,
      intimacyReward: 8,
      dueDate: '2026-03-16',
      completedCount: 18,
      totalStudents: 45,
    },
    {
      id: '3',
      title: '作业全对王',
      description: '今日所有作业全部正确',
      story: '认真细致的态度，是成长为优秀守护者的必经之路',
      type: 'daily',
      starlightReward: 25,
      intimacyReward: 10,
      dueDate: '2026-03-16',
      completedCount: 12,
      totalStudents: 45,
    },
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">任务管理</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <span className="text-xl">➕</span>
          <span>发布新任务</span>
        </button>
      </div>

      {/* 任务列表 */}
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-white text-sm ${
                    TASK_TYPES.find(t => t.id === task.type)?.color
                  }`}>
                    {TASK_TYPES.find(t => t.id === task.type)?.icon} {TASK_TYPES.find(t => t.id === task.type)?.name}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
                </div>
                
                {task.story && (
                  <p className="text-sm text-forest-600 mb-2 italic">
                    📖 {task.story}
                  </p>
                )}
                
                <p className="text-gray-600 mb-3">{task.description}</p>
                
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-starlight-600 font-semibold">
                    ⭐ +{task.starlightReward} 星光
                  </span>
                  <span className="text-pink-500 font-semibold">
                    💖 +{task.intimacyReward} 亲密度
                  </span>
                  <span className="text-gray-400">
                    📅 截止：{new Date(task.dueDate).toLocaleDateString('zh-CN')}
                  </span>
                  <span className="text-gray-400">
                    👥 完成：{task.completedCount}/{task.totalStudents}
                  </span>
                </div>

                {/* 完成进度条 */}
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-forest-400 to-forest-600"
                      style={{ width: `${(task.completedCount / task.totalStudents) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-6">
                <button className="btn-secondary text-sm">
                  编辑
                </button>
                <button className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-full text-sm transition-colors">
                  删除
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 创建任务弹窗 */}
      {showCreateModal && (
        <CreateTaskModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

function CreateTaskModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    story: '',
    type: 'daily',
    starlightReward: 10,
    intimacyReward: 5,
    dueDate: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 调用 API 创建任务
    alert('任务创建成功！')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📋 发布新任务</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 任务类型 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              任务类型
            </label>
            <div className="grid grid-cols-3 gap-3">
              {TASK_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.id })}
                  className={`p-4 rounded-xl text-center transition-all ${
                    formData.type === type.id
                      ? `${type.color} text-white shadow-lg`
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="font-semibold">{type.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 任务标题 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              任务标题
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-starlight-500 focus:outline-none"
              placeholder="例如：晨间守护者"
              required
            />
          </div>

          {/* 任务描述 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              任务描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-starlight-500 focus:outline-none resize-none"
              rows={3}
              placeholder="例如：按时到校，开始新一天的冒险"
              required
            />
          </div>

          {/* 故事背景 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              故事背景（可选）
            </label>
            <textarea
              value={formData.story}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-starlight-500 focus:outline-none resize-none"
              rows={3}
              placeholder="增加沉浸感的故事描述..."
            />
          </div>

          {/* 奖励设置 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                星光奖励
              </label>
              <input
                type="number"
                value={formData.starlightReward}
                onChange={(e) => setFormData({ ...formData, starlightReward: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-starlight-500 focus:outline-none"
                min="1"
                max="500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                亲密度奖励
              </label>
              <input
                type="number"
                value={formData.intimacyReward}
                onChange={(e) => setFormData({ ...formData, intimacyReward: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-starlight-500 focus:outline-none"
                min="1"
                max="100"
              />
            </div>
          </div>

          {/* 截止日期 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              截止日期
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-starlight-500 focus:outline-none"
              required
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              取消
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              ✨ 发布任务
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
