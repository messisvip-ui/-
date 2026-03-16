import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import io from 'socket.io-client'

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
  // 当前学生
  currentStudent: Student | null
  sprite: Sprite | null
  
  // 任务
  tasks: Task[]
  
  // 赞赏
  receivedPraises: Praise[]
  dailyPraiseCount: number
  
  // 班级状态
  classTotalStarlight: number
  unlockedAreas: string[]
  
  // Socket 连接
  socket: any
  
  // Actions
  initialize: (studentId: string) => void
  setSprite: (sprite: Sprite) => void
  addStarlight: (amount: number) => void
  addIntimacy: (amount: number) => void
  completeTask: (taskId: string) => void
  sendPraise: (toStudentId: string, message: string) => Promise<void>
  disconnect: () => void
}

const socket = io('http://localhost:4000', {
  autoConnect: false,
})

export const useGameStore = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    currentStudent: null,
    sprite: null,
    tasks: [],
    receivedPraises: [],
    dailyPraiseCount: 0,
    classTotalStarlight: 0,
    unlockedAreas: ['misty-valley'],
    socket: socket,

    initialize: (studentId: string) => {
      const { socket } = get()
      
      socket.connect()
      
      // 监听连接
      socket.on('connect', () => {
        console.log('Connected to server')
        // 加入学生房间
        socket.emit('join-student', studentId)
      })
      
      // 监听学生数据
      socket.on('student-data', (data: { student: Student; sprite: Sprite }) => {
        set({ currentStudent: data.student, sprite: data.sprite })
      })
      
      // 监听任务列表
      socket.on('tasks-list', (tasks: Task[]) => {
        set({ tasks })
      })
      
      // 监听赞赏
      socket.on('praise-received', (praise: Praise) => {
        set((state) => ({
          receivedPraises: [...state.receivedPraises, praise],
          dailyPraiseCount: state.dailyPraiseCount + 1,
        }))
      })
      
      // 监听班级星光
      socket.on('class-starlight-update', (total: number) => {
        set({ classTotalStarlight: total })
      })
      
      // 请求数据
      socket.emit('get-student-data', studentId)
      socket.emit('get-tasks')
    },

    setSprite: (sprite: Sprite) => {
      set({ sprite })
    },

    addStarlight: (amount: number) => {
      const { currentStudent, socket } = get()
      if (!currentStudent) return
      
      socket.emit('add-starlight', currentStudent.id, amount)
    },

    addIntimacy: (amount: number) => {
      const { sprite, socket } = get()
      if (!sprite) return
      
      socket.emit('add-intimacy', sprite.id, amount)
    },

    completeTask: (taskId: string) => {
      const { socket, currentStudent } = get()
      if (!currentStudent) return
      
      socket.emit('complete-task', currentStudent.id, taskId)
    },

    sendPraise: async (toStudentId: string, message: string) => {
      const { socket, currentStudent, dailyPraiseCount } = get()
      
      if (!currentStudent) throw new Error('未登录')
      if (dailyPraiseCount >= 3) throw new Error('今日赞赏次数已用完')
      
      return new Promise((resolve, reject) => {
        socket.emit(
          'send-praise',
          {
            fromStudentId: currentStudent.id,
            fromStudentName: currentStudent.name,
            toStudentId,
            message,
          },
          (response: { success: boolean; error?: string }) => {
            if (response.success) {
              set({ dailyPraiseCount: dailyPraiseCount + 1 })
              resolve()
            } else {
              reject(new Error(response.error))
            }
          }
        )
      })
    },

    disconnect: () => {
      const { socket } = get()
      socket.disconnect()
    },
  }))
)
