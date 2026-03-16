import { Router } from 'express'
import { Class } from '../models/index.js'

const router = Router()

// 更新班级星光（解锁区域）
router.post('/unlock-area', async (req, res) => {
  try {
    const { classId, areaId } = req.body

    const classData = await Class.findById(classId)
    if (!classData) {
      return res.status(404).json({ error: '班级不存在' })
    }

    // 检查是否已解锁
    if (classData.unlockedAreas.includes(areaId)) {
      return res.status(400).json({ error: '区域已解锁' })
    }

    // 检查星光是否足够
    const areaCosts: Record<string, number> = {
      'misty-valley': 0,
      'star-lake': 5000,
      'cloud-realm': 10000,
      'rainbow-falls': 20000,
      'star-temple': 50000,
    }

    const cost = areaCosts[areaId]
    if (!cost || classData.totalStarlight < cost) {
      return res.status(400).json({ 
        error: '星光不足',
        required: cost,
        current: classData.totalStarlight,
      })
    }

    // 解锁区域
    classData.unlockedAreas.push(areaId)
    await classData.save()

    res.json({ 
      success: true, 
      area: areaId,
      message: `🎉 成功解锁新区域：${areaId}` 
    })
  } catch (error) {
    res.status(500).json({ error: '解锁区域失败' })
  }
})

// 获取区域解锁进度
router.get('/areas/progress', async (req, res) => {
  try {
    const { classId } = req.query

    const classData = await Class.findById(classId)
    if (!classData) {
      return res.status(404).json({ error: '班级不存在' })
    }

    const areas = [
      { id: 'misty-valley', name: '晨雾山谷', cost: 0, unlocked: true },
      { id: 'star-lake', name: '星夜湖泊', cost: 5000, unlocked: classData.unlockedAreas.includes('star-lake') },
      { id: 'cloud-realm', name: '云端秘境', cost: 10000, unlocked: classData.unlockedAreas.includes('cloud-realm') },
      { id: 'rainbow-falls', name: '彩虹瀑布', cost: 20000, unlocked: classData.unlockedAreas.includes('rainbow-falls') },
      { id: 'star-temple', name: '星辰神殿', cost: 50000, unlocked: classData.unlockedAreas.includes('star-temple') },
    ]

    res.json({
      success: true,
      areas,
      totalStarlight: classData.totalStarlight,
    })
  } catch (error) {
    res.status(500).json({ error: '获取进度失败' })
  }
})

export default router
