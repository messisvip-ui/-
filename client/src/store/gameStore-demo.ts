import { create } from 'zustand'

// 精灵类型
export interface Sprite {
  id: string
  name: string
  form: 'seedling' | 'bloom' | 'tree' | 'crystal' | 'dragon'
  element: 'light' | 'forest' | 'star' | 'wind' | 'water'
  color: string
  intimacyLevel: number
  starlight: number
  unlockedAnimations: string[]
}

// 任务类型
export interface Task {
  id: string
  title: string
  description: string
  story: string
  starlightReward: number
  intimacyReward: number
  dueDate: string
  completed: boolean
  completedAt?: string
}

// 赞赏类型
export interface Praise {
  id: string
  fromStudentId: string
  fromStudentName: string
  message: string
  starlight: number
  createdAt: string
}

// 学生类型
export interface Student {
  id: string
  name: string
  avatar?: string
  sprite?: Sprite
  totalStarlight: number
  achievements: string[]
  birthday?: string
}

interface GameState {
  currentStudent: Student | null
  sprite: Sprite | null
  tasks: Task[]
  receivedPraises: Praise[]
  dailyPraiseCount: number
  classTotalStarlight: number
  unlockedAreas: string[]
  isInitialized: boolean
  
  // Actions
  initialize: (studentId: string) => void
  setSprite: (sprite: Sprite) => void
  addStarlight: (amount: number) => void
  addIntimacy: (amount: number) => void
  completeTask: (taskId: string) => void
  sendPraise: (toStudentId: string, message: string) => Promise<void>
}

export const useGameStore = create<GameState>()((set, get) => ({
  currentStudent: null,
  sprite: null,
  tasks: [],
  receivedPraises: [],
  dailyPraiseCount: 0,
  classTotalStarlight: 0,
  unlockedAreas: ['misty-valley'],
  isInitialized: false,

  initialize: (studentId: string) => {
    // 检查 localStorage 是否有数据
    const savedData = localStorage.getItem(`game-${studentId}`)
    
    if (savedData) {
      // 加载保存的数据
      const data = JSON.parse(savedData)
      set({
        currentStudent: data.currentStudent,
        sprite: data.sprite,
        tasks: data.tasks || [],
        receivedPraises: data.receivedPraises || [],
        dailyPraiseCount: data.dailyPraiseCount || 0,
        classTotalStarlight: data.classTotalStarlight || 0,
        isInitialized: true,
      })
    } else {
      // 创建新数据
      const newStudent: Student = {
        id: studentId,
        name: '守护者',
        totalStarlight: 100,
        achievements: [],
      }
      
      const newSprite: Sprite = {
        id: `${studentId}-sprite`,
        name: '小光',
        form: 'seedling',
        element: 'light',
        color: '#FFD700',
        intimacyLevel: 1,
        starlight: 100,
        unlockedAnimations: [],
      }
      
      const defaultTasks: Task[] = [
        {
          id: 'task-1',
          title: '晨间守护者',
          description: '按时到校',
          story: '清晨的阳光洒在精灵森林...',
          starlightReward: 15,
          intimacyReward: 5,
          dueDate: new Date().toISOString(),
          completed: false,
        },
        {
          id: 'task-2',
          title: '知识探索者',
          description: '完成今日课程',
          story: '知识的海洋中闪烁着智慧的光芒...',
          starlightReward: 20,
          intimacyReward: 8,
          dueDate: new Date().toISOString(),
          completed: false,
        },
      ]
      
      set({
        currentStudent: newStudent,
        sprite: newSprite,
        tasks: defaultTasks,
        receivedPraises: [],
        dailyPraiseCount: 0,
        classTotalStarlight: 100,
        isInitialized: true,
      })
      
      // 保存到 localStorage
      localStorage.setItem(`game-${studentId}`, JSON.stringify({
        currentStudent: newStudent,
        sprite: newSprite,
        tasks: defaultTasks,
        receivedPraises: [],
        dailyPraiseCount: 0,
        classTotalStarlight: 100,
      }))
    }
  },

  setSprite: (sprite: Sprite) => {
    set({ sprite })
  },

  addStarlight: (amount: number) => {
    const { currentStudent, classTotalStarlight, sprite } = get()
    if (currentStudent && sprite) {
      const updatedStudent = {
        ...currentStudent,
        totalStarlight: currentStudent.totalStarlight + amount,
      }
      const updatedSprite = {
        ...sprite,
        starlight: sprite.starlight + amount,
      }
      set({
        currentStudent: updatedStudent,
        sprite: updatedSprite,
        classTotalStarlight: classTotalStarlight + amount,
      })
    }
  },

  addIntimacy: (amount: number) => {
    const { sprite } = get()
    if (sprite) {
      set({
        sprite: {
          ...sprite,
          intimacyLevel: sprite.intimacyLevel + amount,
        },
      })
    }
  },

  completeTask: (taskId: string) => {
    const { tasks, addStarlight, addIntimacy } = get()
    const task = tasks.find(t => t.id === taskId)
    if (task && !task.completed) {
      const updatedTasks = tasks.map(t =>
        t.id === taskId ? { ...t, completed: true, completedAt: new Date().toISOString() } : t
      )
      set({ tasks: updatedTasks })
      addStarlight(task.starlightReward)
      addIntimacy(task.intimacyReward)
    }
  },

  sendPraise: async (toStudentId: string, message: string) => {
    const { dailyPraiseCount } = get()
    if (dailyPraiseCount >= 3) {
      throw new Error('每日赞赏次数已达上限')
    }
    
    const praise: Praise = {
      id: `praise-${Date.now()}`,
      fromStudentId: 'current-student',
      fromStudentName: '我',
      message,
      starlight: 5,
      createdAt: new Date().toISOString(),
    }
    
    set((state) => ({
      receivedPraises: [...state.receivedPraises, praise],
      dailyPraiseCount: state.dailyPraiseCount + 1,
    }))
  },
}))
