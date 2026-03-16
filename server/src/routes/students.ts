import { Router } from 'express'
import { Student, Sprite, Class } from '../models/index.js'

const router = Router()

// 获取学生信息
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('sprite')
    if (!student) {
      return res.status(404).json({ error: '学生不存在' })
    }
    res.json(student)
  } catch (error) {
    res.status(500).json({ error: '服务器错误' })
  }
})

// 创建学生（初次使用）
router.post('/', async (req, res) => {
  try {
    const { name, classId, spriteData } = req.body

    // 创建精灵
    const sprite = new Sprite(spriteData)
    await sprite.save()

    // 创建学生
    const student = new Student({
      name,
      classId,
      sprite: sprite._id,
    })
    await student.save()

    // 更新班级
    await Class.findByIdAndUpdate(
      classId,
      { $push: { students: student._id } },
      { upsert: true }
    )

    res.status(201).json({ student, sprite })
  } catch (error) {
    res.status(500).json({ error: '创建失败' })
  }
})

// 更新学生星光
router.patch('/:id/starlight', async (req, res) => {
  try {
    const { amount } = req.body
    const student = await Student.findById(req.params.id)
    
    if (!student) {
      return res.status(404).json({ error: '学生不存在' })
    }

    student.totalStarlight += amount
    await student.save()

    // 更新班级总星光
    await Class.findByIdAndUpdate(student.classId, {
      $inc: { totalStarlight: amount },
    })

    res.json({ success: true, totalStarlight: student.totalStarlight })
  } catch (error) {
    res.status(500).json({ error: '更新失败' })
  }
})

export default router
