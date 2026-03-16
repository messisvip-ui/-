import { useEffect, useState } from 'react'

// 反馈类型
export type FeedbackType = 'bug' | 'suggestion' | 'praise' | 'other'

export interface Feedback {
  id: string
  type: FeedbackType
  title: string
  description: string
  email?: string
  screenshot?: string
  createdAt: string
  status: 'pending' | 'reviewing' | 'resolved' | 'rejected'
}

export function useFeedbackSystem() {
  const [showModal, setShowModal] = useState(false)
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // 从 localStorage 读取反馈历史
    const stored = localStorage.getItem('userFeedbacks')
    if (stored) {
      setFeedbacks(JSON.parse(stored))
    }
  }, [])

  // 提交反馈
  const submitFeedback = async (data: Omit<Feedback, 'id' | 'createdAt' | 'status'>): Promise<string> => {
    setIsSubmitting(true)

    try {
      const feedback: Feedback = {
        ...data,
        id: `feedback-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'pending',
      }

      // 保存到本地
      const newFeedbacks = [...feedbacks, feedback]
      setFeedbacks(newFeedbacks)
      localStorage.setItem('userFeedbacks', JSON.stringify(newFeedbacks))

      // TODO: 发送到服务器
      // await fetch('/api/feedback', { method: 'POST', body: JSON.stringify(feedback) })

      return feedback.id
    } catch (error) {
      console.error('提交反馈失败:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  // 获取反馈状态
  const getFeedbackStatus = (id: string) => {
    return feedbacks.find(f => f.id === id)?.status
  }

  // 状态翻译
  const getStatusText = (status: Feedback['status']) => {
    const texts: Record<Feedback['status'], string> = {
      pending: '待处理',
      reviewing: '审核中',
      resolved: '已解决',
      rejected: '未采纳',
    }
    return texts[status]
  }

  // 状态颜色
  const getStatusColor = (status: Feedback['status']) => {
    const colors: Record<Feedback['status'], string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      reviewing: 'bg-blue-100 text-blue-700',
      resolved: 'bg-green-100 text-green-700',
      rejected: 'bg-gray-100 text-gray-700',
    }
    return colors[status]
  }

  return {
    showModal,
    setShowModal,
    feedbacks,
    isSubmitting,
    submitFeedback,
    getFeedbackStatus,
    getStatusText,
    getStatusColor,
    FeedbackModal: () => (
      <FeedbackModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={submitFeedback}
        isSubmitting={isSubmitting}
      />
    ),
    FeedbackButton: () => (
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 left-6 z-50 bg-white rounded-full shadow-lg p-3 hover:shadow-xl transition-shadow"
      >
        <span className="text-2xl">💬</span>
      </button>
    ),
  }
}

function FeedbackModal({
  show,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  show: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<string>
  isSubmitting: boolean
}) {
  const [type, setType] = useState<FeedbackType>('suggestion')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await onSubmit({ type, title, description, email })
      setSubmitted(true)
    } catch (error) {
      alert('提交失败，请重试')
    }
  }

  if (!show) return null

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[500] bg-black/50 flex items-center justify-center p-6" onClick={onClose}>
        <div className="card text-center max-w-md" onClick={(e) => e.stopPropagation()}>
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">感谢反馈！</h3>
          <p className="text-gray-600 mb-6">
            我们已经收到你的反馈，会尽快处理。
          </p>
          <button onClick={onClose} className="btn-primary">
            好的
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[500] bg-black/50 flex items-center justify-center p-6" onClick={onClose}>
      <div 
        className="card max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">💬 意见反馈</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 反馈类型 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              反馈类型
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'bug', label: 'Bug', icon: '🐛' },
                { id: 'suggestion', label: '建议', icon: '💡' },
                { id: 'praise', label: '表扬', icon: '👍' },
                { id: 'other', label: '其他', icon: '📝' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id as FeedbackType)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    type === t.id
                      ? 'bg-starlight-500 text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-xl mb-1">{t.icon}</div>
                  <div className="text-xs font-semibold">{t.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 标题 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-starlight-500 focus:outline-none"
              placeholder="简要描述你的反馈"
              required
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              详细描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-starlight-500 focus:outline-none resize-none"
              rows={5}
              placeholder="请详细描述你的问题或建议..."
              required
            />
          </div>

          {/* 邮箱（可选） */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              联系邮箱（可选）
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-starlight-500 focus:outline-none"
              placeholder="用于接收处理结果通知"
            />
          </div>

          {/* 提交按钮 */}
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
              disabled={isSubmitting}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {isSubmitting ? '提交中...' : '提交反馈'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default useFeedbackSystem
