import { useEffect, useState } from 'react'

// 通知类型
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'birthday'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  icon?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  createdAt: number
}

export function useNotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [permission, setPermission] = useState<NotificationPermission>('default')

  // 请求通知权限
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
      
      if (Notification.permission === 'default') {
        // 不主动请求，等用户交互时再请求
      }
    }
  }, [])

  // 请求权限
  const requestPermission = async () => {
    if (!('Notification' in window)) return 'denied'
    
    const permission = await Notification.requestPermission()
    setPermission(permission)
    return permission
  }

  // 添加通知
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>): string => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: Date.now(),
      duration: notification.duration ?? 5000,
    }

    setNotifications(prev => [...prev, newNotification])

    // 自动移除
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    // 发送系统通知（如果有权限）
    if (permission === 'granted') {
      sendSystemNotification(newNotification)
    }

    return id
  }

  // 发送系统通知
  const sendSystemNotification = (notification: Notification) => {
    if (Notification.permission !== 'granted') return

    const icon = getNotificationIcon(notification.type)
    
    new Notification(notification.title, {
      body: notification.message,
      icon,
      badge: '/badge.png',
      tag: notification.id,
      requireInteraction: false,
    })
  }

  // 移除通知
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // 清空所有通知
  const clearAll = () => {
    setNotifications([])
  }

  // 快捷方法
  const info = (title: string, message: string) => 
    addNotification({ type: 'info', title, message })

  const success = (title: string, message: string) => 
    addNotification({ type: 'success', title, message })

  const warning = (title: string, message: string) => 
    addNotification({ type: 'warning', title, message })

  const error = (title: string, message: string) => 
    addNotification({ type: 'error', title, message })

  const achievement = (title: string, message: string, icon = '🏆') => 
    addNotification({ type: 'achievement', title, message, icon, duration: 8000 })

  const birthday = (title: string, message: string) => 
    addNotification({ type: 'birthday', title, message, icon = '🎂', duration: 10000 })

  return {
    notifications,
    permission,
    requestPermission,
    addNotification,
    removeNotification,
    clearAll,
    info,
    success,
    warning,
    error,
    achievement,
    birthday,
    NotificationPanel: () => (
      <NotificationPanel 
        notifications={notifications} 
        onClose={removeNotification}
        onClear={clearAll}
      />
    ),
  }
}

// 获取通知图标
function getNotificationIcon(type: NotificationType): string {
  const icons: Record<NotificationType, string> = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    achievement: '🏆',
    birthday: '🎂',
  }
  return icons[type]
}

// 通知面板组件
function NotificationPanel({ 
  notifications, 
  onClose,
  onClear,
}: {
  notifications: Notification[]
  onClose: (id: string) => void
  onClear: () => void
}) {
  if (notifications.length === 0) return null

  return (
    <div className="fixed top-20 right-6 z-[400] w-96 max-h-[60vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-gray-600">通知</h3>
        <button 
          onClick={onClear}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          清空全部
        </button>
      </div>

      <div className="space-y-2">
        {notifications.map((notification) => (
          <NotificationItem 
            key={notification.id} 
            notification={notification}
            onClose={() => onClose(notification.id)}
          />
        ))}
      </div>
    </div>
  )
}

// 单个通知组件
function NotificationItem({ 
  notification, 
  onClose,
}: {
  notification: Notification
  onClose: () => void
}) {
  const [isLeaving, setIsLeaving] = useState(false)

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(onClose, 300)
  }

  const bgColor = {
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
    achievement: 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300',
    birthday: 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-300',
  }[notification.type]

  return (
    <div 
      className={`card border-l-4 ${bgColor} shadow-lg transition-all duration-300 ${
        isLeaving ? 'opacity-0 transform translate-x-full' : 'opacity-100'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{notification.icon || getNotificationIcon(notification.type)}</span>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-800 text-sm">{notification.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="mt-2 text-sm text-starlight-600 hover:text-starlight-700 font-semibold"
            >
              {notification.action.label}
            </button>
          )}
        </div>

        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          ×
        </button>
      </div>
    </div>
  )
}

// 通知铃铛按钮
export function NotificationBell({ count }: { count: number }) {
  return (
    <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
      <span className="text-2xl">🔔</span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}

export default useNotificationSystem
