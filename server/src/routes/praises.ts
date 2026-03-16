import { Router } from 'express'
import { Praise } from '../models/index.js'
import Filter from 'bad-words'

const router = Router()
const filter = new Filter()

// 添加敏感词过滤中间件
function filterProfanity(req: any, res: any, next: any) {
  if (req.body.message && filter.isProfane(req.body.message)) {
    return res.status(400).json({ error: '消息包含不当内容' })
  }
  next()
}

// 获取赞赏列表（分页）
router.get('/', async (req, res) => {
  try {
    const { classId, page = 1, limit = 20 } = req.query
    
    const praises = await Praise.find({})
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('fromStudent', 'name avatar')
      .populate('toStudent', 'name avatar')

    const total = await Praise.countDocuments({})

    res.json({
      success: true,
      praises,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    res.status(500).json({ error: '获取赞赏列表失败' })
  }
})

// 获取学生收到的赞赏
router.get('/received/:studentId', async (req, res) => {
  try {
    const praises = await Praise.find({ toStudent: req.params.studentId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('fromStudent', 'name avatar')

    res.json({ success: true, praises })
  } catch (error) {
    res.status(500).json({ error: '获取赞赏失败' })
  }
})

// 获取学生发送的赞赏
router.get('/sent/:studentId', async (req, res) => {
  try {
    const praises = await Praise.find({ fromStudent: req.params.studentId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('toStudent', 'name avatar')

    res.json({ success: true, praises })
  } catch (error) {
    res.status(500).json({ error: '获取赞赏失败' })
  }
})

// 发送赞赏（带过滤）
router.post('/', filterProfanity, async (req, res) => {
  try {
    const { fromStudentId, fromStudentName, toStudentId, message } = req.body

    // 检查今日发送次数
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayCount = await Praise.countDocuments({
      fromStudent: fromStudentId,
      createdAt: { $gte: today },
    })

    if (todayCount >= 3) {
      return res.status(400).json({ error: '今日赞赏次数已用完' })
    }

    const praise = new Praise({
      fromStudent: fromStudentId,
      fromStudentName,
      toStudent: toStudentId,
      message,
    })

    await praise.save()

    res.status(201).json({ success: true, praise })
  } catch (error) {
    console.error('发送赞赏失败:', error)
    res.status(500).json({ error: '发送赞赏失败' })
  }
})

// 删除赞赏（管理员）
router.delete('/:id', async (req, res) => {
  try {
    // TODO: 添加管理员认证
    const praise = await Praise.findByIdAndDelete(req.params.id)
    
    if (!praise) {
      return res.status(404).json({ error: '赞赏不存在' })
    }

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: '删除赞赏失败' })
  }
})

export default router
