import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Router } from 'express'
import { Teacher, Class } from '../models/index.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-key'

// 教师注册
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // 检查邮箱是否已存在
    const existing = await Teacher.findOne({ email })
    if (existing) {
      return res.status(400).json({ error: '该邮箱已注册' })
    }

    // 密码加密
    const passwordHash = await bcrypt.hash(password, 10)

    // 创建教师
    const teacher = new Teacher({
      name,
      email,
      passwordHash,
    })

    await teacher.save()

    // 生成 token
    const token = jwt.sign(
      { teacherId: teacher._id, email: teacher.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      success: true,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
      },
      token,
    })
  } catch (error) {
    console.error('注册失败:', error)
    res.status(500).json({ error: '注册失败' })
  }
})

// 教师登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // 查找教师
    const teacher = await Teacher.findOne({ email })
    if (!teacher) {
      return res.status(401).json({ error: '邮箱或密码错误' })
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, teacher.passwordHash)
    if (!isValid) {
      return res.status(401).json({ error: '邮箱或密码错误' })
    }

    // 生成 token
    const token = jwt.sign(
      { teacherId: teacher._id, email: teacher.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        classes: teacher.classes,
      },
      token,
    })
  } catch (error) {
    console.error('登录失败:', error)
    res.status(500).json({ error: '登录失败' })
  }
})

// 获取当前教师信息
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: '未登录' })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    const teacher = await Teacher.findById(decoded.teacherId).populate('classes')

    if (!teacher) {
      return res.status(404).json({ error: '教师不存在' })
    }

    res.json({
      success: true,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        classes: teacher.classes,
      },
    })
  } catch (error) {
    res.status(401).json({ error: '认证失败' })
  }
})

// 创建班级
router.post('/classes', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: '未登录' })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    const { name } = req.body

    const classData = new Class({
      name,
    })

    await classData.save()

    // 关联到教师
    await Teacher.findByIdAndUpdate(decoded.teacherId, {
      $push: { classes: classData._id },
    })

    res.status(201).json({ success: true, class: classData })
  } catch (error) {
    console.error('创建班级失败:', error)
    res.status(500).json({ error: '创建班级失败' })
  }
})

// 获取班级列表
router.get('/classes', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: '未登录' })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    const teacher = await Teacher.findById(decoded.teacherId).populate('classes')

    res.json({ success: true, classes: teacher?.classes || [] })
  } catch (error) {
    res.status(401).json({ error: '认证失败' })
  }
})

export default router
