<p align="right">
  <a href="README.en.md">English</a> | <strong>中文</strong>
</p>

# 番茄钟 - Pomodoro Timer

一款基于 **Electron** 的桌面番茄钟应用，采用液态玻璃（Glassmorphism）风格 UI，帮助你在工作与休息之间保持专注节奏。

## 核心特性

-  **专注 25 分 / 休息 5 分** — 经典的番茄工作法，倒计时结束自动切换并发送系统通知
-  **液态玻璃 UI** — 毛玻璃卡片、浮动光斑背景、柔和四色渐变，跟随专注/休息模式切换主题色（绿 & 蓝紫）
-  **SVG 圆环倒计时** — 实时进度反馈，运行时伴有动态辉光脉冲动画
-  **无边框窗口** — 360×480 紧凑尺寸，标题栏拖拽，一键关闭
-  **即开即用** — 双击运行，也可打包为 Windows 可执行程序分发

## 技术架构

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│  main.js     │────▶│  preload.js   │────▶│  renderer/        │
│  Electron    │     │  contextBridge│     │  index.html       │
│  主进程       │     │  API 桥接      │     │  style.css        │
└─────────────┘     └──────────────┘     │  renderer.js      │
                                          └──────────────────┘
```

- **主进程** (`main.js`) — 创建 frameless 半透明窗口，禁用 `nodeIntegration`，开启 `contextIsolation`
- **桥接层** (`preload.js`) — 通过 `contextBridge.exposeInMainWorld` 安全暴露 `notify()` API
- **渲染进程** (`renderer/`) — 纯浏览器环境，HTML + CSS + JavaScript，不可直接访问 Node API

### 关键机制

| 模块 | 实现方式 |
|------|----------|
| 计时器 | `setInterval(1000ms)` 驱动倒计时 |
| 圆环动画 | SVG `<circle>` 的 `stroke-dashoffset` 属性过渡 |
| 主题色切换 | CSS 自定义属性（`--grad-start`、`--grad-end`、`--current-glow`）运行时更新 |
| 毛玻璃效果 | `backdrop-filter: blur(20px) saturate(1.5)` + 半透明背景 |
| 系统通知 | `new Notification()` 通过 preload 桥接至渲染进程 |

## 开始使用

### 前置要求

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9

### 安装

```bash
git clone git@github.com:kdsirius/pomodoro-technique.git
cd pomodoro-technique
npm install
```

> 在中国大陆安装 Electron 时可能需要设置镜像源：
> ```bash
> export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
> ```

### 运行

```bash
npm start
```

### 打包

```bash
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ npm run pack
```

输出到 `dist/番茄钟-win32-x64/`，双击 `番茄钟.exe` 即可运行。

## 项目结构

```
pomodoro-technique/
├── main.js                # Electron 主进程
├── preload.js             # 安全桥接层
├── renderer/
│   ├── index.html         # 主界面
│   ├── style.css          # 液态玻璃样式
│   └── renderer.js        # 计时器逻辑
├── package.json
└── CLAUDE.md              # Claude Code 项目指引
```

## Claude Code 集成

本项目包含 `CLAUDE.md`，为 Claude Code（AI 编码助手）提供项目上下文，包括架构说明、关键约束和常用命令。

本地开发时，Claude Code 会在 `.claude/` 目录自动生成权限配置，无需提交到版本控制。

## License

MIT © kdsirius
