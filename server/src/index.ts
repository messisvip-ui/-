import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

// 路由
import authRoutes from './routes/auth.js'
import studentRoutes from './routes/students.js'
import taskRoutes from './routes/tasks.js'
import praiseRoutes from './routes/praises.js'
import adminRoutes from './routes/admin.js'
import statsRoutes from './routes/stats.js'
import classRoutes from './routes/class.js'

// Socket.io 处理器
import { initializeSocket } from './socket/handler.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
  },
})

// 中间件
app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// 限流
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})
app.use('/api/', limiter)

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/praises', praiseRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/class', classRoutes)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '0.2.0',
  })
})

// API 文档端点
app.get('/api', (req, res) => {
  res.json({
    name: '光之契约·精灵森境 API',
    version: '0.2.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': '教师注册',
        'POST /api/auth/login': '教师登录',
        'GET /api/auth/me': '获取当前教师信息',
      },
      students: {
        'GET /api/students/:id': '获取学生信息',
        'POST /api/students': '创建学生',
        'PATCH /api/students/:id/starlight': '更新星光',
      },
      tasks: {
        'GET /api/tasks': '获取任务列表',
        'POST /api/tasks': '创建任务',
        'PATCH /api/tasks/:id': '更新任务',
        'DELETE /api/tasks/:id': '删除任务',
        'PATCH /api/tasks/:id/complete': '完成任务',
      },
      praises: {
        'GET /api/praises': '获取赞赏列表',
        'POST /api/praises': '发送赞赏',
        'DELETE /api/praises/:id': '删除赞赏',
      },
      admin: {
        'GET /api/admin/classes/:id': '获取班级详情',
        'GET /api/admin/classes/:id/stats': '获取班级统计',
        'GET /api/admin/students/:id': '获取学生详情',
        'PATCH /api/admin/students/:id': '更新学生信息',
        'DELETE /api/admin/students/:id': '删除学生',
        'POST /api/admin/students/batch': '批量导入学生',
      },
      stats: {
        'GET /api/stats/leaderboard': '获取排行榜',
        'GET /api/stats/achievements': '获取成就统计',
        'GET /api/stats/activities': '获取活动记录',
      },
      class: {
        'POST /api/class/unlock-area': '解锁区域',
        'GET /api/class/areas/progress': '获取区域进度',
      },
    },
  })
})

// 错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.stack)
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: '数据验证失败', details: err.message })
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: '认证失败' })
  }

  res.status(500).json({ error: '服务器内部错误' })
})

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在' })
})

// 初始化 Socket.io
initializeSocket(io)

// 连接数据库并启动服务器
const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/light-contract'

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ 已连接到 MongoDB')
    
    httpServer.listen(PORT, () => {
      console.log(`\n🚀 光之契约·精灵森境 后端服务已启动`)
      console.log(`📡 服务器运行在 http://localhost:${PORT}`)
      console.log(`📖 API 文档：http://localhost:${PORT}/api`)
      console.log(`🔌 Socket.io: http://localhost:${PORT}/socket.io/\n`)
    })
  })
  .catch((err) => {
    console.error('❌ 数据库连接失败:', err.message)
    console.log('⚠️  服务器将在没有数据库的情况下启动（仅演示模式）')
    
    httpServer.listen(PORT, () => {
      console.log(`\n🚀 光之契约·精灵森境 后端服务已启动（演示模式）`)
      console.log(`📡 服务器运行在 http://localhost:${PORT}`)
      console.log(`⚠️  未连接数据库，部分功能不可用\n`)
    })
  })
