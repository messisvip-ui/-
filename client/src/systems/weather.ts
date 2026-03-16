import { useEffect, useState } from 'react'

// 天气类型
export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' | 'foggy'

// 时间段
export type TimeOfDay = 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night'

interface WeatherState {
  type: WeatherType
  temperature: number
  humidity: number
  windSpeed: number
}

interface TimeState {
  hour: number
  minute: number
  timeOfDay: TimeOfDay
}

export function useWeatherSystem() {
  const [weather, setWeather] = useState<WeatherState>({
    type: 'sunny',
    temperature: 25,
    humidity: 60,
    windSpeed: 3,
  })

  const [time, setTime] = useState<TimeState>({
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
    timeOfDay: 'morning',
  })

  // 更新时间
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hour = now.getHours()
      
      let timeOfDay: TimeOfDay = 'morning'
      if (hour >= 5 && hour < 7) timeOfDay = 'dawn'
      else if (hour >= 7 && hour < 11) timeOfDay = 'morning'
      else if (hour >= 11 && hour < 14) timeOfDay = 'noon'
      else if (hour >= 14 && hour < 17) timeOfDay = 'afternoon'
      else if (hour >= 17 && hour < 19) timeOfDay = 'dusk'
      else timeOfDay = 'night'

      setTime({
        hour,
        minute: now.getMinutes(),
        timeOfDay,
      })
    }

    updateTime()
    const interval = setInterval(updateTime, 60000) // 每分钟更新

    return () => clearInterval(interval)
  }, [])

  // 模拟天气变化（实际可以接入天气 API）
  useEffect(() => {
    const changeWeather = () => {
      const weatherTypes: WeatherType[] = ['sunny', 'cloudy', 'rainy', 'windy']
      const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)]
      
      setWeather(prev => ({
        ...prev,
        type: randomWeather,
        temperature: 20 + Math.floor(Math.random() * 15),
        humidity: 40 + Math.floor(Math.random() * 40),
        windSpeed: Math.floor(Math.random() * 10),
      }))
    }

    // 每 30 分钟模拟一次天气变化
    const interval = setInterval(changeWeather, 1800000)

    return () => clearInterval(interval)
  }, [])

  return {
    weather,
    time,
    WeatherEffects: () => <WeatherEffects weather={weather} time={time} />,
  }
}

// 天气特效组件
function WeatherEffects({ weather, time }: { weather: WeatherState; time: TimeState }) {
  // 根据天气和时间生成不同的视觉效果
  const getSkyColor = () => {
    const { type, temperature } = weather
    const { timeOfDay } = time

    if (timeOfDay === 'night') {
      return 'from-indigo-900 to-purple-900'
    } else if (timeOfDay === 'dawn' || timeOfDay === 'dusk') {
      return 'from-orange-400 to-pink-500'
    } else if (type === 'rainy' || type === 'cloudy') {
      return 'from-gray-400 to-gray-600'
    } else if (temperature > 30) {
      return 'from-blue-400 to-yellow-200'
    } else {
      return 'from-blue-400 to-blue-600'
    }
  }

  // 生成雨滴
  const raindrops = weather.type === 'rainy' 
    ? Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.5 + Math.random() * 0.5,
      }))
    : []

  // 生成雪花
  const snowflakes = weather.type === 'snowy'
    ? Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 2,
      }))
    : []

  return (
    <div className={`fixed inset-0 pointer-events-none transition-colors duration-1000 bg-gradient-to-b ${getSkyColor()} opacity-20`} />
  )
}

// 根据天气给出游戏内提示
export function getWeatherTips(weather: WeatherState): string {
  const tips: Record<WeatherType, string> = {
    sunny: '☀️ 阳光明媚，适合外出探索森林！',
    cloudy: '☁️ 多云天气，精灵们感觉很舒适~',
    rainy: '🌧️ 下雨了，记得提醒学生们带伞哦！',
    snowy: '❄️ 下雪了！森林变得银装素裹~',
    windy: '💨 今天风很大，精灵的翅膀在摇曳~',
    foggy: '🌫️ 起雾了，森林变得神秘起来~',
  }

  return tips[weather.type]
}

// 根据时间给出问候语
export function getTimeGreeting(timeOfDay: TimeOfDay): string {
  const greetings: Record<TimeOfDay, string> = {
    dawn: '🌅 早安，守护者！新的一天开始了~',
    morning: '☀️ 上午好！今天也要加油哦！',
    noon: '🌞 中午好！记得按时吃饭~',
    afternoon: '🌤️ 下午好！继续努力学习吧！',
    dusk: '🌆 傍晚好！辛苦一天了~',
    night: '🌙 晚上好！该休息啦~',
  }

  return greetings[timeOfDay]
}

export default useWeatherSystem
