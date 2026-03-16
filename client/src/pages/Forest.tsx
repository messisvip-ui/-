import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, Stars } from '@react-three/drei'
import Sprite3D from '@/scenes/Sprite3D'
import ForestScene from '@/scenes/ForestScene'
import { useGameStore } from '@/store/gameStore-demo'

export default function Forest() {
  const { sprite, classTotalStarlight, unlockedAreas, isInitialized } = useGameStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌲</div>
          <p className="text-white text-xl">正在加载森林...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 5, 15], fov: 60 }}
        shadows
        dpr={[1, 2]}
      >
        {/* 天空和星星 */}
        <Sky
          distance={450000}
          sunPosition={[100, 20, 100]}
          inclination={0.6}
          azimuth={0.25}
        />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* 森林场景 */}
        <ForestScene />

        {/* 如果已有精灵，显示在场景中央 */}
        {sprite && (
          <Sprite3D
            form={sprite.form}
            element={sprite.element}
            color={sprite.color}
            position={[0, 1, 0]}
            scale={2}
          />
        )}

        {/* 相机控制 */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      {/* UI 覆盖层 */}
      <div className="absolute top-24 right-6 z-10">
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-2">🗺️ 森林探索</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span className={unlockedAreas.includes('misty-valley') ? 'text-gray-800' : 'text-gray-400'}>
                晨雾山谷
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={unlockedAreas.includes('star-lake') ? 'text-green-500' : 'text-gray-400'}>
                {unlockedAreas.includes('star-lake') ? '✅' : '🔒'}
              </span>
              <span className={unlockedAreas.includes('star-lake') ? 'text-gray-800' : 'text-gray-400'}>
                星夜湖泊
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={unlockedAreas.includes('cloud-realm') ? 'text-green-500' : 'text-gray-400'}>
                {unlockedAreas.includes('cloud-realm') ? '✅' : '🔒'}
              </span>
              <span className={unlockedAreas.includes('cloud-realm') ? 'text-gray-800' : 'text-gray-400'}>
                云端秘境
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 z-10">
        <div className="card">
          <p className="text-sm text-gray-500">班级星光储备</p>
          <p className="text-2xl font-bold text-forest-600">{classTotalStarlight}</p>
          <p className="text-xs text-gray-400 mt-1">下一区域：{10000 - classTotalStarlight} 星光</p>
        </div>
      </div>
    </div>
  )
}
