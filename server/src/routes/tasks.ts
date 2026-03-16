import { Router } from 'express'
import { Task, Student, Class } from '../models/index.js'

const router = Router()

// 获取任务列表（带过滤）
router.get('/', async (req, res) => {
  try {
    const { classId, type, isActive, page = 1, limit = 20 } = req.query
    
    const query: any = {}
    if (classId) query.classId = classId
    if (type) query.type = type
    if (isActive !== undefined) query.isActive = isActive === 'true'

    const tasks = await Task.find(query)
      .sort({ dueDate: 1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))

    const total = await Task.countDocuments(query)

    res.json({
      success: true,
      tasks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    res.status(500).json({ error: '获取任务失败' })
  }
})

// 创建任务
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body)
    await task.save()

    res.status(201).json({ success: true, task })
  } catch (error) {
    console.error('创建任务失败:', error)
    res.status(500).json({ error: '创建任务失败' })
  }
})

// 更新任务
router.patch('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!task) {
      return res.status(404).json({ error: '任务不存在' })
    }

    res.json({ success: true, task })
  } catch (error) {
    res.status(500).json({ error: '更新任务失败' })
  }
})

// 删除任务
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)

    if (!task) {
      return res.status(404).json({ error: '任务不存在' })
    }

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: '删除任务失败' })
  }
})

// 完成任务
router.patch('/:id/complete', async (req, res) => {
  try {
    const { studentId } = req.body
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ error: '任务不存在' })
    }

    // 检查是否已完成
    const alreadyCompleted = task.completedBy.some(
      (c: any) => c.studentId.toString() === studentId
    )

    if (alreadyCompleted) {
      return res.status(400).json({ error: '任务已完成' })
    }

    // 添加完成记录
    task.completedBy.push({ studentId, completedAt: new Date() })
    await task.save()

    // 更新学生星光和亲密度
    const student = await Student.findById(studentId)
    if (student) {
      student.totalStarlight += task.starlightReward
      
      if (student.sprite) {
        const Sprite = (await import('../models/index.js')).Sprite
        await Sprite.findByIdAndUpdate(student.sprite, {
          $inc: { 
            intimacyExp: task.intimacyReward,
            starlight: task.starlightReward,
          },
        })
      }
      
      await student.save()

      // 更新班级总星光
      const classData = await Class.findById(student.classId)
      if (classData) {
        classData.totalStarlight += task.starlightReward
        await classData.save()
      }
    }

    res.json({ 
      success: true, 
      rewards: {
        starlight: task.starlightReward,
        intimacy: task.intimacyReward,
      }
    })
  } catch (error) {
    console.error('完成任务失败:', error)
    res.status(500).json({ error: '完成任务失败' })
  }
})

// 获取任务统计
router.get('/:id/stats', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ error: '任务不存在' })
    }

    const classData = await Class.findById(task.classId)
    const totalStudents = classData?.students.length || 0
    const completedCount = task.completedBy.length
    const completionRate = totalStudents > 0 
      ? Math.round((completedCount / totalStudents) * 100) 
      : 0

    res.json({
      success: true,
      stats: {
        totalStudents,
        completedCount,
        completionRate,
        remainingCount: totalStudents - completedCount,
      },
    })
  } catch (error) {
    res.status(500).json({ error: '获取统计失败' })
  }
})

export default router
