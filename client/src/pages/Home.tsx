import { useState, useEffect } from 'react'
import { useGameStore } from '@/store/gameStore-demo'
import PraiseModal from '@/components/PraiseModal'
import ParticleEffects from '@/components/ParticleEffects'

export default function Home() {
  const { currentStudent, sprite, initialize, isInitialized } = useGameStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟学生 ID（实际应从登录系统获取）
    const studentId = localStorage.getItem('studentId') || 'student-001'
    if (!localStorage.getItem('studentId')) {
      localStorage.setItem('studentId', studentId)
    }
    
    initialize(studentId)
    
    // 等待初始化完成
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  // 显示加载页面
  if (loading) {
    return null // LoadingScreen 会显示
  }

  // 确保有数据
  if (!currentStudent || !sprite) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl">初始化失败，请刷新页面</p>
        </div>
      </div>
    )
  }

  // 添加快捷操作
  const quickActions = [
    { icon: '📋', title: '星光委托', desc: '查看并完成今日任务', href: '/tasks' },
    { icon: '🌲', title: '精灵森林', desc: '探索班级共享空间', href: '/forest' },
    { icon: '👤', title: '个人主页', desc: '查看精灵成长记录', href: '/profile' },
    { icon: '🎁', title: '每日签到', desc: '领取每日星光奖励', action: 'checkin' },
  ]

  const handleCheckIn = () => {
    // 签到逻辑
    alert('✅ 签到成功！获得 10 星光')
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* 欢迎语 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            欢迎回来，{currentStudent?.name || '守护者'}
          </h1>
          <p className="text-xl text-white/90">
            你的光之精灵 <span className="font-semibold text-starlight-300">{sprite?.name}</span> 正在等待与你一起探索森林
          </p>
        </div>

        {/* 快捷操作 */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {quickActions.map((action, i) => (
            <div
              key={i}
              onClick={() => action.action ? action.action() : null}
              className="card cursor-pointer hover:shadow-2xl transition-all hover:scale-105"
            >
              {action.href ? (
                <a href={action.href} className="block">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{action.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{action.title}</h3>
                      <p className="text-gray-600">{action.desc}</p>
                    </div>
                  </div>
                </a>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{action.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{action.title}</h3>
                    <p className="text-gray-600">{action.desc}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 今日提示 */}
        <div className="card bg-gradient-to-r from-starlight-100 to-forest-100">
          <div className="flex items-start gap-4">
            <span className="text-4xl">💡</span>
            <div>
              <h4 className="font-bold text-gray-800 mb-2">今日小提示</h4>
              <p className="text-gray-600">
                完成所有委托任务可以获得额外星光奖励！别忘了给同学们送上星光礼赞哦~
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 星光礼赞按钮 */}
      <PraiseModal />
      
      {/* 粒子效果层 */}
      <ParticleEffects />
    </div>
  )
}
