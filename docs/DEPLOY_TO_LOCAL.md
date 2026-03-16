# 部署到本地电脑/教室一体机指南

## 📦 方案一：打包成独立应用（推荐）

### 步骤 1：构建生产版本

```bash
cd ~/openclaw/workspace/light-contract

# 构建前端
npm run build

# 构建完成后，会生成 dist/ 目录
```

### 步骤 2：复制到其他电脑

构建完成后，你会得到：
```
light-contract/
├── client/dist/          # 学生端（静态文件）
├── teacher-client/dist/  # 教师端（静态文件）
└── server/               # 后端（Node.js 应用）
```

**复制到 U 盘或网络共享**：
```bash
# 打包整个项目
tar -czf light-contract-deploy.tar.gz \
  client/dist \
  teacher-client/dist \
  server \
  package.json \
  docs/
```

### 步骤 3：在目标电脑上运行

#### 方法 A：使用 Node.js 运行（需要安装 Node.js）

```bash
# 1. 解压文件
tar -xzf light-contract-deploy.tar.gz
cd light-contract

# 2. 安装依赖（只需要一次）
npm install --production

# 3. 启动服务
npm start
```

访问：
- 学生端：http://localhost:3000
- 教师端：http://localhost:3001

#### 方法 B：使用 Docker（推荐，无需安装 Node.js）

创建 `Dockerfile`：
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY client/dist ./client/dist
COPY teacher-client/dist ./teacher-client/dist
COPY server ./server

RUN npm install --production

EXPOSE 3000 3001 4000

CMD ["npm", "start"]
```

运行：
```bash
docker build -t light-contract .
docker run -d -p 3000:3000 -p 3001:3001 -p 4000:4000 light-contract
```

---

## 📦 方案二：绿色版（无需安装）

### 创建启动脚本

创建 `start-windows.bat`（Windows 版）：
```batch
@echo off
echo 🚀 启动光之契约·精灵森境...
cd /d %~dp0

echo 正在启动学生端...
start http://localhost:3000

echo 正在启动教师端...
start http://localhost:3001

echo 正在启动后端...
node server/dist/index.js

pause
```

创建 `start-linux.sh`（Linux 版）：
```bash
#!/bin/bash
echo "🚀 启动光之契约·精灵森境..."
cd "$(dirname "$0")"

# 启动后端
node server/dist/index.js &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 打开浏览器
xdg-open http://localhost:3000 &
xdg-open http://localhost:3001 &

echo "✅ 服务已启动！"
echo "学生端：http://localhost:3000"
echo "教师端：http://localhost:3001"
echo "按 Ctrl+C 停止服务"

wait $BACKEND_PID
```

---

## 📦 方案三：离线演示版（最简单）

### 创建纯静态版本

如果只需要演示，可以创建不需要后端的版本：

```bash
# 1. 构建前端
cd client
npm run build

# 2. 使用任意 HTTP 服务器运行
# 方法 A：使用 Python
cd dist
python3 -m http.server 8000

# 方法 B：使用 http-server（需要 npm）
npx http-server dist -p 8000

# 方法 C：直接打开 HTML 文件（不推荐，部分功能受限）
```

---

## 🎯 针对教室一体机的特殊配置

### 开机自启动（Windows）

1. 按 `Win + R`，输入 `shell:startup`
2. 创建启动脚本的快捷方式
3. 设置为最小化运行

### 开机自启动（Linux）

创建 systemd 服务：
```ini
# /etc/systemd/system/light-contract.service
[Unit]
Description=光之契约·精灵森境
After=network.target

[Service]
Type=simple
User=teacher
WorkingDirectory=/opt/light-contract
ExecStart=/usr/bin/node server/dist/index.js
Restart=always

[Install]
WantedBy=multi-user.target
```

启用服务：
```bash
sudo systemctl enable light-contract
sudo systemctl start light-contract
```

---

## 📊 完整部署清单

### 准备阶段
- [ ] 构建生产版本 `npm run build`
- [ ] 测试构建结果
- [ ] 准备 U 盘或网络存储

### 部署阶段
- [ ] 复制文件到目标电脑
- [ ] 安装 Node.js（如果需要）
- [ ] 安装依赖 `npm install --production`
- [ ] 配置防火墙端口（3000, 3001, 4000）

### 测试阶段
- [ ] 启动服务
- [ ] 访问学生端
- [ ] 访问教师端
- [ ] 测试基本功能

### 配置阶段
- [ ] 设置开机自启动
- [ ] 配置 MongoDB（可选）
- [ ] 创建教师账号

---

## 🔧 常见问题

### Q: 目标电脑没有 Node.js 怎么办？
A: 使用 Docker 方案，或者下载 Node.js 安装包：https://nodejs.org/

### Q: 教室电脑不能上网？
A: 提前下载好 Node.js 安装包和项目文件，离线安装

### Q: 如何重置所有数据？
A: 删除 localStorage 或重启 MongoDB

### Q: 多台电脑如何共享数据？
A: 需要部署到服务器，配置 MongoDB

---

## 📝 快速部署命令

```bash
# 在一台电脑上执行一次：
cd ~/openclaw/workspace/light-contract
npm run build
tar -czf deploy-package.tar.gz client/dist teacher-client/dist server package.json
# 然后把 deploy-package.tar.gz 拷贝到 U 盘

# 在教室电脑上执行：
tar -xzf deploy-package.tar.gz
cd light-contract
npm install --production
npm start
```

---

**部署完成后访问：**
- 学生端：http://目标电脑 IP:3000
- 教师端：http://目标电脑 IP:3001
