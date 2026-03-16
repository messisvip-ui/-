import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  fps: number
  memory: {
    usedJSHeapSize: number
    totalJSHeapSize: number
  } | null
  loadTime: number
  firstPaint: number
}

export function usePerformanceMetrics(): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: null,
    loadTime: 0,
    firstPaint: 0,
  })

  useEffect(() => {
    // 计算 FPS
    let frameCount = 0
    let lastTime = performance.now()
    let fps = 60

    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        frameCount = 0
        lastTime = currentTime
        
        setMetrics(prev => ({
          ...prev,
          fps,
          memory: (performance as any).memory ? {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          } : null,
        }))
      }
      
      requestAnimationFrame(measureFPS)
    }

    requestAnimationFrame(measureFPS)

    // 获取页面加载时间
    if (typeof window !== 'undefined') {
      const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (timing) {
        setMetrics(prev => ({
          ...prev,
          loadTime: Math.round(timing.loadEventEnd - timing.startTime),
          firstPaint: Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0),
        }))
      }
    }

    return () => {
      // 清理
    }
  }, [])

  return metrics
}

// 性能优化建议
export function getPerformanceRecommendations(metrics: PerformanceMetrics): string[] {
  const recommendations: string[] = []

  if (metrics.fps < 30) {
    recommendations.push('⚠️ FPS 较低，建议减少 3D 场景复杂度')
  } else if (metrics.fps < 50) {
    recommendations.push('💡 FPS 一般，可以考虑优化渲染')
  }

  if (metrics.memory && metrics.memory.usedJSHeapSize > 50 * 1024 * 1024) {
    recommendations.push('⚠️ 内存使用较高，建议清理未使用的资源')
  }

  if (metrics.loadTime > 3000) {
    recommendations.push('💡 加载时间较长，考虑代码分割和资源优化')
  }

  if (metrics.firstPaint > 1500) {
    recommendations.push('💡 首次渲染较慢，可以优化关键渲染路径')
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ 性能表现良好！')
  }

  return recommendations
}

// 性能监控面板组件
export function PerformancePanel() {
  const metrics = usePerformanceMetrics()
  const [showPanel, setShowPanel] = useState(false)

  const recommendations = getPerformanceRecommendations(metrics)

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white px-4 py-2 rounded-full text-sm opacity-50 hover:opacity-100"
      >
        📊
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-xl shadow-2xl p-4 w-80 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">📊 性能监控</h3>
        <button
          onClick={() => setShowPanel(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">FPS</span>
          <span className={`font-bold ${metrics.fps >= 50 ? 'text-green-600' : metrics.fps >= 30 ? 'text-yellow-600' : 'text-red-600'}`}>
            {metrics.fps}
          </span>
        </div>

        {metrics.memory && (
          <div className="flex justify-between">
            <span className="text-gray-600">内存使用</span>
            <span className="font-bold text-gray-800">
              {Math.round(metrics.memory.usedJSHeapSize / 1024 / 1024)} MB
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-600">加载时间</span>
          <span className="font-bold text-gray-800">{metrics.loadTime} ms</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">首次渲染</span>
          <span className="font-bold text-gray-800">{metrics.firstPaint} ms</span>
        </div>

        {/* 性能建议 */}
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-bold text-gray-800 mb-2">💡 优化建议</h4>
          <ul className="space-y-1">
            {recommendations.map((rec, i) => (
              <li key={i} className="text-gray-600">{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// 低性能模式 Hook
export function useLowPerformanceMode() {
  const [lowPerformance, setLowPerformance] = useState(false)

  useEffect(() => {
    // 检测是否是低性能设备
    const isLowPerformance = 
      navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2 ||
      navigator.deviceMemory && navigator.deviceMemory <= 2

    setLowPerformance(!!isLowPerformance)
  }, [])

  return {
    isLowPerformance: lowPerformance,
    maxParticles: lowPerformance ? 50 : 200,
    maxLights: lowPerformance ? 2 : 5,
    shadowQuality: lowPerformance ? 'low' : 'high',
    textureQuality: lowPerformance ? 'low' : 'high',
  }
}

export default usePerformanceMetrics
