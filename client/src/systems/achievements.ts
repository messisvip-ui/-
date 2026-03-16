// 成就定义
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'learning' | 'social' | 'exploration' | 'special'
  condition: (state: any) => boolean
  reward: {
    starlight: number
    title?: string
  }
}

export const ACHIEVEMENTS: Achievement[] = [
  // 学习类
  {
    id: 'learning_streak_7',
    name: '勤快王',
    description: '连续 7 天完成所有任务',
    icon: '🏆',
    category: 'learning',
    condition: (state) => state.consecutiveDays >= 7,
    reward: { starlight: 100, title: '勤快守护者' },
  },
  {
    id: 'learning_perfect',
    name: '学霸之光',
    description: '单科成绩获得第一名',
    icon: '📚',
    category: 'learning',
    condition: (state) => state.topRank === 1,
    reward: { starlight: 200, title: '智慧守护者' },
  },
  {
    id: 'learning_progress',
    name: '进步之星',
    description: '进步幅度最大',
    icon: '📈',
    category: 'learning',
    condition: (state) => state.progressRank === 1,
    reward: { starlight: 150, title: '飞跃守护者' },
  },
  {
    id: 'learning_homework',
    name: '作业达人',
    description: '连续 30 天按时完成作业',
    icon: '✍️',
    category: 'learning',
    condition: (state) => state.homeworkStreak >= 30,
    reward: { starlight: 300 },
  },

  // 社交类
  {
    id: 'social_helper',
    name: '乐于助人',
    description: '收到 10 次赞赏',
    icon: '🤝',
    category: 'social',
    condition: (state) => state.receivedPraises >= 10,
    reward: { starlight: 50, title: '热心守护者' },
  },
  {
    id: 'social_popular',
    name: '人气王',
    description: '收到 50 次赞赏',
    icon: '⭐',
    category: 'social',
    condition: (state) => state.receivedPraises >= 50,
    reward: { starlight: 200, title: '明星守护者' },
  },
  {
    id: 'social_giver',
    name: '温暖使者',
    description: '发送 30 次赞赏',
    icon: '💝',
    category: 'social',
    condition: (state) => state.sentPraises >= 30,
    reward: { starlight: 100, title: '温暖守护者' },
  },
  {
    id: 'social_first_blood',
    name: '第一次赞美',
    description: '第一次给同学发送赞赏',
    icon: '🎉',
    category: 'social',
    condition: (state) => state.sentPraises >= 1,
    reward: { starlight: 10 },
  },

  // 探索类
  {
    id: 'exploration_first',
    name: '先行者',
    description: '第一个解锁新区域',
    icon: '🗺️',
    category: 'exploration',
    condition: (state) => state.firstUnlock === true,
    reward: { starlight: 150, title: '探险守护者' },
  },
  {
    id: 'exploration_collector',
    name: '收藏家',
    description: '收集所有装饰品',
    icon: '🏠',
    category: 'exploration',
    condition: (state) => state.decorationsCollected >= 20,
    reward: { starlight: 200 },
  },
  {
    id: 'exploration_visitor',
    name: '探险家',
    description: '访问 20 个同学家园',
    icon: '🚶',
    category: 'exploration',
    condition: (state) => state.visitedHomes >= 20,
    reward: { starlight: 100 },
  },
  {
    id: 'exploration_all_areas',
    name: '全境探索',
    description: '解锁所有森林区域',
    icon: '🌍',
    category: 'exploration',
    condition: (state) => state.unlockedAreas >= 5,
    reward: { starlight: 500, title: '传奇守护者' },
  },

  // 特殊类
  {
    id: 'special_birthday',
    name: '生日之星',
    description: '在生日当天登录',
    icon: '🎂',
    category: 'special',
    condition: (state) => state.isBirthday === true,
    reward: { starlight: 100 },
  },
  {
    id: 'special_evolution',
    name: '成长蜕变',
    description: '精灵首次进化',
    icon: '🦋',
    category: 'special',
    condition: (state) => state.firstEvolution === true,
    reward: { starlight: 200, title: '进化守护者' },
  },
  {
    id: 'special_max_intimacy',
    name: '心灵相通',
    description: '亲密度达到满级',
    icon: '💖',
    category: 'special',
    condition: (state) => state.intimacyLevel >= 20,
    reward: { starlight: 1000, title: '灵魂守护者' },
  },
  {
    id: 'special_rich',
    name: '星光富翁',
    description: '累计获得 10000 星光',
    icon: '💰',
    category: 'special',
    condition: (state) => state.totalStarlight >= 10000,
    reward: { starlight: 500, title: '富豪守护者' },
  },
]

// 检查成就是否解锁
export function checkAchievements(state: any): Achievement[] {
  const unlocked: Achievement[] = []
  
  ACHIEVEMENTS.forEach((achievement) => {
    if (achievement.condition(state)) {
      unlocked.push(achievement)
    }
  })
  
  return unlocked
}

// 获取分类图标
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    learning: '📚',
    social: '🤝',
    exploration: '🗺️',
    special: '🌟',
  }
  return icons[category] || '⭐'
}

// 获取分类颜色
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    learning: 'from-blue-400 to-blue-600',
    social: 'from-pink-400 to-pink-600',
    exploration: 'from-green-400 to-green-600',
    special: 'from-yellow-400 to-yellow-600',
  }
  return colors[category] || 'from-gray-400 to-gray-600'
}
