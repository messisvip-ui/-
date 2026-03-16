# 开发指南

## 项目结构

```
light-contract/
├── client/              # 学生端前端 (React + Three.js)
├── teacher-client/      # 教师端前端 (React)
├── server/              # 后端服务器 (Node.js + Express + Socket.io)
└── docs/                # 文档
```

## 环境要求

- Node.js >= 18.0.0
- MongoDB >= 6.0
- npm >= 9.0.0

## 快速开始

### 1. 安装依赖

```bash
# 在项目根目录执行
npm run install:all
```

### 2. 配置环境变量

```bash
# 复制服务器环境变量模板
cd server
cp .env.example .env

# 编辑 .env 文件，配置 MongoDB 连接
```

### 3. 启动 MongoDB

```bash
# macOS (使用 Homebrew)
brew services start mongodb-community

# Windows
# 启动 MongoDB 服务

# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. 启动开发服务器

```bash
# 在项目根目录
npm run dev
```

这将同时启动：
- 学生端前端：http://localhost:3000
- 教师端前端：http://localhost:3001
- 后端服务器：http://localhost:4000

## 开发工作流

### 前端开发

```bash
# 只启动学生端
npm run dev:client

# 只启动教师端
npm run dev:teacher
```

### 后端开发

```bash
# 只启动后端
npm run dev:server
```

### 构建生产版本

```bash
npm run build
npm start
```

## 数据库模型

详见 `server/src/models/index.ts`

### 核心模型

- **Student** - 学生信息
- **Sprite** - 精灵信息
- **Task** - 任务/委托
- **Praise** - 赞赏/礼赞
- **Class** - 班级信息
- **Teacher** - 教师信息

## API 接口

### 学生相关

- `GET /api/students/:id` - 获取学生信息
- `POST /api/students` - 创建学生
- `PATCH /api/students/:id/starlight` - 更新星光

### 任务相关

- `GET /api/tasks?classId=xxx` - 获取任务列表
- `POST /api/tasks` - 创建任务
- `PATCH /api/tasks/:id/complete` - 完成任务

### 赞赏相关

- `GET /api/praises/received/:studentId` - 获取收到的赞赏
- `POST /api/praises` - 发送赞赏

## Socket.io 事件

### 客户端 → 服务器

- `join-student` - 加入学生房间
- `get-student-data` - 获取学生数据
- `get-tasks` - 获取任务列表
- `add-starlight` - 添加星光
- `add-intimacy` - 添加亲密度
- `complete-task` - 完成任务
- `send-praise` - 发送赞赏

### 服务器 → 客户端

- `student-data` - 学生数据
- `tasks-list` - 任务列表
- `class-starlight-update` - 班级星光更新
- `praise-received` - 收到赞赏
- `task-completed` - 任务完成

## 3D 资源

### 精灵模型

位置：`client/public/assets/models/`

格式建议：`.glb` 或 `.gltf`（glTF 二进制格式）

### 纹理贴图

位置：`client/public/assets/textures/`

格式建议：`.png`（支持透明通道）

### 音频文件

位置：`client/public/assets/audio/`

- BGM：`.mp3` 或 `.ogg`
- 音效：`.wav` 或 `.mp3`

## 测试

```bash
# 运行测试（待实现）
npm test
```

## 部署

### Docker 部署（推荐）

```bash
# 构建镜像
docker build -t light-contract .

# 运行容器
docker run -d -p 3000:3000 -p 4000:4000 light-contract
```

### 传统部署

1. 构建前端：`npm run build`
2. 启动后端：`npm start`
3. 配置 Nginx 反向代理

## 常见问题

### MongoDB 连接失败

确保 MongoDB 服务正在运行，检查 `.env` 中的连接字符串。

### 端口被占用

修改对应服务的端口号：
- 学生端：`client/vite.config.ts`
- 教师端：`teacher-client/vite.config.ts`
- 后端：`server/.env`

## 下一步开发计划

1. ✅ 项目脚手架
2. ⏳ 3D 精灵模型与动画
3. ⏳ 完整的任务系统
4. ⏳ 班级森林 3D 场景
5. ⏳ 生日庆典系统
6. ⏳ 成就系统

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request
