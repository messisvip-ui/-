import { Router } from 'express'
import { Class } from '../models/index.js'

const router = Router()

// 获取班级排行榜
router.get('/leaderboard', async (req, res) => {
  try {
    const { classId, type = 'starlight', limit = 10 } = req.query
    
    const classData = await Class.findById(classId).populate({
      path: 'students',
      populate: { path: 'sprite' },
      options: { 
        sort: type === 'starlight' ? { totalStarlight: -1 } : { 'sprite.intimacyLevel': -1 },
        limit: Number(limit)
      }
    })

    if (!classData) {
      return res.status(404).json({ error: '班级不存在' })
    }

    const leaderboard = classData.students.map((student: any, index: number) => ({
      rank: index + 1,
      id: student._id,
      name: student.name,
      avatar: student.avatar,
      value: type === 'starlight' ? student.totalStarlight : student.sprite?.intimacyLevel,
      sprite: student.sprite,
    }))

    res.json({ success: true, leaderboard })
  } catch (error) {
    res.status(500).json({ error: '获取排行榜失败' })
  }
})

// 获取成就统计
router.get('/achievements/stats', async (req, res) => {
  try {
    const { classId } = req.query
    
    // 这里可以扩展成就统计逻辑
    const stats = {
      totalAchievements: 16,
      avgUnlocked: 3.5,
      topAchievements: [
        { id: 'social_first_blood', name: '第一次赞美', unlockedCount: 45 },
        { id: 'daily_login', name: '每日签到', unlockedCount: 42 },
        { id: 'learning_streak_7', name: '勤快王', unlockedCount: 28 },
      ],
    }

    res.json({ success: true, stats })
  } catch (error) {
    res.status(500).json({ error: '获取成就统计失败' })
  }
})

// 获取活动记录
router.get('/activities', async (req, res) => {
  try {
    const { classId, limit = 20 } = req.query
    
    // 模拟活动记录（实际应该从数据库查询）
    const activities = [
      {
        id: '1',
        type: 'task_complete',
        studentName: '李明',
        description: '完成了任务"晨间守护者"',
        starlight: 15,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: '2',
        type: 'praise',
        studentName: '王芳',
        description: '收到了张伟的赞赏',
        starlight: 5,
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
      {
        id: '3',
        type: 'achievement',
        studentName: '张伟',
        description: '解锁成就"勤快王"',
        starlight: 100,
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      },
    ]

    res.json({ success: true, activities: activities.slice(0, Number(limit)) })
  } catch (error) {
    res.status(500).json({ error: '获取活动记录失败' })
  }
})

export default router
