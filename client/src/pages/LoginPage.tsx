import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/appStore'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const { initialize, classData, loginAsStudent, loginAsTeacher, isInitialized } = useAppStore()
  const [selectedStudentId, setSelectedStudentId] = useState<string>('')
  const [showTeacherLogin, setShowTeacherLogin] = useState(false)

  useEffect(() => {
    if (!isInitialized) {
      initialize()
    }
  }, [])

  const handleStudentLogin = () => {
    if (selectedStudentId) {
      loginAsStudent(selectedStudentId)
    }
  }

  const handleTeacherLogin = () => {
    loginAsTeacher()
  }

  if (!isInitialized || !classData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-starlight-200 to-forest-200">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🌟</div>
          <p className="text-white text-xl">正在初始化...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-starlight-200 to-forest-200 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="text-8xl mb-4 animate-bounce">✨</div>
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            光之契约 · 精灵森境
          </h1>
          <p className="text-xl text-white/90">
            {classData.name} - {classData.teacherName}老师
          </p>
        </div>

        {/* 登录选项 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 学生登录 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-8"
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">👨‍</div>
              <h2 className="text-2xl font-bold text-gray-800">学生登录</h2>
              <p className="text-gray-600 mt-2">选择你的名字，开始冒险</p>
            </div>

            {classData.students.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>暂无学生</p>
                <p className="text-sm mt-2">请联系老师添加学生账号</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                  {classData.students.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudentId(student.id)}
                      className={`p-3 rounded-xl transition-all ${
                        selectedStudentId === student.id
                          ? 'bg-starlight-500 text-white shadow-lg scale-105'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-2xl mb-1">
                        {student.avatar || '👤'}
                      </div>
                      <div className="text-sm font-medium truncate">
                        {student.name}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleStudentLogin}
                  disabled={!selectedStudentId}
                  className="w-full py-3 bg-gradient-to-r from-starlight-500 to-forest-500 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  进入精灵森境
                </button>
              </div>
            )}
          </motion.div>

          {/* 教师登录 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-8"
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">👩‍🏫</div>
              <h2 className="text-2xl font-bold text-gray-800">教师管理</h2>
              <p className="text-gray-600 mt-2">管理班级、发布任务</p>
            </div>

            {showTeacherLogin ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    教师姓名
                  </label>
                  <input
                    type="text"
                    defaultValue={classData.teacherName}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-starlight-500 focus:border-transparent"
                    placeholder="输入你的姓名"
                  />
                </div>
                <button
                  onClick={handleTeacherLogin}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all"
                >
                  进入管理后台
                </button>
                <button
                  onClick={() => setShowTeacherLogin(false)}
                  className="w-full py-2 text-gray-600 hover:text-gray-800"
                >
                  返回
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowTeacherLogin(true)}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all"
              >
                教师登录
              </button>
            )}
          </motion.div>
        </div>

        {/* 班级信息 */}
        <div className="text-center text-white/80">
          <p className="text-sm">
            全班共 {classData.students.length} 位同学 · {classData.tasks.length} 个任务
          </p>
        </div>
      </motion.div>
    </div>
  )
}
