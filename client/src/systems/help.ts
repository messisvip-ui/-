import { useEffect, useState } from 'react'

// 帮助文档
export interface HelpArticle {
  id: string
  title: string
  category: string
  content: string
  relatedArticles?: string[]
}

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: 'getting-started',
    title: '快速入门',
    category: '基础',
    content: `
## 欢迎来到光之契约·精灵森境！

### 第一步：缔结精灵
首次登录时，你需要选择元素属性并与光之精灵缔结契约。

### 第二步：完成任务
在"星光委托"页面查看并完成任务，获得星光奖励。

### 第三步：装饰家园
用获得的星光购买装饰品，装扮你的专属家园。

### 第四步：探索森林
和班级一起解锁新的森林区域，发现更多惊喜！
    `,
    relatedArticles: ['sprite-evolution', 'tasks'],
  },
  {
    id: 'sprite-evolution',
    title: '精灵进化指南',
    category: '精灵',
    content: `
## 精灵进化系统

### 进化条件
- 幼苗 → 开花：亲密度 Lv.5 + 500 星光
- 开花 → 参天：亲密度 Lv.10 + 2000 星光
- 参天 → 水晶：亲密度 Lv.15 + 5000 星光
- 水晶 → 神龙：亲密度 Lv.20 + 10000 星光

### 提升亲密度
- 完成任务：+5~10 亲密度
- 收到赞赏：+2 亲密度
- 每日签到：+1 亲密度
    `,
    relatedArticles: ['getting-started', 'praise'],
  },
  {
    id: 'tasks',
    title: '任务系统说明',
    category: '任务',
    content: `
## 任务类型

### 日常委托
- 持续时间：1 天
- 奖励：10-30 星光
- 示例：今日值日、课堂发言

### 周常委托
- 持续时间：7 天
- 奖励：50-100 星光
- 示例：连续按时到校

### 特殊委托
- 持续时间：自定义
- 奖励：100-500 星光
- 示例：考试优异、比赛获奖
    `,
    relatedArticles: ['getting-started'],
  },
  {
    id: 'praise',
    title: '星光礼赞',
    category: '社交',
    content: `
## 赞赏系统

### 发送规则
- 每日限次：3 次
- 每次奖励：对方获得 5 星光
- 内容限制：不能包含不当言论

### 赞赏技巧
- 真诚具体：说明赞赏的原因
- 积极向上：传递正能量
- 及时鼓励：发现同学的闪光点
    `,
    relatedArticles: ['sprite-evolution'],
  },
  {
    id: 'achievements',
    title: '成就系统',
    category: '成就',
    content: `
## 成就分类

### 学习类（4 个）
勤快王、学霸之光、进步之星、作业达人

### 社交类（4 个）
乐于助人、人气王、温暖使者、第一次赞美

### 探索类（4 个）
先行者、收藏家、探险家、全境探索

### 特殊类（4 个）
生日之星、成长蜕变、心灵相通、星光富翁

### 成就奖励
- 星光奖励
- 特殊称号
- 限定装饰品
    `,
    relatedArticles: [],
  },
  {
    id: 'decoration',
    title: '家园装饰',
    category: '装饰',
    content: `
## 装饰品种类

### 植物类
小花坛、小树苗、玫瑰丛、向日葵、小蘑菇

### 家具类
长椅、小桌子、小喷泉、秋千、小帐篷

### 灯光类
星光路灯、灯笼、萤火虫瓶、水晶灯

### 特殊类
风铃、宝箱、精灵雕像、望远镜、书架

### 装饰技巧
- 合理布局：留出活动空间
- 色彩搭配：协调统一
- 主题风格：打造个人特色
    `,
    relatedArticles: [],
  },
]

export function useHelpSystem() {
  const [showHelp, setShowHelp] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(HELP_ARTICLES.map(a => a.category)))]

  const filteredArticles = HELP_ARTICLES.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getArticleById = (id: string) => {
    return HELP_ARTICLES.find(a => a.id === id) || null
  }

  const openArticle = (id: string) => {
    const article = getArticleById(id)
    if (article) {
      setSelectedArticle(article)
      setShowHelp(true)
    }
  }

  return {
    showHelp,
    setShowHelp,
    selectedArticle,
    setSelectedArticle,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredArticles,
    categories,
    getArticleById,
    openArticle,
    HelpModal: () => (
      <HelpModal
        show={showHelp}
        onClose={() => setShowHelp(false)}
        article={selectedArticle}
        onSelectArticle={setSelectedArticle}
        articles={filteredArticles}
        categories={categories}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onCategoryChange={setSelectedCategory}
      />
    ),
  }
}

function HelpModal({
  show,
  onClose,
  article,
  onSelectArticle,
  articles,
  categories,
  searchQuery,
  onSearch,
  onCategoryChange,
}: any) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-[500] bg-black/50 flex items-center justify-center p-6" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 左侧：文章列表 */}
        <div className="w-1/3 border-r flex flex-col">
          {/* 搜索框 */}
          <div className="p-4 border-b">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="搜索帮助..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-starlight-500"
            />
          </div>

          {/* 分类 */}
          <div className="p-4 border-b flex gap-2 overflow-x-auto">
            {categories.map((cat: string) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                  onCategoryChange === cat ? 'bg-starlight-500 text-white' : 'bg-gray-100'
                }`}
              >
                {cat === 'all' ? '全部' : cat}
              </button>
            ))}
          </div>

          {/* 文章列表 */}
          <div className="flex-1 overflow-y-auto">
            {articles.map((a: HelpArticle) => (
              <button
                key={a.id}
                onClick={() => onSelectArticle(a)}
                className={`w-full p-4 text-left border-b hover:bg-gray-50 ${
                  article?.id === a.id ? 'bg-starlight-50' : ''
                }`}
              >
                <h4 className="font-semibold text-gray-800">{a.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{a.category}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 右侧：文章内容 */}
        <div className="w-2/3 flex flex-col">
          {/* 标题栏 */}
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">
              {article?.title || '选择帮助文章'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          {/* 内容 */}
          <div className="flex-1 overflow-y-auto p-6">
            {article ? (
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: article.content
                    .replace(/^### /gm, '<h3 class="text-lg font-bold mt-6 mb-3">')
                    .replace(/^## /gm, '<h2 class="text-xl font-bold mt-8 mb-4">')
                    .replace(/\n/g, '<br/>')
                }} />
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <span className="text-6xl block mb-4">📖</span>
                请从左侧选择一篇帮助文章
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// 帮助按钮组件
export function HelpButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 z-50 bg-white rounded-full shadow-lg p-3 hover:shadow-xl transition-shadow"
    >
      <span className="text-2xl">❓</span>
    </button>
  )
}

export default useHelpSystem
