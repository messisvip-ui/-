// 音效系统
// 使用 Web Audio API 实现，无需外部音频文件

class SoundManager {
  private audioContext: AudioContext | null = null
  private enabled: boolean = true
  private volume: number = 0.5

  constructor() {
    // 延迟初始化 AudioContext（需要用户交互后才能创建）
    this.init()
  }

  private init() {
    const initAudio = () => {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        // 移除事件监听
        document.removeEventListener('click', initAudio)
        document.removeEventListener('touchstart', initAudio)
      }
    }

    document.addEventListener('click', initAudio, { once: true })
    document.addEventListener('touchstart', initAudio, { once: true })
  }

  // 播放合成音效
  play(type: SoundType, options?: SoundOptions) {
    if (!this.enabled || !this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    const config = SOUND_CONFIG[type]
    const { duration = 0.2, frequency = 440, type: waveType = 'sine' } = options || {}

    oscillator.type = waveType
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
    
    // 音量包络
    gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  // 播放和弦（更丰富的音效）
  playChord(type: SoundType) {
    if (!this.enabled || !this.audioContext) return

    const config = SOUND_CONFIG[type]
    const frequencies = config.chord || [config.frequency]

    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        this.play(type, { frequency: freq })
      }, i * 50)
    })
  }

  // 启用/禁用音效
  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  // 设置音量
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  // 获取状态
  getStatus() {
    return {
      enabled: this.enabled,
      volume: this.volume,
      initialized: !!this.audioContext,
    }
  }
}

// 音效配置
interface SoundConfig {
  frequency: number
  duration: number
  type?: OscillatorType
  chord?: number[]
}

interface SoundOptions {
  frequency?: number
  duration?: number
  type?: OscillatorType
}

type SoundType = 
  | 'starlight'      // 星光获得
  | 'praise'         // 赞赏收到
  | 'complete'       // 任务完成
  | 'evolution'      // 精灵进化
  | 'click'          // 按钮点击
  | 'unlock'         // 解锁成就
  | 'birthday'       // 生日庆祝
  | 'error'          // 错误提示
  | 'levelup'        // 升级

const SOUND_CONFIG: Record<SoundType, SoundConfig> = {
  starlight: {
    frequency: 880,
    duration: 0.3,
    type: 'sine',
    chord: [880, 1100, 1320], // 和弦
  },
  praise: {
    frequency: 660,
    duration: 0.4,
    type: 'sine',
    chord: [660, 880, 1100],
  },
  complete: {
    frequency: 523,
    duration: 0.5,
    type: 'triangle',
    chord: [523, 659, 784, 1047], // 大调和弦
  },
  evolution: {
    frequency: 392,
    duration: 1.5,
    type: 'sine',
    chord: [392, 494, 587, 784, 988], // 华丽的上行音阶
  },
  click: {
    frequency: 440,
    duration: 0.1,
    type: 'sine',
  },
  unlock: {
    frequency: 587,
    duration: 0.6,
    type: 'triangle',
    chord: [587, 740, 880, 1175],
  },
  birthday: {
    frequency: 523,
    duration: 2.0,
    type: 'sine',
    chord: [523, 659, 784, 1047, 1319], // 生日歌风格
  },
  error: {
    frequency: 196,
    duration: 0.3,
    type: 'sawtooth',
    chord: [196, 185], // 下行
  },
  levelup: {
    frequency: 440,
    duration: 0.8,
    type: 'triangle',
    chord: [440, 554, 659, 880], // 上行
  },
}

// 单例模式
let soundManager: SoundManager | null = null

export function getSoundManager(): SoundManager {
  if (!soundManager) {
    soundManager = new SoundManager()
  }
  return soundManager
}

// 快捷播放函数
export function playSound(type: SoundType) {
  getSoundManager().play(type)
}

export function playChord(type: SoundType) {
  getSoundManager().playChord(type)
}

// React Hook
import { useEffect } from 'react'

export function useSound() {
  const sound = getSoundManager()

  useEffect(() => {
    return () => {
      // 清理
      if (sound.getStatus().initialized) {
        sound.audioContext?.close()
      }
    }
  }, [])

  return {
    play: (type: SoundType) => sound.play(type),
    playChord: (type: SoundType) => sound.playChord(type),
    setEnabled: (enabled: boolean) => sound.setEnabled(enabled),
    setVolume: (volume: number) => sound.setVolume(volume),
    getStatus: () => sound.getStatus(),
  }
}

export default SoundManager
