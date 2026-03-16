import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { Student, Sprite, Task, Praise, Class } from '../models/index.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-key'

// 认证中间件
function authMiddleware(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: '未登录' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    req.teacherId = decoded.teacherId
    next()
  } catch (error) {
    res.status(401).json({ error: '认证失败' })
  }
}

// 获取班级详情
router.get('/classes/:id', authMiddleware, async (req: any, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate('students')
      .populate({
        path: 'students',
        populate: { path: 'sprite' }
      })

    if (!classData) {
      return res.status(404).json({ error: '班级不存在' })
    }

    res.json({ success: true, class: classData })
  } catch (error) {
    res.status(500).json({ error: '获取班级失败' })
  }
})

// 获取班级统计
router.get('/classes/:id/stats', authMiddleware, async (req: any, res) => {
  try {
    const classData = await Class.findById(req.params.id).populate('students')

    if (!classData) {
      return res.status(404).json({ error: '班级不存在' })
    }

    const students = classData.students as any[]
    const totalStarlight = students.reduce((sum, s) => sum + (s.totalStarlight || 0), 0)
    const avgStarlight = Math.round(totalStarlight / students.length) || 0
    const avgIntimacy = (students.reduce((sum, s) => sum + (s.sprite?.intimacyLevel || 0), 0) / students.length).toFixed(1)

    // 任务完成率
    const tasks = await Task.find({ classId: req.params.id, isActive: true })
    const totalCompletions = tasks.reduce((sum, t) => sum + t.completedBy.length, 0)
    const completionRate = students.length > 0 
      ? Math.round((totalCompletions / (tasks.length * students.length)) * 100) 
      : 0

    res.json({
      success: true,
      stats: {
        totalStudents: students.length,
        totalStarlight,
        avgStarlight,
        avgIntimacy,
        totalTasks: tasks.length,
        completionRate,
        unlockedAreas: classData.unlockedAreas.length,
      },
    })
  } catch (error) {
    res.status(500).json({ error: '获取统计失败' })
  }
})

// 获取学生详情
router.get('/students/:id', authMiddleware, async (req: any, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('sprite')
      .populate({
        path: '_id',
        model: 'Praise',
        match: { toStudent: req.params.id }
      })

    if (!student) {
      return res.status(404).json({ error: '学生不存在' })
    }

    // 获取收到的赞赏
    const praises = await Praise.find({ toStudent: req.params.id })
      .sort({ createdAt: -1 })
      .limit(20)

    res.json({
      success: true,
      student: {
        ...student.toObject(),
        praises,
      },
    })
  } catch (error) {
    res.status(500).json({ error: '获取学生失败' })
  }
})

// 更新学生信息
router.patch('/students/:id', authMiddleware, async (req: any, res) => {
  try {
    const { name, birthday, achievements } = req.body
    const student = await Student.findById(req.params.id)

    if (!student) {
      return res.status(404).json({ error: '学生不存在' })
    }

    if (name) student.name = name
    if (birthday) student.birthday = birthday
    if (achievements) student.achievements = achievements

    await student.save()

    res.json({ success: true, student })
  } catch (error) {
    res.status(500).json({ error: '更新失败' })
  }
})

// 删除学生
router.delete('/students/:id', authMiddleware, async (req: any, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id)
    
    if (!student) {
      return res.status(404).json({ error: '学生不存在' })
    }

    // 删除关联的精灵
    if (student.sprite) {
      await Sprite.findByIdAndDelete(student.sprite)
    }

    // 从班级移除
    await Class.findByIdAndUpdate(student.classId, {
      $pull: { students: student._id }
    })

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: '删除失败' })
  }
})

// 批量导入学生
router.post('/students/batch', authMiddleware, async (req: any, res) => {
  try {
    const { classId, students } = req.body
    const created = []

    for (const studentData of students) {
      // 创建精灵
      const sprite = new Sprite({
        name: studentData.spriteName || '小光',
        form: 'seedling',
        element: studentData.element || 'light',
      })
      await sprite.save()

      // 创建学生
      const student = new Student({
        name: studentData.name,
        classId,
        sprite: sprite._id,
        birthday: studentData.birthday,
      })
      await student.save()

      // 更新班级
      await Class.findByIdAndUpdate(classId, {
        $push: { students: student._id }
      })

      created.push(student)
    }

    res.status(201).json({ success: true, students: created })
  } catch (error) {
    console.error('批量导入失败:', error)
    res.status(500).json({ error: '批量导入失败' })
  }
})

export default router
