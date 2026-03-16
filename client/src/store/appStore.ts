import { create } from 'zustand'

// 学生类型
export interface Student {
  id: string
  name: string
  studentId: string // 学号
  avatar?: string
  birthday?: string
  createdAt: string
}

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
  type: 'daily' | 'weekly' | 'special'
  starlightReward: number
  intimacyReward: number
  dueDate: string
  assignedTo: 'all' | string[] // all 表示全班，或者指定学生 ID 列表
  completedBy: {
    studentId: string
    completedAt: string
  }[]
}

// 赞赏类型
export interface Praise {
  id: string
  fromStudentId: string
  fromStudentName: string
  toStudentId: string
  toStudentName: string
  message: string
  starlight: number
  createdAt: string
}

// 学生游戏数据
export interface StudentGameData {
  sprite: Sprite
  tasks: Task[]
  receivedPraises: Praise[]
  dailyPraiseCount: number
  totalStarlight: number
  achievements: string[]
  unlockedAreas: string[]
  lastLoginAt: string
}

// 班级数据
export interface ClassData {
  name: string
  teacherName: string
  students: Student[]
  tasks: Task[]
  praises: Praise[]
  createdAt: string
}

interface AppState {
  // 当前状态
  currentStudentId: string | null
  isTeacher: boolean
  classData: ClassData | null
  isInitialized: boolean
  
  // Actions - 登录相关
  initialize: () => void
  loginAsStudent: (studentId: string) => void
  loginAsTeacher: () => void
  logout: () => void
  
  // Actions - 学生管理
  addStudent: (student: Student) => void
  updateStudent: (id: string, data: Partial<Student>) => void
  deleteStudent: (id: string) => void
  
  // Actions - 游戏功能
  getStudentData: (studentId: string) => StudentGameData | null
  saveStudentData: (studentId: string, data: StudentGameData) => void
  addStarlight: (studentId: string, amount: number) => void
  completeTask: (studentId: string, taskId: string) => void
  sendPraise: (fromStudentId: string, toStudentId: string, message: string) => void
  
  // Actions - 任务管理
  addTask: (task: Task) => void
  updateTask: (id: string, data: Partial<Task>) => void
  deleteTask: (id: string) => void
  
  // Actions - 班级设置
  updateClassInfo: (name: string, teacherName: string) => void
}

const STORAGE_KEY = 'light-contract-class-data'

