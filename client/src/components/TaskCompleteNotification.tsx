import { useGameStore } from '@/store/gameStore-demo'
import { triggerParticleEffect } from './ParticleEffects'

export default function TaskCompleteNotification() {
  const { completeTask } = useGameStore()

  const handleComplete = (taskId: string, starlight: number, intimacy: number) => {
    completeTask(taskId)
    triggerParticleEffect('star')
    
    // 显示通知（可以用更好的通知系统）
    const notification = document.createElement('div')
    notification.className = 'fixed top-24 right-6 z-[300] card bg-gradient-to-r from-starlight-100 to-forest-100 shadow-2xl'
    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-3xl">🎉</span>
        <div>
          <p class="font-bold text-gray-800">任务完成！</p>
          <p class="text-sm text-gray-600">
            +${starlight} 星光  +${intimacy} 亲密度
          </p>
        </div>
      </div>
    `
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.remove()
    }, 3000)
  }

  return { handleComplete }
}
