import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Sprite3D from '@/scenes/Sprite3D'
import { useGameStore } from '@/store/gameStore-demo'
import { IntimacyProgressBar, UnlockedAnimations } from '@/components/EvolutionSystem'

export default function Profile() {
  const { currentStudent, sprite, receivedPraises, isInitialized } = useGameStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return null // LoadingScreen 会显示
  }

  if (!isInitialized || !currentStudent || !sprite) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl">请先访问首页初始化</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">
          👤 个人主页
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 左侧：3D 精灵展示 */}
          <div className="card overflow-hidden p-0">
            <div className="h-80 bg-gradient-to-br from-starlight-100 to-forest-100">
              <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <Sprite3D
                  form={sprite.form}
                  element={sprite.element}
                  color={sprite.color}
                  position={[0, 0, 0]}
                  scale={1.5}
                />
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  autoRotate
                  autoRotateSpeed={2}
                />
              </Canvas>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{sprite.name}</h2>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-starlight-500 text-white rounded-full text-sm">
                  {sprite.element === 'light' && '✨ 光元素'}
                  {sprite.element === 'forest' && '🌿 森元素'}
                  {sprite.element === 'star' && '⭐ 星元素'}
                  {sprite.element === 'wind' && '💨 风元素'}
                  {sprite.element === 'water' && '💧 水元素'}
                </span>
                <span className="px-3 py-1 bg-pink-500 text-white rounded-full text-sm">
                  Lv.{sprite.intimacyLevel}
                </span>
              </div>

              <IntimacyProgressBar 
                currentLevel={sprite.intimacyLevel} 
                currentExp={sprite.intimacyExp || 0} 
              />

              <div className="mt-4">
                <UnlockedAnimations animations={sprite.unlockedAnimations || ['idle', 'happy']} />
              </div>
            </div>
          </div>

          {/* 右侧：统计信息 */}
          <div className="space-y-6">
            {/* 基础统计 */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📊 数据统计</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-starlight-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">总星光</p>
                  <p className="text-3xl font-bold text-starlight-600">{currentStudent.totalStarlight}</p>
                </div>
                <div className="p-4 bg-pink-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">亲密度等级</p>
                  <p className="text-3xl font-bold text-pink-600">Lv.{sprite.intimacyLevel}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">当前形态</p>
                  <p className="text-lg font-bold text-gray-800">
                    {sprite.form === 'seedling' && '🌱 幼苗'}
                    {sprite.form === 'bloom' && '🌸 开花'}
                    {sprite.form === 'tree' && '🌳 参天'}
                    {sprite.form === 'crystal' && '💎 水晶'}
                    {sprite.form === 'dragon' && '🐉 神龙'}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">解锁动作</p>
                  <p className="text-3xl font-bold text-green-600">{sprite.unlockedAnimations?.length || 2}</p>
                </div>
              </div>
            </div>

            {/* 成就徽章 */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🏆 成就徽章</h3>
              {currentStudent.achievements.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  还没有获得成就徽章，继续努力吧！
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {currentStudent.achievements.map((achievement, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold"
                    >
                      🏆 {achievement}
                    </motion.span>
                  ))}
                </div>
              )}
            </div>

            {/* 收到的赞赏 */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-800 mb-4">💖 收到的赞赏</h3>
              {receivedPraises.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  还没有收到赞赏，多和同学们互动吧！
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {receivedPraises.slice(-10).reverse().map((praise) => (
                    <motion.div
                      key={praise.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 bg-pink-50 rounded-lg"
                    >
                      <p className="text-sm text-gray-700">{praise.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        — {praise.fromStudentName} • {new Date(praise.createdAt).toLocaleDateString('zh-CN')}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
