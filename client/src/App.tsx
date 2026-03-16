import { Routes, Route } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import { useEffect } from 'react'

// 页面组件
import LoginPage from './pages/LoginPage'
import TeacherDashboard from './pages/TeacherDashboard'
import Home from './pages/Home'
import Forest from './pages/Forest'
import TaskBoard from './pages/TaskBoard'
import Profile from './pages/Profile'

// UI 层组件
import Navigation from './components/Navigation'

function App() {
  const { currentStudentId, isTeacher, isInitialized, initialize } = useAppStore()

  useEffect(() => {
    if (!isInitialized) {
      initialize()
    }
  }, [])

  // 未初始化时显示加载
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-starlight-200 to-forest-200">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">✨</div>
          <p className="text-white text-xl">正在初始化...</p>
        </div>
      </div>
    )
  }

  // 未登录时显示登录页
  if (!currentStudentId && !isTeacher) {
    return <LoginPage />
  }

  // 教师登录显示管理后台
  if (isTeacher) {
    return <TeacherDashboard />
  }

  // 学生登录显示学生端
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* UI 层 */}
      <div id="ui-layer" className="w-full h-full">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forest" element={<Forest />} />
          <Route path="/tasks" element={<TaskBoard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
