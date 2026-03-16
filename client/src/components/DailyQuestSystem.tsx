import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore-demo'

// 每日任务定义
export interface DailyQuest {
  id: string
  title: string
  description: string
  reward: number
  progress: number
  maxProgress: number
  completed: boolean
  claimed: boolean
}

export const DAILY_QUESTS: Omit<DailyQuest, 'progress' | 'completed' | 'claimed'>[] = [
  {
    id: 'daily_login',
    title: '每日签到',
    description: '登录游戏',
    reward: 10,
    maxProgress: 1,
  },
  {
    id: 'daily_task_complete',
    title: '任务达人',
    description: '完成 3 个任务',
    reward: 30,
    maxProgress: 3,
  },
  {
    id: 'daily_praise',
    title: '温暖传递',
    description: '给同学发送 1 次赞赏',
    reward: 20,
    maxProgress: 1,
  },
  {
    id: 'daily_visit',
    title: '串门拜访',
    description: '访问 2 个同学家园',
    reward: 15,
    maxProgress: 2,
  },
  {
    id: 'daily_collect',
    title: '星光收集',
    description: '收集 50 星光',
    reward: 25,
    maxProgress: 50,
  },
]

export default function DailyQuestSystem() {
  const { addStarlight } = useGameStore()
  const [quests, setQuests] = useState<DailyQuest[]>([])

  // 初始化每日任务
  useEffect(() => {
    const today = new Date().toDateString()
    const lastLogin = localStorage.getItem('lastLoginDate')
    
    if (lastLogin !== today) {
      // 新的一天，重置任务
      resetDailyQuests()
      localStorage.setItem('lastLoginDate', today)
    } else {
      // 读取保存的任务进度
      const saved = localStorage.getItem('dailyQuests')
      if (saved) {
        setQuests(JSON.parse(saved))
      } else {
        resetDailyQuests()
      }
    }
  }, [])

  // 重置每日任务
  const resetDailyQuests = () => {
    const newQuests = DAILY_QUESTS.map(q => ({
      ...q,
      progress: 0,
      completed: false,
      claimed: false,
    }))
    setQuests(newQuests)
    saveQuests(newQuests)
  }

  // 保存任务进度
  const saveQuests = (newQuests: DailyQuest[]) => {
    localStorage.setItem('dailyQuests', JSON.stringify(newQuests))
  }

  // 更新任务进度
  const updateQuestProgress = (questId: string, amount: number = 1) => {
    setQuests(prev => {
      const newQuests = prev.map(quest => {
        if (quest.id !== questId || quest.completed) return quest

        const newProgress = Math.min(quest.progress + amount, quest.maxProgress)
        const completed = newProgress >= quest.maxProgress

        return {
          ...quest,
          progress: newProgress,
          completed,
        }
      })

      saveQuests(newQuests)
      return newQuests
    })
  }

  // 领取奖励
  const claimReward = (questId: string) => {
    setQuests(prev => {
      const quest = prev.find(q => q.id === questId)
      if (!quest || !quest.completed || quest.claimed) return prev

      addStarlight(quest.reward)
      
      const newQuests = prev.map(q =>
        q.id === questId ? { ...q, claimed: true } : q
      )
      
      saveQuests(newQuests)
      return newQuests
    })
  }

  return {
    quests,
    updateQuestProgress,
    claimReward,
    DailyQuestPanel: () => (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">📅 每日任务</h3>
          <span className="text-sm text-gray-500">
            重置时间：{getResetTime()}
          </span>
        </div>

        <div className="space-y-3">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className={`p-4 rounded-xl ${
                quest.completed && quest.claimed
                  ? 'bg-gray-100 opacity-60'
                  : quest.completed
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-bold text-gray-800">{quest.title}</h4>
                  <p className="text-sm text-gray-500">{quest.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-starlight-600 font-bold">⭐ +{quest.reward}</p>
                </div>
              </div>

              {/* 进度条 */}
              <div className="mb-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      quest.completed
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                        : 'bg-starlight-400'
                    }`}
                    style={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {quest.progress} / {quest.maxProgress}
                </p>
              </div>

              {/* 领取按钮 */}
              {quest.completed && !quest.claimed ? (
                <button
                  onClick={() => claimReward(quest.id)}
                  className="btn-primary text-sm py-2"
                >
                  🎁 领取奖励
                </button>
              ) : quest.claimed ? (
                <span className="text-sm text-green-600 font-semibold">
                  ✅ 已领取
                </span>
              ) : (
                <span className="text-sm text-gray-400">进行中...</span>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
  }
}

// 获取重置时间
function getResetTime(): string {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  
  const hours = Math.floor((tomorrow.getTime() - now.getTime()) / (1000 * 60 * 60))
  const minutes = Math.floor((tomorrow.getTime() - now.getTime()) / (1000 * 60)) % 60
  
  return `${hours}小时${minutes}分钟后`
}

// 由于上面使用了 useState 但没有导入，需要添加导入
import { useState } from 'react'
