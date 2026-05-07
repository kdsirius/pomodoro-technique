# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

桌面番茄钟 (Desktop Pomodoro Timer) — 一个基于 Electron 的番茄钟应用，360×480 无边框窗口，液态玻璃（Glassmorphism）风格 UI。

## Commands

```bash
npm start          # 启动应用（开发）
npm run pack       # 打包为 Windows 可执行程序到 dist/ 目录
```

无构建步骤、无测试、无 lint 配置。

## Architecture

**Electron 主进程 → 渲染进程** 三层结构：

- `main.js` — 主进程，创建 360×480 frameless 半透明 BrowserWindow，禁用 nodeIntegration 并启用 contextIsolation
- `preload.js` — 安全桥接，通过 `contextBridge.exposeInMainWorld('pomodoroAPI', ...)` 暴露 `notify(title, body)` 系统通知
- `renderer/` — 前端代码运行于纯浏览器环境，不可直接访问 Node API

**计时器逻辑** (`renderer.js`):
- 使用 `setInterval(1000ms)` 驱动倒计时
- SVG `<circle>` 的 `stroke-dashoffset` 控制圆环进度动画（周长 ≈ 603.19，`0.8s cubic-bezier` 过渡）
- 25 分钟专注 / 5 分钟休息，倒计时结束自动切换模式并调用 `window.pomodoroAPI.notify()` 发送系统通知
- 暂停时清除 interval，`timer-ring` 移除 `running` class 终止辉光动画

**UI 主题切换** (`renderer.js` → `style.css`):
- 通过 CSS 变量实现工作/休息色彩切换：专注模式为绿色系 (`#34d399` → `#06b6d4`)，休息模式为蓝紫色系 (`#60a5fa` → `#a78bfa`)
- 运行时调用 `setTheme(mode)` 更新 `--grad-start`、`--grad-end`、`--current-glow` 三个变量
- 渐变色圆环通过 SVG `<linearGradient>` + `<stop>` 元素的 `stop-color` 与 CSS 变量绑定实现

**液态玻璃 UI** (`style.css`):
- `.glass-card` 使用 `backdrop-filter: blur(20px) saturate(1.5)` + 半透明白色背景实现毛玻璃效果
- 三层浮动光斑背景 (`.orb-1~3`) 使用 `radial-gradient` + `blur(60px)` + 浮动关键帧动画
- 渐变按钮 `btn-start` 用 `linear-gradient(135deg, var(--grad-start), var(--grad-end))` 跟随主题色
- 整体渐变背景 `linear-gradient(135deg, #e0f2fe, #f0fdf4, #fdf4ff, #fef9c3)` 柔和四色过渡

**窗口控制**:
- 标题栏 `-webkit-app-region: drag` 实现无边框拖拽，按钮区域标记 `no-drag`
- `.btn-close` 调用 `window.close()` 关闭窗口

## Key Constraints

- renderer 进程中所有与 Electron 的交互必须通过 `window.pomodoroAPI`，不得使用 `require()` 或 nodeIntegration
- 窗口固定 360×480，不可调整大小（`resizable: false`）
- `renderer.js` 使用 IIFE 包裹，全局命名空间不暴露任何变量

## Packaging

```bash
# 使用 electron-packager，需设置镜像以绕过 GitHub 下载限制
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ npm run pack
```

输出到 `dist/番茄钟-win32-x64/`，使用 `--asar` 压缩 app 代码为 `resources/app.asar`。
