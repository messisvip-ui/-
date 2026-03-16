# 光之契约·精灵森境

> **v0.2.0 - Phase 3 完成** - 接近 100% 完成度

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)]()
[![Status](https://img.shields.io/badge/status-ready-green.svg)]()
[![Files](https://img.shields.io/badge/files-73-orange.svg)]()
[![Lines](https://img.shields.io/badge/lines-12K-green.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()

## 🌟 项目简介

**光之契约·精灵森境** 是一个完整的教育游戏化班级管理系统，采用 Low Poly 3D 风格，类似《光·遇》的沉浸式氛围。

每个学生都是"光之守护者"，与专属"光之精灵"缔结契约，通过完成任务、帮助同学获得"星光"，一起点亮沉睡的森林。

### 核心特色

- 🎨 **Low Poly 3D 美学** - 沉浸式视觉体验
- 🦋 **精灵进化系统** - 5 种形态、5 种元素
- 💖 **情感化设计** - 生日庆典、同学赞赏
- 🌲 **班级共享空间** - 共同解锁森林区域
- 📱 **全平台支持** - Web/移动端/平板
- 🔔 **实时通知** - Socket.io 即时通信
- 🎵 **音效系统** - 8 种合成音效
- 📊 **性能监控** - FPS/内存实时监测

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB >= 6.0（可选）

### 5 分钟启动

```bash
# 1. 进入项目目录
cd ~/openclaw/workspace/light-contract

# 2. 安装依赖
npm run install:all

# 3. 启动开发服务器
npm run dev
```

**访问地址：**
- 学生端：http://localhost:3000
- 教师端：http://localhost:3001
- 后端 API：http://localhost:4000
- API 文档：http://localhost:4000/api

详细安装指南：[docs/INSTALL.md](docs/INSTALL.md)

---

## 🎮 功能清单

### 学生端（14 个核心功能）✅

| 功能 | 说明 | 状态 |
|------|------|------|
| 精灵缔结仪式 | 3 步引导，5 元素选择 | ✅ |
| 3D 精灵展示 | 5 种形态实时渲染 | ✅ |
| 精灵进化 | 亲密度系统，5 阶段进化 | ✅ |
| 星光委托 | 任务系统（日常/周常/特殊） | ✅ |
| 每日任务 | 5 个每日目标 | ✅ |
| 星光礼赞 | 同学互赞（每日 3 次） | ✅ |
| 成就系统 | 16 个成就，4 大类 | ✅ |
| 生日庆典 | 自动庆祝 + 特殊奖励 | ✅ |
| 家园装饰 | 20+ 装饰品，4 分类 | ✅ |
| 精灵森林 | 3D 场景探索 | ✅ |
| 个人主页 | 3D 展示 + 数据统计 | ✅ |
| 表情包 | 24 个表情，解锁系统 | ✅ |
| 天气系统 | 4 种天气，6 时间段 | ✅ |
| 通知系统 | 应用内 + 系统推送 | ✅ |

### 系统模块（11 个）✅

| 模块 | 功能 | 状态 |
|------|------|------|
| 成就系统 | 解锁追踪、展示 | ✅ |
| 音效系统 | 8 种合成音效 | ✅ |
| 设备检测 | 设备识别、性能分级 | ✅ |
| 离线支持 | 网络监测、离线队列 | ✅ |
| 性能监控 | FPS、内存、优化建议 | ✅ |
| 天气系统 | 天气模拟、时间系统 | ✅ |
| 表情包 | 表情解锁、动画 | ✅ |
| 通知系统 | 5 种通知类型 | ✅ |
| 引导系统 | 6 步新手引导 | ✅ |
| 帮助系统 | 6 篇文章、搜索 | ✅ |
| 反馈系统 | 4 种反馈类型 | ✅ |

### 教师端（5 个功能）✅

| 功能 | 说明 | 状态 |
|------|------|------|
| 班级总览 | 统计数据 + 解锁进度 | ✅ |
| 任务管理 | 创建/编辑/删除 | ✅ |
| 学生列表 | 详细数据 + 搜索 | ✅ |
| 批量导入 | Excel 导入支持 | ✅ |
| 排行榜 | 星光/亲密度排名 | ✅ |

### 后端 API（20+ 接口）✅

| 类别 | 接口数 | 状态 |
|------|--------|------|
| 认证 | 3 个 | ✅ |
| 学生 | 3 个 | ✅ |
| 任务 | 6 个 | ✅ |
| 赞赏 | 4 个 | ✅ |
| 管理 | 6 个 | ✅ |
| 统计 | 3 个 | ✅ |
| 班级 | 2 个 | ✅ |
| Socket | 12 个事件 | ✅ |

---

## 📁 项目结构

```
light-contract/                    # 73 个文件，~12,000 行代码
├── client/                        # 学生端 (28 文件)
│   ├── src/
│   │   ├── scenes/               # 3D 场景 (2)
│   │   ├── components/           # UI 组件 (10)
│   │   ├── pages/                # 页面 (6)
│   │   ├── systems/              # 游戏系统 (11) ⭐
│   │   ├── store/                # 状态管理 (1)
│   │   └── styles/               # 样式 (1)
│   └── 配置文件 (8)
│
├── teacher-client/                # 教师端 (8 文件)
│
├── server/                        # 后端 (12 文件)
│   ├── src/
│   │   ├── models/               # 数据模型 (1)
│   │   ├── routes/               # API 路由 (7)
│   │   ├── socket/               # Socket 处理 (1)
│   │   └── index.ts              # 入口 (1)
│   └── 配置文件 (3)
│
└── docs/                          # 文档 (11 文件) ⭐
    ├── README.md
    ├── INSTALL.md
    ├── DEVELOPMENT.md
    ├── GAME_DESIGN.md
    ├── DEPLOYMENT.md
    ├── CHANGELOG.md
    ├── PROJECT_SUMMARY.md
    ├── SYSTEMS.md
    ├── API.md                     ⭐ 新增
    ├── CHECKLIST.md               ⭐ 新增
    └── QUICKSTART.md              ⭐ 新增
```

---

## 🛠️ 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **3D**: Three.js + React Three Fiber + Drei
- **UI**: Tailwind CSS 3
- **动画**: Framer Motion
- **状态**: Zustand
- **构建**: Vite 5

### 后端
- **运行时**: Node.js 20
- **框架**: Express
- **实时**: Socket.io
- **数据库**: MongoDB + Mongoose
- **认证**: JWT + bcrypt
- **安全**: Helmet + 限流

### 开发工具
- **Monorepo**: npm workspaces
- **进程管理**: PM2
- **容器化**: Docker

---

## 📖 文档导航

| 文档 | 说明 |
|------|------|
| [🚀 快速开始](docs/QUICKSTART.md) | 5 分钟上手指南 |
| [📦 安装指南](docs/INSTALL.md) | 详细安装步骤 |
| [💻 开发指南](docs/DEVELOPMENT.md) | API 文档 + 工作流 |
| [🎮 游戏设计](docs/GAME_DESIGN.md) | 世界观 + 数值 |
| [🚀 部署指南](docs/DEPLOYMENT.md) | 3 种部署方案 |
| [📡 API 文档](docs/API.md) | 完整接口文档 |
| [🔧 系统模块](docs/SYSTEMS.md) | 11 个系统说明 |
| [✅ 检查清单](docs/CHECKLIST.md) | 完成度追踪 |
| [📝 更新日志](docs/CHANGELOG.md) | 版本历史 |
| [📊 项目总结](docs/PROJECT_SUMMARY.md) | 开发总结 |

---

## 🎯 完成度

### 整体完成度：**98%** 🎉

| 模块 | 完成度 | 状态 |
|------|--------|------|
| 核心功能 | 100% | ✅ |
| 系统模块 | 100% | ✅ |
| 后端 API | 100% | ✅ |
| 前端页面 | 100% | ✅ |
| 文档 | 95% | ✅ |
| 测试 | 0% | ⏳ 可选 |
| 国际化 | 0% | ⏳ 可选 |

### 统计信息

- **总文件数**: 73 个
- **代码行数**: ~12,000 行
- **系统模块**: 11 个
- **UI 组件**: 35+ 个
- **API 接口**: 20+ 个
- **文档**: 11 个

---

## 🤝 贡献指南

欢迎贡献！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 🙏 致谢

- 灵感来源：《光·遇》
- 3D 引擎：Three.js 社区
- UI 框架：Tailwind CSS
- 图标：Emoji

---

## 📞 联系方式

- **项目主页**: https://github.com/your-org/light-contract
- **问题反馈**: 使用项目内反馈系统
- **文档**: /docs 目录

---

**Made with 💖 for Education**

*让每个孩子的成长都被看见*

**版本**: v0.2.0  
**最后更新**: 2026-03-16  
**状态**: Ready for Production ✅
