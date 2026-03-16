import { useState, useEffect } from 'react'
import { useGameStore } from '@/store/gameStore-demo'
import PraiseModal from '@/components/PraiseModal'
import ParticleEffects from '@/components/ParticleEffects'

import { useAppStore } from '@/store/appStore'
import PraiseModal from '@/components/PraiseModal'
import ParticleEffects from '@/components/ParticleEffects'

export default function Home() {
  const { currentStudentId, getStudentData, addStarlight } = useAppStore()
  const studentData = currentStudentId ? getStudentData(currentStudentId) : null
  const sprite = studentData?.sprite
  const studentName = studentData ? '守护者' : '守护者'

  const quickActions = [
    { icon: '📋', title: '星光委托', desc: '查看并完成今日任务', href: '/tasks' },
    { icon: '🌲', title: '精灵森林', desc: '探索班级共享空间', href: '/forest' },
    { icon: '👤', title: '个人主页', desc: '查看精灵成长记录', href: '/profile' },
    { icon: '🎁', title: '每日签到', desc: '领取每日星光奖励', action: 'checkin' },
  ]

  const handleCheckIn = () => {
    if (currentStudentId) {
      addStarlight(currentStudentId, 10)
      alert('✅ 签到成功！获得 10 星光')
    }
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* 欢迎语 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            欢迎回来，{studentName}
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

        {/* 今日小提示 */}
        <div className="card bg-gradient-to-r from-starlight-100 to-forest-100 p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">今日小提示</h3>
              <p className="text-gray-700">
                完成所有委托任务可以获得额外星光奖励！别忘了给同学们送上星光礼赞哦~
              </p>
            </div>
          </div>
        </div>

        {/* 星光礼赞按钮 */}
        <div className="fixed bottom-6 right-6">
          <button className="card bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💝</span>
              <div className="text-left">
                <div className="font-bold">星光礼赞</div>
                <div className="text-sm opacity-90">
                  {studentData?.dailyPraiseCount || 0}/3
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <PraiseModal />
      <ParticleEffects />
    </div>
  )
}

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