export const useAppStore = create<AppState>()((set, get) => ({
  currentStudentId: null,
  isTeacher: false,
  classData: null,
  isInitialized: false,
  
  initialize: () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    
    if (saved) {
      const data: ClassData = JSON.parse(saved)
      set({ classData: data, isInitialized: true })
    } else {
      // 创建默认班级
      const defaultClass: ClassData = {
        name: '三年级 2 班',
        teacherName: '老师',
        students: [],
        tasks: [
          {
            id: 'task-1',
            title: '晨间守护者',
            description: '按时到校',
            story: '清晨的阳光洒在精灵森林...',
            type: 'daily',
            starlightReward: 15,
            intimacyReward: 5,
            dueDate: new Date().toISOString(),
            assignedTo: 'all',
            completedBy: [],
          },
          {
            id: 'task-2',
            title: '知识探索者',
            description: '完成今日课程',
            story: '知识的海洋中闪烁着智慧的光芒...',
            type: 'daily',
            starlightReward: 20,
            intimacyReward: 8,
            dueDate: new Date().toISOString(),
            assignedTo: 'all',
            completedBy: [],
          },
        ],
        praises: [],
        createdAt: new Date().toISOString(),
      }
      
      set({ classData: defaultClass, isInitialized: true })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultClass))
    }
  },
  
  loginAsStudent: (studentId: string) => {
    set({ currentStudentId: studentId, isTeacher: false })
    localStorage.setItem('current-user', JSON.stringify({ type: 'student', id: studentId }))
  },
  
  loginAsTeacher: () => {
    set({ isTeacher: true })
    localStorage.setItem('current-user', JSON.stringify({ type: 'teacher' }))
  },
  
  logout: () => {
    set({ currentStudentId: null, isTeacher: false })
    localStorage.removeItem('current-user')
  },
  
  addStudent: (student: Student) => {
    const { classData } = get()
    if (classData) {
      const updated = {
        ...classData,
        students: [...classData.students, student],
      }
      set({ classData: updated })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      
      // 初始化学生游戏数据
      const defaultGameData: StudentGameData = {
        sprite: {
          id: `${student.id}-sprite`,
          name: '小光',
          form: 'seedling',
          element: 'light',
          color: '#FFD700',
          intimacyLevel: 1,
          starlight: 100,
          unlockedAnimations: [],
        },
        tasks: [],
        receivedPraises: [],
        dailyPraiseCount: 0,
        totalStarlight: 100,
        achievements: [],
        unlockedAreas: ['misty-valley'],
        lastLoginAt: new Date().toISOString(),
      }
      localStorage.setItem(`student-${student.id}`, JSON.stringify(defaultGameData))
    }
  },
  
  updateStudent: (id: string, data: Partial<Student>) => {
    const { classData } = get()
    if (classData) {
      const updated = {
        ...classData,
        students: classData.students.map(s => 
          s.id === id ? { ...s, ...data } : s
        ),
      }
      set({ classData: updated })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    }
  },
  
  deleteStudent: (id: string) => {
    const { classData } = get()
    if (classData) {
      const updated = {
        ...classData,
        students: classData.students.filter(s => s.id !== id),
      }
      set({ classData: updated })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      localStorage.removeItem(`student-${id}`)
    }
  },
  
  getStudentData: (studentId: string): StudentGameData | null => {
    const saved = localStorage.getItem(`student-${studentId}`)
    if (saved) {
      return JSON.parse(saved)
    }
    return null
  },
  
  saveStudentData: (studentId: string, data: StudentGameData) => {
    localStorage.setItem(`student-${studentId}`, JSON.stringify(data))
  },
  
  addStarlight: (studentId: string, amount: number) => {
    const gameData = get().getStudentData(studentId)
    if (gameData) {
      const updated = {
        ...gameData,
        totalStarlight: gameData.totalStarlight + amount,
        sprite: {
          ...gameData.sprite,
          starlight: gameData.sprite.starlight + amount,
        },
      }
      get().saveStudentData(studentId, updated)
    }
  },
  
  completeTask: (studentId: string, taskId: string) => {
    const { classData, getStudentData, saveStudentData, addStarlight } = get()
    if (!classData) return
    
    const task = classData.tasks.find(t => t.id === taskId)
    if (!task) return
    
    const gameData = getStudentData(studentId)
    if (!gameData) return
    
    // 检查是否已完成
    const alreadyCompleted = task.completedBy.some(c => c.studentId === studentId)
    if (alreadyCompleted) return
    
    // 更新任务完成状态
    const updatedTask = {
      ...task,
      completedBy: [...task.completedBy, { studentId, completedAt: new Date().toISOString() }],
    }
    
    const updatedClass = {
      ...classData,
      tasks: classData.tasks.map(t => t.id === taskId ? updatedTask : t),
    }
    
    set({ classData: updatedClass })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClass))
    
    // 添加奖励
    addStarlight(studentId, task.starlightReward)
    
    // 更新学生任务列表
    const updatedGameData = {
      ...gameData,
      tasks: [...gameData.tasks, updatedTask],
    }
    saveStudentData(studentId, updatedGameData)
  },
  
  sendPraise: (fromStudentId: string, toStudentId: string, message: string) => {
    const { classData, getStudentData, saveStudentData, addStarlight } = get()
    if (!classData) return
    
    const fromStudent = classData.students.find(s => s.id === fromStudentId)
    const toStudent = classData.students.find(s => s.id === toStudentId)
    if (!fromStudent || !toStudent) return
    
    const praise: Praise = {
      id: `praise-${Date.now()}`,
      fromStudentId,
      fromStudentName: fromStudent.name,
      toStudentId,
      toStudentName: toStudent.name,
      message,
      starlight: 5,
      createdAt: new Date().toISOString(),
    }
    
    // 添加到班级赞赏列表
    const updatedClass = {
      ...classData,
      praises: [...classData.praises, praise],
    }
    set({ classData: updatedClass })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClass))
    
    // 添加到接收者数据
    const toGameData = getStudentData(toStudentId)
    if (toGameData) {
      const updated = {
        ...toGameData,
        receivedPraises: [...toGameData.receivedPraises, praise],
        dailyPraiseCount: toGameData.dailyPraiseCount + 1,
      }
      saveStudentData(toStudentId, updated)
    }
    
    // 添加星光奖励
    addStarlight(toStudentId, 5)
  },
  
  addTask: (task: Task) => {
    const { classData } = get()
    if (classData) {
      const updated = {
        ...classData,
        tasks: [...classData.tasks, task],
      }
      set({ classData: updated })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    }
  },
  
  updateTask: (id: string, data: Partial<Task>) => {
    const { classData } = get()
    if (classData) {
      const updated = {
        ...classData,
        tasks: classData.tasks.map(t => t.id === id ? { ...t, ...data } : t),
      }
      set({ classData: updated })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    }
  },
  
  deleteTask: (id: string) => {
    const { classData } = get()
    if (classData) {
      const updated = {
        ...classData,
        tasks: classData.tasks.filter(t => t.id !== id),
      }
      set({ classData: updated })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    }
  },
  
  updateClassInfo: (name: string, teacherName: string) => {
    const { classData } = get()
    if (classData) {
      const updated = {
        ...classData,
        name,
        teacherName,
      }
      set({ classData: updated })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    }
  },
}))
