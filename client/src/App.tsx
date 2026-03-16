import { Routes, Route } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

// 页面组件
import Home from './pages/Home'
import Forest from './pages/Forest'
import TaskBoard from './pages/TaskBoard'
import Profile from './pages/Profile'
import BondingCeremony from './pages/BondingCeremony'

// UI 层组件
import Navigation from './components/Navigation'
import LoadingScreen from './components/LoadingScreen'

function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 3D 场景层 */}
      <div id="canvas-container">
        <Canvas
          camera={{ position: [0, 2, 5], fov: 60 }}
          shadows
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            {/* 全局光照 */}
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1}
              castShadow
              shadow-mapSize={[2048, 2048]}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI 层 */}
      <div id="ui-layer" className="w-full h-full">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forest" element={<Forest />} />
          <Route path="/tasks" element={<TaskBoard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bonding" element={<BondingCeremony />} />
        </Routes>
        <LoadingScreen />
      </div>
    </div>
  )
}

export default App
