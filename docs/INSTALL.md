# 安装与运行指南

## 快速开始（5 分钟）

### 步骤 1：检查环境

确保已安装：
- ✅ Node.js >= 18.0.0
- ✅ npm >= 9.0.0
- ✅ MongoDB（可选，用于完整功能）

检查命令：
```bash
node -v
npm -v
```

### 步骤 2：安装依赖

```bash
cd ~/openclaw/workspace/light-contract
npm run install:all
```

预计耗时：2-5 分钟（取决于网络速度）

### 步骤 3：配置环境变量

```bash
cd server
cp .env.example .env
```

编辑 `.env` 文件（可选，使用默认值也可以）：
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/light-contract
NODE_ENV=development
```

### 步骤 4：启动 MongoDB（可选）

**如果没有 MongoDB，项目仍可运行（使用内存模式）**

#### macOS (Homebrew)
```bash
brew install mongodb-community
brew services start mongodb-community
```

#### Windows
下载安装：https://www.mongodb.com/try/download/community

#### Docker（推荐）
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 步骤 5：启动开发服务器

```bash
# 回到项目根目录
cd ~/openclaw/workspace/light-contract

# 一键启动（前端 + 后端）
npm run dev
```

启动后会看到：
```
🌟 光之契约·精灵森境 - 启动向导
================================
✅ Node.js 版本：v20.x.x
✅ npm 版本：9.x.x
✅ MongoDB 已连接
🚀 准备启动开发服务器...

学生端：http://localhost:3000
教师端：http://localhost:3001
后端：http://localhost:4000
```

### 步骤 6：打开浏览器访问

- **学生端**：http://localhost:3000
- **教师端**：http://localhost:3001

---

## 常见问题

### ❌ 问题 1：`npm run install:all` 失败

**解决方案：**
```bash
# 清除 npm 缓存
npm cache clean --force

# 删除 node_modules 和 lock 文件
rm -rf node_modules package-lock.json
rm -rf client/node_modules client/package-lock.json
rm -rf server/node_modules server/package-lock.json
rm -rf teacher-client/node_modules teacher-client/package-lock.json

# 重新安装
npm run install:all
```

### ❌ 问题 2：端口被占用

**错误信息：** `Error: listen EADDRINUSE: address already in use :::3000`

**解决方案：**
```bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程
kill -9 <PID>

# 或者修改端口（编辑 vite.config.ts）
```

### ❌ 问题 3：MongoDB 连接失败

**错误信息：** `MongooseServerSelectionError: connect ECONNREFUSED`

**解决方案：**
1. 检查 MongoDB 是否运行：`systemctl status mongod`
2. 重启 MongoDB：`sudo systemctl restart mongod`
3. 或者暂时不使用 MongoDB（项目会降级运行）

### ❌ 问题 4：页面空白

**可能原因：** 前端构建失败

**解决方案：**
```bash
# 清除构建缓存
cd client
rm -rf dist node_modules/.vite

# 重新构建
npm run build
```

---

## 开发命令速查

```bash
# 安装所有依赖
npm run install:all

# 启动开发环境（前端 + 后端）
npm run dev

# 只启动学生端
npm run dev:client

# 只启动教师端
npm run dev:teacher

# 只启动后端
npm run dev:server

# 构建生产版本
npm run build

# 启动生产环境
npm start
```

---

## 测试账号（开发环境）

### 学生端
- 学生 ID：`student-001`（自动创建）
- 首次访问会自动进入精灵缔结仪式

### 教师端
- 直接访问：http://localhost:3001
- 无需登录（开发环境）

---

## 下一步

安装完成后，你可以：

1. **体验学生端**
   - 完成精灵缔结仪式
   - 查看 3D 精灵
   - 浏览森林场景
   - 完成任务

2. **体验教师端**
   - 查看班级总览
   - 发布新任务
   - 查看学生列表

3. **开始开发**
   - 阅读 `docs/DEVELOPMENT.md`
   - 阅读 `docs/GAME_DESIGN.md`
   - 修改代码并查看效果

---

## 技术支持

遇到问题？

1. 查看文档：`docs/` 目录
2. 检查日志：终端输出
3. 重启试试：`Ctrl+C` 然后 `npm run dev`

祝你使用愉快！🌟
