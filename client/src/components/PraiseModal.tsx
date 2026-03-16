import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { triggerParticleEffect } from './ParticleEffects'

export default function PraiseModal() {
  const { currentStudent, sendPraise, dailyPraiseCount } = useGameStore()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  // 模拟同学列表
  const classmates = [
    { id: 'student-002', name: '李明' },
    { id: 'student-003', name: '王芳' },
    { id: 'student-004', name: '张伟' },
    { id: 'student-005', name: '刘洋' },
    { id: 'student-006', name: '陈静' },
  ]

  const handleSend = async () => {
    if (!selectedStudent || !message.trim()) {
      setError('请选择同学并填写鼓励话语')
      return
    }

    setSending(true)
    setError('')

    try {
      await sendPraise(selectedStudent, message.trim())
      triggerParticleEffect('heart')
      setIsOpen(false)
      setSelectedStudent('')
      setMessage('')
    } catch (err: any) {
      setError(err.message || '发送失败')
    } finally {
      setSending(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 btn-primary flex items-center gap-2 shadow-2xl z-50"
      >
        <span className="text-xl">💝</span>
        <span>星光礼赞</span>
        <span className="bg-white/30 px-2 py-0.5 rounded-full text-sm">
          {dailyPraiseCount}/3
        </span>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-[250] bg-black/50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="card max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">💝 星光礼赞</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* 剩余次数提示 */}
        <div className="mb-6 p-4 bg-starlight-50 rounded-xl">
          <p className="text-sm text-gray-600">
            今日剩余次数：<span className="font-bold text-starlight-600">{3 - dailyPraiseCount}</span> / 3
          </p>
          {dailyPraiseCount >= 3 && (
            <p className="text-xs text-gray-400 mt-1">明日再来送温暖吧~</p>
          )}
        </div>

        {/* 选择同学 */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            送给谁？
          </label>
          <div className="grid grid-cols-2 gap-2">
            {classmates.map((classmate) => (
              <button
                key={classmate.id}
                onClick={() => setSelectedStudent(classmate.id)}
                className={`p-3 rounded-xl text-left transition-all ${
                  selectedStudent === classmate.id
                    ? 'bg-starlight-500 text-white shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span className="font-semibold">{classmate.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 输入鼓励话语 */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            想对 TA 说什么？
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="写下你的鼓励和赞美..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-starlight-500 focus:outline-none resize-none"
            rows={4}
            maxLength={200}
          />
          <p className="text-xs text-gray-400 mt-1 text-right">
            {message.length}/200
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsOpen(false)}
            className="btn-secondary flex-1"
            disabled={sending}
          >
            取消
          </button>
          <button
            onClick={handleSend}
            className="btn-primary flex-1"
            disabled={sending || dailyPraiseCount >= 3}
          >
            {sending ? '发送中...' : '✨ 发送星光'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
