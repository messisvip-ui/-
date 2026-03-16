import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'

export default function ForestScene() {
  const groupRef = useRef<THREE.Group>(null)

  // 生成树木
  const trees = Array.from({ length: 15 }, (_, i) => ({
    position: [
      (Math.random() - 0.5) * 40,
      0,
      (Math.random() - 0.5) * 40,
    ] as [number, number, number],
    scale: 0.8 + Math.random() * 0.6,
    color: `hsl(${140 + Math.random() * 40}, ${60 + Math.random() * 20}%, ${30 + Math.random() * 20}%)`,
  }))

  // 生成石头
  const rocks = Array.from({ length: 8 }, (_, i) => ({
    position: [
      (Math.random() - 0.5) * 30,
      0,
      (Math.random() - 0.5) * 30,
    ] as [number, number, number],
    scale: 0.5 + Math.random() * 0.8,
  }))

  // 生成萤火虫
  const fireflies = Array.from({ length: 30 }, (_, i) => ({
    position: [
      (Math.random() - 0.5) * 30,
      0.5 + Math.random() * 2,
      (Math.random() - 0.5) * 30,
    ] as [number, number, number],
    speed: 0.5 + Math.random() * 0.5,
    offset: Math.random() * Math.PI * 2,
  }))

  return (
    <group ref={groupRef}>
      {/* 地面 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <circleGeometry args={[30, 64]} />
        <meshStandardMaterial color="#2d5a3d" />
      </mesh>

      {/* 草地装饰 */}
      {Array.from({ length: 100 }, (_, i) => {
        const angle = (i / 100) * Math.PI * 2
        const radius = 5 + Math.random() * 20
        return (
          <mesh
            key={`grass-${i}`}
            position={[
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius,
            ]}
            rotation={[Math.random() * 0.2, Math.random() * Math.PI * 2, 0]}
          >
            <coneGeometry args={[0.05, 0.3, 4]} />
            <meshStandardMaterial color="#4a7c59" />
          </mesh>
        )
      })}

      {/* 树木 */}
      {trees.map((tree, i) => (
        <group key={`tree-${i}`} position={tree.position} scale={[tree.scale, tree.scale, tree.scale]}>
          {/* 树干 */}
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
            <meshStandardMaterial color="#5d4037" />
          </mesh>
          {/* 树冠 */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <dodecahedronGeometry args={[1.2, 0]} />
            <meshStandardMaterial color={tree.color} />
          </mesh>
          <mesh position={[0, 3.2, 0]} castShadow>
            <dodecahedronGeometry args={[0.9, 0]} />
            <meshStandardMaterial color={tree.color} transparent opacity={0.9} />
          </mesh>
        </group>
      ))}

      {/* 石头 */}
      {rocks.map((rock, i) => (
        <mesh
          key={`rock-${i}`}
          position={rock.position}
          scale={[rock.scale, rock.scale * 0.6, rock.scale]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#666" />
        </mesh>
      ))}

      {/* 萤火虫 */}
      {fireflies.map((firefly, i) => (
        <Firefly
          key={`firefly-${i}`}
          position={firefly.position}
          speed={firefly.speed}
          offset={firefly.offset}
        />
      ))}

      {/* 区域粒子效果 */}
      <Sparkles
        count={50}
        scale={[25, 10, 25]}
        size={3}
        speed={0.2}
        opacity={0.3}
        color="#9274ff"
        position={[0, 1, 0]}
      />

      {/* 环境光 */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      
      {/* 补光 */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
        color="#9274ff"
      />
    </group>
  )
}

// 萤火虫组件
function Firefly({ position, speed, offset }: { 
  position: [number, number, number]
  speed: number
  offset: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      meshRef.current.position.x = position[0] + Math.sin(time * speed + offset) * 2
      meshRef.current.position.y = position[1] + Math.cos(time * speed * 1.5 + offset) * 0.5
      meshRef.current.position.z = position[2] + Math.sin(time * speed * 0.8 + offset) * 2
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial 
        color="#f5d67b" 
        emissive="#f5d67b" 
        emissiveIntensity={2}
      />
      <pointLight intensity={0.5} color="#f5d67b" distance={2} />
    </mesh>
  )
}
