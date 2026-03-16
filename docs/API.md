# API 文档

## 基础信息

- **Base URL**: `http://localhost:4000/api`
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON

---

## 认证接口

### POST /auth/register
教师注册

**请求体**:
```json
{
  "name": "张老师",
  "email": "teacher@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "success": true,
  "teacher": {
    "id": "...",
    "name": "张老师",
    "email": "teacher@example.com"
  },
  "token": "eyJhbGc..."
}
```

### POST /auth/login
教师登录

**请求体**:
```json
{
  "email": "teacher@example.com",
  "password": "password123"
}
```

### GET /auth/me
获取当前教师信息

**请求头**: `Authorization: Bearer <token>`

---

## 学生接口

### GET /students/:id
获取学生信息

### POST /students
创建学生

**请求体**:
```json
{
  "name": "李明",
  "classId": "...",
  "spriteData": {
    "name": "小光",
    "element": "light"
  }
}
```

### PATCH /students/:id/starlight
更新学生星光

**请求体**:
```json
{
  "amount": 10
}
```

---

## 任务接口

### GET /tasks
获取任务列表

**查询参数**:
- `classId`: 班级 ID
- `type`: 任务类型（daily/weekly/special）
- `page`: 页码
- `limit`: 每页数量

### POST /tasks
创建任务

**请求体**:
```json
{
  "title": "晨间守护者",
  "description": "按时到校",
  "story": "清晨的阳光...",
  "type": "daily",
  "classId": "...",
  "starlightReward": 15,
  "intimacyReward": 5,
  "dueDate": "2026-03-17"
}
```

### PATCH /tasks/:id
更新任务

### DELETE /tasks/:id
删除任务

### PATCH /tasks/:id/complete
完成任务

**请求体**:
```json
{
  "studentId": "..."
}
```

**响应**:
```json
{
  "success": true,
  "rewards": {
    "starlight": 15,
    "intimacy": 5
  }
}
```

---

## 赞赏接口

### GET /praises
获取赞赏列表

**查询参数**:
- `classId`: 班级 ID
- `page`: 页码
- `limit`: 每页数量

### POST /praises
发送赞赏

**请求体**:
```json
{
  "fromStudentId": "...",
  "fromStudentName": "李明",
  "toStudentId": "...",
  "message": "谢谢你帮助我！"
}
```

### DELETE /praises/:id
删除赞赏（管理员）

---

## 管理接口

### GET /admin/classes/:id
获取班级详情

### GET /admin/classes/:id/stats
获取班级统计

**响应**:
```json
{
  "success": true,
  "stats": {
    "totalStudents": 45,
    "totalStarlight": 12580,
    "avgStarlight": 280,
    "avgIntimacy": "6.5",
    "completionRate": 78
  }
}
```

### POST /admin/students/batch
批量导入学生

**请求体**:
```json
{
  "classId": "...",
  "students": [
    {
      "name": "李明",
      "birthday": "2015-05-20",
      "spriteName": "小光",
      "element": "light"
    }
  ]
}
```

---

## 统计接口

### GET /stats/leaderboard
获取排行榜

**查询参数**:
- `classId`: 班级 ID
- `type`: 类型（starlight/intimacy）
- `limit`: 数量

**响应**:
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "name": "李明",
      "value": 1250,
      "sprite": {...}
    }
  ]
}
```

### GET /stats/activities
获取活动记录

---

## 班级接口

### POST /class/unlock-area
解锁区域

**请求体**:
```json
{
  "classId": "...",
  "areaId": "star-lake"
}
```

### GET /class/areas/progress
获取区域解锁进度

---

## Socket.io 事件

### 客户端 → 服务器

| 事件 | 参数 | 说明 |
|------|------|------|
| `join-student` | studentId | 加入学生房间 |
| `get-student-data` | studentId | 获取学生数据 |
| `get-tasks` | - | 获取任务列表 |
| `add-starlight` | studentId, amount | 添加星光 |
| `add-intimacy` | spriteId, amount | 添加亲密度 |
| `complete-task` | studentId, taskId | 完成任务 |
| `send-praise` | data, callback | 发送赞赏 |

### 服务器 → 客户端

| 事件 | 数据 | 说明 |
|------|------|------|
| `student-data` | student, sprite | 学生数据 |
| `tasks-list` | tasks | 任务列表 |
| `class-starlight-update` | total | 班级星光更新 |
| `praise-received` | praise | 收到赞赏 |
| `task-completed` | rewards | 任务完成 |

---

## 错误响应

### 400 Bad Request
```json
{
  "error": "数据验证失败",
  "details": "字段不能为空"
}
```

### 401 Unauthorized
```json
{
  "error": "认证失败"
}
```

### 404 Not Found
```json
{
  "error": "资源不存在"
}
```

### 500 Internal Server Error
```json
{
  "error": "服务器内部错误"
}
```

---

## 速率限制

- **窗口**: 15 分钟
- **限制**: 100 请求/IP

---

## 示例代码

### JavaScript
```javascript
// 登录
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'teacher@example.com',
    password: 'password123'
  })
})

const { token } = await response.json()

// 创建任务
await fetch('/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: '新任务',
    description: '任务描述',
    classId: '...',
    starlightReward: 20,
    intimacyReward: 10,
    dueDate: '2026-03-20'
  })
})
```

### React Hook
```typescript
import { useGameStore } from '@/store/gameStore'

function TaskComponent() {
  const { tasks, completeTask } = useGameStore()
  
  const handleComplete = (taskId: string) => {
    completeTask(taskId)
  }
  
  return (
    <div>
      {tasks.map(task => (
        <button key={task.id} onClick={() => handleComplete(task.id)}>
          完成任务
        </button>
      ))}
    </div>
  )
}
```

---

**最后更新**: 2026-03-16  
**版本**: v0.2.0
