import { useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { motion } from 'framer-motion'

export default function TeacherDashboard() {
  const { classData, logout, addStudent, updateClassInfo } = useAppStore()
  const [activeTab, setActiveTab] = useState<'students' | 'tasks' | 'stats'>('students')
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [newStudentName, setNewStudentName] = useState('')
  const [newStudentId, setNewStudentId] = useState('')

  const handleAddStudent = () => {
    if (newStudentName && newStudentId && classData) {
      addStudent({
        id: newStudentId,
        name: newStudentName,
        studentId: newStudentId,
        createdAt: new Date().toISOString(),
      })
      setNewStudentName('')
      setNewStudentId('')
      setShowAddStudent(false)
    }
  }

  if (!classData) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-starlight-200 to-forest-200">
      {/* 顶部导航 */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">✨</div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {classData.name} - 教师管理
                </h1>
                <p className="text-sm text-gray-600">
                  {classData.teacherName}老师 · {classData.students.length}位学生
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              退出登录
            </button>
          </div>

          {/* 标签页 */}
          <div className="flex gap-4 mt-4 border-b">
            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'students'
                  ? 'text-starlight-600 border-b-2 border-starlight-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📚 学生管理
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'tasks'
                  ? 'text-starlight-600 border-b-2 border-starlight-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📋 任务管理
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'text-starlight-600 border-b-2 border-starlight-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📊 班级统计
            </button>
          </div>
        </div>
      </nav>

      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'students' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">学生列表</h2>
              <button
                onClick={() => setShowAddStudent(true)}
                className="px-6 py-3 bg-gradient-to-r from-starlight-500 to-forest-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                ➕ 添加学生
              </button>
            </div>

            {showAddStudent && (
              <div className="card p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">添加新学生</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      学生姓名
                    </label>
                    <input
                      type="text"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                      placeholder="例如：李明"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      学号
                    </label>
                    <input
                      type="text"
                      value={newStudentId}
                      onChange={(e) => setNewStudentId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                      placeholder="例如：001"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddStudent}
                    className="px-6 py-2 bg-starlight-500 text-white rounded-xl font-medium"
                  >
                    确认添加
                  </button>
                  <button
                    onClick={() => setShowAddStudent(false)}
                    className="px-6 py-2 text-gray-600"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {classData.students.map((student) => (
                <div key={student.id} className="card p-4">
                  <div className="text-center">
                    <div className="text-5xl mb-3">{student.avatar || '👤'}</div>
                    <h3 className="font-bold text-gray-800">{student.name}</h3>
                    <p className="text-sm text-gray-600">学号：{student.studentId}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'tasks' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">任务管理</h2>
              <button className="px-6 py-3 bg-gradient-to-r from-starlight-500 to-forest-500 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                ➕ 发布任务
              </button>
            </div>

            <div className="space-y-4">
              {classData.tasks.map((task) => (
                <div key={task.id} className="card p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {task.title}
                      </h3>
                      <p className="text-gray-600 mb-2">{task.description}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>⭐ {task.starlightReward} 星光</span>
                        <span>💖 {task.intimacyReward} 亲密度</span>
                        <span>📅 截止日期：{new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        已完成：{task.completedBy.length}/{classData.students.length}
                      </div>
                      <div className="text-2xl mt-2">📋</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">班级统计</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="card p-6 text-center">
                <div className="text-4xl mb-3">👨‍</div>
                <div className="text-3xl font-bold text-starlight-600">
                  {classData.students.length}
                </div>
                <div className="text-gray-600">学生总数</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-4xl mb-3">📋</div>
                <div className="text-3xl font-bold text-forest-600">
                  {classData.tasks.length}
                </div>
                <div className="text-gray-600">任务总数</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-4xl mb-3">💖</div>
                <div className="text-3xl font-bold text-pink-500">
                  {classData.praises.length}
                </div>
                <div className="text-gray-600">赞赏次数</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
