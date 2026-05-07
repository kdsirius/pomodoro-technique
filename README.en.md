<p align="right">
  <strong>English</strong> | <a href="README.md">中文</a>
</p>

# Pomodoro Timer

A desktop Pomodoro timer built with **Electron**, featuring a glassmorphism-style UI to help you stay focused through work and break cycles.

## Features

-  **25 min focus / 5 min break** — classic Pomodoro technique with auto-switch and system notifications
-  **Glassmorphism UI** — frosted glass cards, floating orb backgrounds, soft quad-color gradient; theme shifts between green (focus) and blue-purple (break)
-  **SVG ring countdown** — real-time progress with pulsing glow animation while running
-  **Frameless window** — compact 360×480 size, draggable title bar, one-click close
-  **Portable** — double-click to run, or package as a standalone Windows executable

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│  main.js     │────▶│  preload.js   │────▶│  renderer/        │
│  Electron    │     │  contextBridge│     │  index.html       │
│  main process│     │  API bridge   │     │  style.css        │
└─────────────┘     └──────────────┘     │  renderer.js      │
                                          └──────────────────┘
```

- **Main process** (`main.js`) — creates a frameless transparent window with `nodeIntegration` disabled and `contextIsolation` enabled
- **Bridge layer** (`preload.js`) — safely exposes `notify()` API via `contextBridge.exposeInMainWorld`
- **Renderer process** (`renderer/`) — pure browser environment (HTML + CSS + JavaScript), no direct Node.js access

### Key Mechanisms

| Module | Implementation |
|--------|---------------|
| Timer | `setInterval(1000ms)` drives countdown |
| Ring animation | SVG `<circle>` `stroke-dashoffset` CSS transition |
| Theme switching | CSS custom properties (`--grad-start`, `--grad-end`, `--current-glow`) updated at runtime |
| Glassmorphism | `backdrop-filter: blur(20px) saturate(1.5)` + semi-transparent background |
| System notification | `new Notification()` bridged to renderer via preload |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9

### Installation

```bash
git clone git@github.com:kdsirius/pomodoro-technique.git
cd pomodoro-technique
npm install
```

> If you are in China, you may need a mirror for Electron:
> ```bash
> export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
> ```

### Run

```bash
npm start
```

### Package

```bash
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ npm run pack
```

Output goes to `dist/pomodoro-win32-x64/`. Double-click `pomodoro.exe` to launch.

## Project Structure

```
pomodoro-technique/
├── main.js                # Electron main process
├── preload.js             # Secure bridge layer
├── renderer/
│   ├── index.html         # Main UI
│   ├── style.css          # Glassmorphism styles
│   └── renderer.js        # Timer logic
├── package.json
└── CLAUDE.md              # Claude Code project guidance
```

## Claude Code Integration

This project includes a `CLAUDE.md` file that provides project context (architecture, constraints, common commands) to Claude Code, an AI coding assistant.

Local Claude Code configuration (`.claude/` directory) is auto-generated per developer and should not be committed to version control.

## License

MIT © kdsirius
