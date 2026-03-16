# 系统模块文档

本项目包含多个可复用的系统模块，提供游戏化功能支持。

---

## 📚 系统模块列表

### 1. 成就系统 (`achievements.ts`)

**功能**: 管理玩家成就解锁、展示和统计

**核心 API**:
```typescript
import { ACHIEVEMENTS, checkAchievements } from '@/systems/achievements'

// 检查成就解锁
const unlocked = checkAchievements(gameState)

// 成就数据结构
interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'learning' | 'social' | 'exploration' | 'special'
  condition: (state: any) => boolean
  reward: { starlight: number; title?: string }
}
```

**使用示例**:
```tsx
import AchievementSystem from '@/components/AchievementSystem'

function App() {
  return <AchievementSystem />
}
```

---

### 2. 音效系统 (`sound.ts`)

**功能**: 合成音效播放，无需外部音频文件

**核心 API**:
```typescript
import { playSound, playChord, useSound } from '@/systems/sound'

// 快捷播放
playSound('starlight')
playChord('complete')

// Hook 方式
const { play, setVolume, setEnabled } = useSound()
```

**音效类型**:
- `starlight` - 星光获得
- `praise` - 赞赏收到
- `complete` - 任务完成
- `evolution` - 精灵进化
- `click` - 按钮点击
- `unlock` - 解锁成就
- `birthday` - 生日庆祝
- `levelup` - 升级

---

### 3. 设备检测 (`deviceDetect.ts`)

**功能**: 检测设备类型、屏幕尺寸、性能等级

**核心 API**:
```typescript
import useDeviceDetect, { useBreakpoint, usePerformanceMode } from '@/systems/deviceDetect'

const device = useDeviceDetect()
// { isMobile, isTablet, isDesktop, isTouch, platform, screenWidth, screenHeight }

const breakpoint = useBreakpoint()
// { isSM, isMD, isLG, isXL, currentBreakpoint }

const performance = usePerformanceMode()
// { quality, isLowQuality, setQuality }
```

---

### 4. 离线支持 (`offline.ts`)

**功能**: 网络状态监测、离线队列、本地存储

**核心 API**:
```typescript
import useNetworkStatus, { useOfflineQueue, useOfflineStorage } from '@/systems/offline'

// 网络状态
const { online, offline, downlink, effectiveType } = useNetworkStatus()

// 离线队列
const { enqueue, dequeue, queueLength, hasPendingActions } = useOfflineQueue()
const actionId = enqueue('complete-task', { taskId: '123' })

// 离线存储
const [value, setValue] = useOfflineStorage('key', initialValue)
```

---

### 5. 性能监控 (`performance.ts`)

**功能**: FPS 监测、内存使用、性能建议

**核心 API**:
```typescript
import usePerformanceMetrics, { PerformancePanel } from '@/systems/performance'

const metrics = usePerformanceMetrics()
// { fps, memory, loadTime, firstPaint }

// 性能面板组件
<PerformancePanel />
```

---

### 6. 天气系统 (`weather.ts`)

**功能**: 模拟天气变化、时间系统、环境特效

**核心 API**:
```typescript
import useWeatherSystem, { getWeatherTips, getTimeGreeting } from '@/systems/weather'

const { weather, time, WeatherEffects } = useWeatherSystem()

// 天气提示
const tip = getWeatherTips(weather) // "☀️ 阳光明媚，适合外出探索森林！"

// 时间问候
const greeting = getTimeGreeting(time.timeOfDay) // "☀️ 上午好！今天也要加油哦！"
```

---

### 7. 表情包系统 (`emotes.ts`)

**功能**: 表情解锁、使用、展示

**核心 API**:
```typescript
import useEmoteSystem, { EMOTES } from '@/systems/emotes'

const { 
  unlockedEmotes, 
  recentEmotes, 
  useEmote, 
  EmotePanel 
} = useEmoteSystem()

// 使用表情
useEmote('happy')
```

**表情分类**:
- `emotion` - 情感类 (开心、兴奋、喜爱等)
- `action` - 动作类 (挥手、鼓掌、点赞等)
- `special` - 特殊类 (星光、皇冠、奖杯等)

---

### 8. 通知系统 (`notifications.ts`)

**功能**: 应用内通知、系统通知推送

**核心 API**:
```typescript
import useNotificationSystem from '@/systems/notifications'

const { 
  notifications,
  info,
  success,
  warning,
  error,
  achievement,
  birthday,
  NotificationPanel,
} = useNotificationSystem()

// 发送通知
success('任务完成', '获得 20 星光奖励！')
achievement('成就解锁', '连续 7 天签到！')
birthday('生日快乐', '今天是你的特别日子！')
```

---

## 🔧 使用指南

### 在组件中使用多个系统

```tsx
import { useSound } from '@/systems/sound'
import useNotificationSystem from '@/systems/notifications'
import { useEmoteSystem } from '@/systems/emotes'

function TaskCompleteButton({ taskId }: { taskId: string }) {
  const { playChord } = useSound()
  const { success } = useNotificationSystem()
  const { useEmote } = useEmoteSystem()

  const handleComplete = () => {
    // 完成任务逻辑
    completeTask(taskId)
    
    // 播放音效
    playChord('complete')
    
    // 发送通知
    success('任务完成', '获得 20 星光！')
    
    // 使用表情
    useEmote('excited')
  }

  return <button onClick={handleComplete}>完成任务</button>
}
```

---

## 📊 性能建议

### 音效系统
- 首次播放需要用户交互才能初始化 AudioContext
- 建议在游戏开始时播放一次测试音

### 设备检测
- 根据设备性能调整 3D 渲染质量
- 移动端减少粒子数量

### 离线支持
- 重要操作先存入本地存储
- 网络恢复后自动同步

### 性能监控
- 开发环境显示性能面板
- 生产环境仅记录关键指标

---

## 🎯 最佳实践

1. **统一状态管理**: 所有系统状态通过 Zustand 集中管理
2. **懒加载**: 大型系统组件按需加载
3. **错误处理**: 所有系统都有降级方案
4. **可访问性**: 支持键盘操作和屏幕阅读器

---

## 📝 更新日志

### v0.2.0 (2026-03-16)
- ✅ 新增音效系统
- ✅ 新增设备检测
- ✅ 新增离线支持
- ✅ 新增性能监控
- ✅ 新增天气系统
- ✅ 新增表情包系统
- ✅ 新增通知系统

---

更多系统模块开发中...
