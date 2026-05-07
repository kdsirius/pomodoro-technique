# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

桌面番茄钟 (Desktop Pomodoro Timer) — 一个基于 Electron 的极简番茄钟应用，360×480 无边框窗口，深色主题。

## Commands

```bash
npm start          # 启动应用
```

No build step, no tests, no linting configured.

## Architecture

**Electron 主进程 → 渲染进程** 三层结构：

- `main.js` — 主进程，创建 frameless BrowserWindow，禁用 nodeIntegration，启用 contextIsolation
- `preload.js` — 安全桥接层，通过 `contextBridge.exposeInMainWorld` 暴露 `pomodoroAPI.notify(title, body)`
- `renderer/` — 前端代码（HTML + CSS + JS），纯浏览器环境，不能直接访问 Node API

**计时器逻辑**：`renderer.js` 使用 `setInterval(1000ms)` 倒计时，SVG circle 的 `stroke-dashoffset` 驱动圆环动画。工作 25 分钟 / 休息 5 分钟，倒计时结束自动切换模式并调用 `window.pomodoroAPI.notify()` 发系统通知。

**颜色切换**：通过 CSS 变量 `--current-color` 实现工作(绿)/休息(蓝)主题色切换。

## Key Constraints

- renderer 进程中所有与 Electron 的交互必须通过 `window.pomodoroAPI`，不得使用 `require()` 或 `nodeIntegration`
- 窗口不可调整大小，固定 360×480
- 无标题栏拖拽区域由 CSS `-webkit-app-region: drag` 控制，按钮区域标记为 `no-drag`
