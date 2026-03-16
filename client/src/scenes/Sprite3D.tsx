import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

interface Sprite3DProps {
  form: string
  element: string
  color: string
  position?: [number, number, number]
  scale?: number
  isAnimating?: boolean
}

export default function Sprite3D({ 
  form, 
  element, 
  color,
  position = [0, 0, 0],
  scale = 1,
  isAnimating = true 
}: Sprite3DProps) {
  const meshRef = useRef<THREE.Group>(null)
  
  // 根据元素类型获取颜色
  const getElementColor = () => {
    const colors: Record<string, string> = {
      light: '#f5d67b',
      forest: '#4bb78d',
      star: '#9274ff',
      wind: '#87ceeb',
      water: '#6bb6ff',
    }
    return colors[element] || '#ffffff'
  }

  // 根据形态获取几何体
  const getFormGeometry = () => {
    switch (form) {
      case 'seedling':
        return (
          <group>
            {/* 幼苗主体 */}
            <mesh position={[0, 0.2, 0]}>
              <capsuleGeometry args={[0.15, 0.4, 4, 8]} />
              <meshStandardMaterial 
                color={getElementColor()} 
                emissive={getElementColor()}
                emissiveIntensity={0.5}
                transparent
                opacity={0.9}
              />
            </mesh>
            {/* 小叶子 */}
            <mesh position={[0.12, 0.3, 0]} rotation={[0, 0, -0.5]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#4bb78d" emissive="#4bb78d" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[-0.12, 0.35, 0]} rotation={[0, 0, 0.5]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial color="#4bb78d" emissive="#4bb78d" emissiveIntensity={0.3} />
            </mesh>
          </group>
        )
      
      case 'bloom':
        return (
          <group>
            {/* 花茎 */}
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.05, 0.08, 0.6, 8]} />
              <meshStandardMaterial color="#4bb78d" />
            </mesh>
            {/* 花瓣 */}
            {[0, 1, 2, 3, 4].map((i) => (
              <mesh 
                key={i}
                position={[
                  Math.cos((i / 5) * Math.PI * 2) * 0.2,
                  0.6,
                  Math.sin((i / 5) * Math.PI * 2) * 0.2
                ]}
                rotation={[0.5, (i / 5) * Math.PI * 2, 0]}
              >
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshStandardMaterial 
                  color={getElementColor()} 
                  emissive={getElementColor()}
                  emissiveIntensity={0.6}
                />
              </mesh>
            ))}
            {/* 花蕊 */}
            <mesh position={[0, 0.65, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color="#f5d67b" emissive="#f5d67b" emissiveIntensity={0.8} />
            </mesh>
          </group>
        )
      
      case 'tree':
        return (
          <group>
            {/* 树干 */}
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.1, 0.15, 0.8, 8]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
            {/* 树冠 */}
            <mesh position={[0, 0.9, 0]}>
              <dodecahedronGeometry args={[0.5, 0]} />
              <meshStandardMaterial 
                color="#4bb78d" 
                emissive="#4bb78d"
                emissiveIntensity={0.3}
              />
            </mesh>
            {/* 装饰光点 */}
            {[0, 1, 2].map((i) => (
              <mesh 
                key={i}
                position={[
                  Math.cos((i / 3) * Math.PI * 2) * 0.3,
                  0.8 + Math.random() * 0.3,
                  Math.sin((i / 3) * Math.PI * 2) * 0.3
                ]}
              >
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial color="#f5d67b" emissive="#f5d67b" emissiveIntensity={1} />
              </mesh>
            ))}
          </group>
        )
      
      case 'crystal':
        return (
          <group>
            {/* 水晶主体 */}
            <mesh position={[0, 0.3, 0]}>
              <octahedronGeometry args={[0.3, 0]} />
              <meshStandardMaterial 
                color={getElementColor()} 
                emissive={getElementColor()}
                emissiveIntensity={0.8}
                transparent
                opacity={0.7}
              />
            </mesh>
            {/* 底座 */}
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.15, 0.2, 0.2, 8]} />
              <meshStandardMaterial color="#666" />
            </mesh>
          </group>
        )
      
      case 'dragon':
        return (
          <group>
            {/* 身体 */}
            <mesh position={[0, 0.4, 0]}>
              <capsuleGeometry args={[0.12, 0.5, 4, 8]} />
              <meshStandardMaterial 
                color={getElementColor()} 
                emissive={getElementColor()}
                emissiveIntensity={0.5}
              />
            </mesh>
            {/* 头部 */}
            <mesh position={[0, 0.75, 0.1]}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial color={getElementColor()} />
            </mesh>
            {/* 眼睛 */}
            <mesh position={[0.06, 0.78, 0.18]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
            </mesh>
            <mesh position={[-0.06, 0.78, 0.18]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
            </mesh>
            {/* 翅膀 */}
            <mesh position={[0.2, 0.5, 0]} rotation={[0, 0, -0.5]}>
              <boxGeometry args={[0.3, 0.02, 0.2]} />
              <meshStandardMaterial color={getElementColor()} transparent opacity={0.7} />
            </mesh>
            <mesh position={[-0.2, 0.5, 0]} rotation={[0, 0, 0.5]}>
              <boxGeometry args={[0.3, 0.02, 0.2]} />
              <meshStandardMaterial color={getElementColor()} transparent opacity={0.7} />
            </mesh>
            {/* 尾巴 */}
            <mesh position={[0, 0.2, -0.2]} rotation={[0.3, 0, 0]}>
              <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
              <meshStandardMaterial color={getElementColor()} />
            </mesh>
          </group>
        )
      
      default:
        return (
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color={getElementColor()} emissive={getElementColor()} emissiveIntensity={0.5} />
          </mesh>
        )
    }
  }

  // 动画
  useFrame((state) => {
    if (meshRef.current && isAnimating) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <group ref={meshRef} position={position} scale={[scale, scale, scale]}>
      {getFormGeometry()}
      {/* 粒子特效 */}
      <Sparkles
        count={20}
        scale={[1.5, 1.5, 1.5]}
        size={2}
        speed={0.3}
        opacity={0.5}
        color={getElementColor()}
      />
      {/* 环境光 */}
      <pointLight
        position={[0, 0.5, 0]}
        intensity={0.5}
        color={getElementColor()}
        distance={3}
      />
    </group>
  )
}
