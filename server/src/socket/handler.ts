import { Server, Socket } from 'socket.io'
import { Student, Sprite, Task, Praise, Class } from '../models/index.js'

// 存储在线学生
const onlineStudents = new Map<string, Socket>()

export function initializeSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 客户端连接：${socket.id}`)

    // 学生加入房间
    socket.on('join-student', (studentId: string) => {
      socket.join(`student:${studentId}`)
      onlineStudents.set(studentId, socket)
      console.log(`📚 学生 ${studentId} 加入房间`)
    })

    // 获取学生数据
    socket.on('get-student-data', async (studentId: string) => {
      try {
        const student = await Student.findById(studentId).populate('sprite')
        if (student) {
          socket.emit('student-data', {
            student: {
              ...student.toObject(),
            },
            sprite: student.sprite,
          })
        }
      } catch (error) {
        console.error('获取学生数据失败:', error)
      }
    })

    // 获取任务列表
    socket.on('get-tasks', async () => {
      try {
        const tasks = await Task.find({ 
          isActive: true,
          dueDate: { $gte: new Date() }
        }).sort({ dueDate: 1 })
        socket.emit('tasks-list', tasks)
      } catch (error) {
        console.error('获取任务失败:', error)
      }
    })

    // 添加星光
    socket.on('add-starlight', async (studentId: string, amount: number) => {
      try {
        const student = await Student.findById(studentId)
        if (student) {
          student.totalStarlight += amount
          await student.save()

          // 更新班级总星光
          const classData = await Class.findById(student.classId)
          if (classData) {
            classData.totalStarlight += amount
            await classData.save()
            
            // 广播班级星光更新
            io.emit('class-starlight-update', classData.totalStarlight)
          }

          socket.emit('starlight-updated', student.totalStarlight)
        }
      } catch (error) {
        console.error('添加星光失败:', error)
      }
    })

    // 添加亲密度
    socket.on('add-intimacy', async (spriteId: string, amount: number) => {
      try {
        const sprite = await Sprite.findById(spriteId)
        if (sprite) {
          sprite.intimacyExp += amount
          
          // 检查升级
          const levelThreshold = sprite.intimacyLevel * 100
          if (sprite.intimacyExp >= levelThreshold) {
            sprite.intimacyLevel += 1
            sprite.intimacyExp -= levelThreshold
          }
          
          await sprite.save()
          socket.emit('intimacy-updated', sprite)
        }
      } catch (error) {
        console.error('添加亲密度失败:', error)
      }
    })

    // 完成任务
    socket.on('complete-task', async (studentId: string, taskId: string) => {
      try {
        const task = await Task.findById(taskId)
        if (task) {
          const alreadyCompleted = task.completedBy.some(
            (c: any) => c.studentId.toString() === studentId
          )

          if (!alreadyCompleted) {
            task.completedBy.push({ studentId, completedAt: new Date() })
            await task.save()

            // 发送奖励
            socket.emit('task-completed', {
              taskId,
              starlight: task.starlightReward,
              intimacy: task.intimacyReward,
            })
          }
        }
      } catch (error) {
        console.error('完成任务失败:', error)
      }
    })

    // 发送赞赏
    socket.on('send-praise', async (data: any, callback: any) => {
      try {
        const { fromStudentId, fromStudentName, toStudentId, message } = data

        // 检查今日次数
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const todayCount = await Praise.countDocuments({
          fromStudent: fromStudentId,
          createdAt: { $gte: today },
        })

        if (todayCount >= 3) {
          return callback({ success: false, error: '今日赞赏次数已用完' })
        }

        const praise = new Praise({
          fromStudent: fromStudentId,
          fromStudentName,
          toStudent: toStudentId,
          message,
        })

        await praise.save()

        // 更新收到赞赏学生的星光
        const toStudent = await Student.findById(toStudentId)
        if (toStudent) {
          toStudent.totalStarlight += praise.starlight
          await toStudent.save()
        }

        // 通知接收者
        const receiverSocket = onlineStudents.get(toStudentId)
        if (receiverSocket) {
          receiverSocket.emit('praise-received', {
            id: praise._id,
            fromStudentId,
            fromStudentName,
            message,
            starlight: praise.starlight,
            createdAt: praise.createdAt,
          })
        }

        callback({ success: true })
      } catch (error) {
        console.error('发送赞赏失败:', error)
        callback({ success: false, error: '发送失败' })
      }
    })

    // 断开连接
    socket.on('disconnect', () => {
      // 从在线列表中移除
      for (const [studentId, socketId] of onlineStudents.entries()) {
        if (socketId === socket) {
          onlineStudents.delete(studentId)
          break
        }
      }
      console.log(`🔌 客户端断开：${socket.id}`)
    })
  })
}
