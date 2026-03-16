import { useEffect, useState } from 'react'

export interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isTouch: boolean
  platform: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown'
  screenWidth: number
  screenHeight: number
  pixelRatio: number
}

export function useDeviceDetect(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouch: false,
    platform: 'unknown',
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
  })

  useEffect(() => {
    const detectDevice = () => {
      const ua = navigator.userAgent
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight

      // 检测平台
      let platform: DeviceInfo['platform'] = 'unknown'
      if (/iPad|iPhone|iPod/.test(ua)) platform = 'ios'
      else if (/Android/.test(ua)) platform = 'android'
      else if (/Win/.test(ua)) platform = 'windows'
      else if (/Mac/.test(ua)) platform = 'macos'
      else if (/Linux/.test(ua)) platform = 'linux'

      // 检测设备类型
      const isMobile = screenWidth < 768
      const isTablet = screenWidth >= 768 && screenWidth < 1024
      const isDesktop = screenWidth >= 1024

      // 检测触摸支持
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isTouch,
        platform,
        screenWidth,
        screenHeight,
        pixelRatio: window.devicePixelRatio,
      })
    }

    // 初始检测
    detectDevice()

    // 监听窗口大小变化
    window.addEventListener('resize', detectDevice)

    return () => window.removeEventListener('resize', detectDevice)
  }, [])

  return deviceInfo
}

// 响应式断点 Hook
export function useBreakpoint() {
  const { screenWidth } = useDeviceDetect()

  return {
    isSM: screenWidth >= 640,
    isMD: screenWidth >= 768,
    isLG: screenWidth >= 1024,
    isXL: screenWidth >= 1280,
    is2XL: screenWidth >= 1536,
    currentBreakpoint: 
      screenWidth >= 1536 ? '2xl' :
      screenWidth >= 1280 ? 'xl' :
      screenWidth >= 1024 ? 'lg' :
      screenWidth >= 768 ? 'md' :
      screenWidth >= 640 ? 'sm' : 'xs',
  }
}

// 安全区域 Hook（用于移动端刘海屏）
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  })

  useEffect(() => {
    const updateSafeArea = () => {
      const rootStyles = getComputedStyle(document.documentElement)
      setSafeArea({
        top: parseInt(rootStyles.getPropertyValue('--safe-area-inset-top')) || 0,
        bottom: parseInt(rootStyles.getPropertyValue('--safe-area-inset-bottom')) || 0,
        left: parseInt(rootStyles.getPropertyValue('--safe-area-inset-left')) || 0,
        right: parseInt(rootStyles.getPropertyValue('--safe-area-inset-right')) || 0,
      })
    }

    updateSafeArea()
    window.addEventListener('resize', updateSafeArea)

    return () => window.removeEventListener('resize', updateSafeArea)
  }, [])

  return safeArea
}

// 横竖屏检测
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  )

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      )
    }

    window.addEventListener('resize', updateOrientation)
    window.addEventListener('orientationchange', updateOrientation)

    return () => {
      window.removeEventListener('resize', updateOrientation)
      window.removeEventListener('orientationchange', updateOrientation)
    }
  }, [])

  return orientation
}

// 性能模式 Hook（根据设备性能调整渲染质量）
export function usePerformanceMode() {
  const { isMobile, isTablet } = useDeviceDetect()
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high')

  useEffect(() => {
    if (isMobile) {
      setQuality('low')
    } else if (isTablet) {
      setQuality('medium')
    } else {
      setQuality('high')
    }
  }, [isMobile, isTablet])

  return {
    quality,
    isLowQuality: quality === 'low',
    isMediumQuality: quality === 'medium',
    isHighQuality: quality === 'high',
    setQuality,
  }
}

export default useDeviceDetect
