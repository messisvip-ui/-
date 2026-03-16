import { useState } from 'react'
import { motion } from 'framer-motion'

export default function StudentList() {
  const [searchTerm, setSearchTerm] = useState('')
  
  const students = [
    { id: '1', name: '李明', starlight: 1250, intimacy: 8, spriteForm: 'bloom', spriteElement: 'light' },
    { id: '2', name: '王芳', starlight: 980, intimacy: 6, spriteForm: 'seedling', spriteElement: 'forest' },
    { id: '3', name: '张伟', starlight: 1450, intimacy: 10, spriteForm: 'tree', spriteElement: 'star' },
    { id: '4', name: '刘洋', starlight: 760, intimacy: 5, spriteForm: 'seedling', spriteElement: 'wind' },
    { id: '5', name: '陈静', starlight: 1120, intimacy: 7, spriteForm: 'bloom', spriteElement: 'water' },
  ]

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">学生列表</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜索学生..."
          className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-starlight-500 focus:outline-none"
        />
      </div>

      {/* 统计卡片 */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-starlight-100 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">学生总数</p>
              <p className="text-2xl font-bold text-gray-800">{students.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">平均星光</p>
              <p className="text-2xl font-bold text-starlight-600">
                {Math.round(students.reduce((sum, s) => sum + s.starlight, 0) / students.length)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
              <span className="text-2xl">💖</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">平均亲密度</p>
              <p className="text-2xl font-bold text-pink-600">
                {(students.reduce((sum, s) => sum + s.intimacy, 0) / students.length).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 学生列表 */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">学生</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">精灵形态</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">星光</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">亲密度</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-starlight-400 to-forest-400 flex items-center justify-center text-white font-bold">
                      {student.name[0]}
                    </div>
                    <span className="font-semibold text-gray-800">{student.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {student.spriteForm === 'seedling' && '🌱'}
                      {student.spriteForm === 'bloom' && '🌸'}
                      {student.spriteForm === 'tree' && '🌳'}
                    </span>
                    <span className="text-sm text-gray-600">
                      {student.spriteForm === 'seedling' && '幼苗'}
                      {student.spriteForm === 'bloom' && '开花'}
                      {student.spriteForm === 'tree' && '参天'}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                      {student.spriteElement === 'light' && '光'}
                      {student.spriteElement === 'forest' && '森'}
                      {student.spriteElement === 'star' && '星'}
                      {student.spriteElement === 'wind' && '风'}
                      {student.spriteElement === 'water' && '水'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-starlight-600">⭐ {student.starlight}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-pink-600">Lv.{student.intimacy}</span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-starlight-600 hover:text-starlight-700 font-semibold">
                    查看详情
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
