import { useEffect, useState } from 'react'

interface NetworkState {
  online: boolean
  offline: boolean
  downlink: number | null
  effectiveType: string | null
  rtt: number | null
  saveData: boolean
}

export function useNetworkStatus(): NetworkState {
  const [state, setState] = useState<NetworkState>({
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    offline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
    downlink: null,
    effectiveType: null,
    rtt: null,
    saveData: false,
  })

  useEffect(() => {
    const updateNetworkState = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

      setState({
        online: navigator.onLine,
        offline: !navigator.onLine,
        downlink: connection?.downlink || null,
        effectiveType: connection?.effectiveType || null,
        rtt: connection?.rtt || null,
        saveData: connection?.saveData || false,
      })
    }

    // 初始状态
    updateNetworkState()

    // 监听网络变化
    window.addEventListener('online', updateNetworkState)
    window.addEventListener('offline', updateNetworkState)

    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener('change', updateNetworkState)
    }

    return () => {
      window.removeEventListener('online', updateNetworkState)
      window.removeEventListener('offline', updateNetworkState)
      if (connection) {
        connection.removeEventListener('change', updateNetworkState)
      }
    }
  }, [])

  return state
}

// 离线存储 Hook
export function useOfflineStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}

// 离线队列 Hook（用于离线操作同步）
interface QueuedAction {
  id: string
  type: string
  payload: any
  timestamp: number
}

export function useOfflineQueue() {
  const [queue, setQueue] = useOfflineStorage<QueuedAction[]>('offline-queue', [])
  const { online } = useNetworkStatus()

  // 添加到队列
  const enqueue = (type: string, payload: any) => {
    const action: QueuedAction = {
      id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      payload,
      timestamp: Date.now(),
    }
    setQueue((prev) => [...prev, action])
    return action.id
  }

  // 从队列移除
  const dequeue = (id: string) => {
    setQueue((prev) => prev.filter((action) => action.id !== id))
  }

  // 清空队列
  const clearQueue = () => {
    setQueue([])
  }

  // 获取队列长度
  const queueLength = queue.length

  // 是否有待同步的操作
  const hasPendingActions = queueLength > 0

  return {
    queue,
    enqueue,
    dequeue,
    clearQueue,
    queueLength,
    hasPendingActions,
    online,
  }
}

// 离线提示组件
export function OfflineIndicator() {
  const { offline } = useNetworkStatus()

  if (!offline) return null

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
      <span className="text-xl">📡</span>
      <span>已离线 - 操作将在网络恢复后同步</span>
    </div>
  )
}

export default useNetworkStatus
