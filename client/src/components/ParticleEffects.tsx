import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  type: 'star' | 'heart' | 'sparkle'
}

export default function ParticleEffects() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    // 监听自定义事件来触发粒子效果
    const handleParticleEvent = (event: CustomEvent<{ type: string; x: number; y: number }>) => {
      const { type, x, y } = event.detail
      const newParticles: Particle[] = Array.from({ length: 10 }, (_, i) => ({
        id: Date.now() + i,
        x: x + (Math.random() - 0.5) * 50,
        y: y + (Math.random() - 0.5) * 50,
        type: type as 'star' | 'heart' | 'sparkle',
      }))
      
      setParticles((prev) => [...prev, ...newParticles])
      
      // 清理粒子
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)))
      }, 1500)
    }

    window.addEventListener('particle-effect' as any, handleParticleEvent as any)
    return () => window.removeEventListener('particle-effect' as any, handleParticleEvent as any)
  }, [])

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 1, scale: 0, y: particle.y }}
          animate={{ 
            opacity: 0, 
            scale: [0, 1.5, 1],
            y: particle.y - 100,
            x: particle.x + (Math.random() - 0.5) * 100,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="fixed pointer-events-none z-[300] text-2xl"
          style={{ left: particle.x, top: particle.y }}
        >
          {particle.type === 'star' && '⭐'}
          {particle.type === 'heart' && '💖'}
          {particle.type === 'sparkle' && '✨'}
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

// 触发粒子效果的辅助函数
export function triggerParticleEffect(type: 'star' | 'heart' | 'sparkle', x?: number, y?: number) {
  const event = new CustomEvent('particle-effect', {
    detail: {
      type,
      x: x || window.innerWidth / 2,
      y: y || window.innerHeight / 2,
    },
  })
  window.dispatchEvent(event)
}
