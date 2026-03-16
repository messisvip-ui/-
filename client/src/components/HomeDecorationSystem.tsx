import { useState } from 'react'
import { motion } from 'framer-motion'

// 装饰品定义
export interface Decoration {
  id: string
  name: string
  icon: string
  price: number
  description: string
  category: 'plant' | 'furniture' | 'light' | 'special'
}

export const DECORATIONS: Decoration[] = [
  // 植物类
  { id: 'flower_bed', name: '小花坛', icon: '🌸', price: 50, description: '增加温馨度', category: 'plant' },
  { id: 'small_tree', name: '小树苗', icon: '🌳', price: 80, description: '生机勃勃', category: 'plant' },
  { id: 'rose_bush', name: '玫瑰丛', icon: '🌹', price: 100, description: '浪漫气息', category: 'plant' },
  { id: 'sunflower', name: '向日葵', icon: '🌻', price: 60, description: '阳光向上', category: 'plant' },
  { id: 'mushroom', name: '小蘑菇', icon: '🍄', price: 40, description: '可爱装饰', category: 'plant' },

  // 家具类
  { id: 'bench', name: '长椅', icon: '🪑', price: 60, description: '可以坐下休息', category: 'furniture' },
  { id: 'table', name: '小桌子', icon: '🪵', price: 70, description: '放置物品', category: 'furniture' },
  { id: 'fountain', name: '小喷泉', icon: '⛲', price: 100, description: '增加活力度', category: 'furniture' },
  { id: 'swing', name: '秋千', icon: '🎠', price: 120, description: '可以荡秋千', category: 'furniture' },
  { id: 'tent', name: '小帐篷', icon: '⛺', price: 90, description: '秘密基地', category: 'furniture' },

  // 灯光类
  { id: 'street_light', name: '星光路灯', icon: '💡', price: 80, description: '夜间发光', category: 'light' },
  { id: 'lantern', name: '灯笼', icon: '🏮', price: 50, description: '温暖光芒', category: 'light' },
  { id: 'firefly_jar', name: '萤火虫瓶', icon: '🫙', price: 60, description: '梦幻光芒', category: 'light' },
  { id: 'crystal_lamp', name: '水晶灯', icon: '💎', price: 150, description: '华丽装饰', category: 'light' },

  // 特殊类
  { id: 'wind_chime', name: '风铃', icon: '🎐', price: 40, description: '微风吹动有声音', category: 'special' },
  { id: 'treasure_chest', name: '宝箱', icon: '📦', price: 200, description: '神秘宝藏', category: 'special' },
  { id: 'statue', name: '精灵雕像', icon: '🗿', price: 300, description: '纪念意义', category: 'special' },
  { id: 'telescope', name: '望远镜', icon: '🔭', price: 180, description: '仰望星空', category: 'special' },
  { id: 'bookshelf', name: '书架', icon: '📚', price: 100, description: '知识象征', category: 'special' },
]

export default function HomeDecorationSystem() {
  const { ownedDecorations, placedDecorations, starlight, buyDecoration, placeDecoration } = useDecorationStore()
  const [showShop, setShowShop] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', 'plant', 'furniture', 'light', 'special']

  const filteredDecorations = selectedCategory === 'all'
    ? DECORATIONS
    : DECORATIONS.filter(d => d.category === selectedCategory)

  return {
    showShop,
    setShowShop,
    DecorationShop: () => (
      <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">🏠 家园装饰商店</h2>
            <button
              onClick={() => setShowShop(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* 星光余额 */}
          <div className="mb-6 p-4 bg-starlight-50 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">当前星光</span>
              <span className="text-2xl font-bold text-starlight-600">⭐ {starlight}</span>
            </div>
          </div>

          {/* 分类选择 */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-starlight-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' && '📋 全部'}
                {cat === 'plant' && '🌿 植物'}
                {cat === 'furniture' && '🪑 家具'}
                {cat === 'light' && '💡 灯光'}
                {cat === 'special' && '🌟 特殊'}
              </button>
            ))}
          </div>

          {/* 装饰品列表 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDecorations.map((decoration) => {
              const isOwned = ownedDecorations.includes(decoration.id)
              const canAfford = starlight >= decoration.price

              return (
                <div key={decoration.id} className="card hover:shadow-xl transition-shadow">
                  <div className="text-center mb-3">
                    <span className="text-5xl">{decoration.icon}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-center mb-1">
                    {decoration.name}
                  </h3>
                  <p className="text-sm text-gray-500 text-center mb-3">
                    {decoration.description}
                  </p>
                  
                  {isOwned ? (
                    <button
                      onClick={() => placeDecoration(decoration.id)}
                      className="w-full btn-secondary"
                    >
                      放置
                    </button>
                  ) : (
                    <button
                      onClick={() => buyDecoration(decoration.id)}
                      disabled={!canAfford}
                      className={`w-full btn-primary ${!canAfford ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      ⭐ {decoration.price}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    ),
  }
}

// 装饰商店 Zustand
import { create } from 'zustand'

interface DecorationStore {
  starlight: number
  ownedDecorations: string[]
  placedDecorations: { id: string; decorationId: string; x: number; y: number }[]
  
  buyDecoration: (decorationId: string) => void
  placeDecoration: (decorationId: string) => void
  removeDecoration: (placementId: string) => void
  setStarlight: (amount: number) => void
}

export const useDecorationStore = create<DecorationStore>((set) => ({
  starlight: 1000,
  ownedDecorations: [],
  placedDecorations: [],

  buyDecoration: (decorationId) => {
    const decoration = DECORATIONS.find(d => d.id === decorationId)
    if (!decoration) return

    set((state) => {
      if (state.starlight < decoration.price) return state
      if (state.ownedDecorations.includes(decorationId)) return state

      return {
        starlight: state.starlight - decoration.price,
        ownedDecorations: [...state.ownedDecorations, decorationId],
      }
    })
  },

  placeDecoration: (decorationId) => {
    set((state) => {
      const newPlacement = {
        id: `placement-${Date.now()}`,
        decorationId,
        x: Math.random() * 10,
        y: Math.random() * 10,
      }
      return {
        placedDecorations: [...state.placedDecorations, newPlacement],
      }
    })
  },

  removeDecoration: (placementId) => {
    set((state) => ({
      placedDecorations: state.placedDecorations.filter(p => p.id !== placementId),
    }))
  },

  setStarlight: (amount) => set({ starlight: amount }),
}))
