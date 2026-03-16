# 光之契约·精灵森境 - 部署指南

## 生产环境部署

### 前置要求

- Node.js >= 18.0.0
- MongoDB >= 6.0
- Nginx（可选，用于反向代理）
- PM2（可选，用于进程管理）

---

## 方案一：Docker 部署（推荐）

### 1. 创建 Dockerfile

**Dockerfile**
```dockerfile
FROM node:20-alpine

WORKDIR /app

# 安装依赖
COPY package*.json ./
COPY client/package*.json ./client/
COPY teacher-client/package*.json ./teacher-client/
COPY server/package*.json ./server/

RUN npm run install:all

# 复制源代码
COPY . .

# 构建前端
RUN npm run build

# 暴露端口
EXPOSE 4000

# 启动命令
CMD ["npm", "start"]
```

### 2. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
      - "3001:3001"
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/light-contract
    depends_on:
      - mongo

  mongo:
    image: mongo:6
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

volumes:
  mongodb_data:
```

### 3. 启动服务

```bash
docker-compose up -d
```

### 4. 查看日志

```bash
docker-compose logs -f
```

---

## 方案二：传统部署

### 1. 安装依赖

```bash
cd ~/openclaw/workspace/light-contract
npm run install:all
```

### 2. 配置环境变量

```bash
cd server
cp .env.example .env
nano .env
```

修改配置：
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/light-contract
NODE_ENV=production
```

### 3. 构建前端

```bash
npm run build
```

### 4. 使用 PM2 启动

```bash
# 安装 PM2
npm install -g pm2

# 启动后端
cd server
pm2 start dist/index.js --name light-contract-server

# 查看状态
pm2 status

# 保存配置（开机自启）
pm2 save
pm2 startup
```

### 5. 配置 Nginx（可选）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 学生端
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 教师端
    location /teacher {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.io
    location /socket.io {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

重启 Nginx：
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 方案三：云服务器部署

### 阿里云 ECS

1. 购买 ECS 实例（推荐 2 核 4G 起步）
2. 安装 Node.js 和 MongoDB
3. 上传代码
4. 按"传统部署"步骤配置

### 腾讯云 CVM

同上，注意开放安全组端口：3000, 3001, 4000

---

## 数据库备份

### 手动备份

```bash
mongodump --uri="mongodb://localhost:27017/light-contract" --out=./backup
```

### 自动备份（cron）

```bash
# 每天凌晨 2 点备份
0 2 * * * mongodump --uri="mongodb://localhost:27017/light-contract" --out=/backup/light-contract-$(date +\%Y\%m\%d)
```

---

## 监控与日志

### 使用 PM2 监控

```bash
pm2 monit
pm2 logs light-contract-server
```

### 使用 MongoDB 监控

```bash
mongostat --host localhost:27017
```

---

## 故障排查

### 常见问题

**1. 端口被占用**
```bash
lsof -i :4000
kill -9 <PID>
```

**2. MongoDB 连接失败**
```bash
# 检查 MongoDB 状态
systemctl status mongod

# 重启 MongoDB
systemctl restart mongod
```

**3. 内存不足**
```bash
# 查看内存使用
free -h

# 优化 Node.js 内存
export NODE_OPTIONS="--max-old-space-size=4096"
```

---

## 性能优化建议

1. **启用 Gzip 压缩**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

2. **配置 CDN**（静态资源）

3. **数据库索引优化**
   ```javascript
   // 在常用查询字段上创建索引
   db.students.createIndex({ classId: 1 })
   db.tasks.createIndex({ classId: 1, dueDate: -1 })
   ```

4. **启用 Redis 缓存**（可选）

---

## 安全建议

1. 修改默认 JWT_SECRET
2. 启用 HTTPS
3. 配置防火墙
4. 定期更新依赖
5. 启用 MongoDB 认证
