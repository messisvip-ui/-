import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import TaskManager from './pages/TaskManager'
import StudentList from './pages/StudentList'

function App() {
  return (
    <div className="min-h-screen">
      {/* 顶部导航 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-starlight-600">光之契约 · 教师端</h1>
              <p className="text-sm text-gray-500">班级管理后台</p>
            </div>
            <div className="flex gap-4">
              <a href="/" className="text-gray-600 hover:text-starlight-600">总览</a>
              <a href="/tasks" className="text-gray-600 hover:text-starlight-600">任务管理</a>
              <a href="/students" className="text-gray-600 hover:text-starlight-600">学生列表</a>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<TaskManager />} />
          <Route path="/students" element={<StudentList />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
