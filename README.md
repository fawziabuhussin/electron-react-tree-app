# TreeBuilder 2025 _(Electron + React Flow)_

**منشئ الشجرة 2025** is a modern desktop tool for creating, editing, and exporting hierarchical trees.  
It is built with **Electron 25**, **React 18**, **Vite 5**, and **React-Flow 11** and runs on **Windows** and **macOS** (Intel + Apple Silicon).

---

## ✨ Key features
| | |
|---|---|
| **Visual tree editor** | Drag-friendly canvas, custom nodes, collapse / expand, mini-map & grid |
| **Multi-language UI**  | Instant switch between **Arabic** & **English** (add your own strings in `strings.js`) |
| **Color picker**       | Swatches + HEX picker (react-colorful) |
| **Export**             | Save tree as **PNG**, **PDF**, or **JSON** |
| **Portable build**     | Single-file `.exe` for Windows, signed/notarised `.dmg` for macOS (optional) |

---

## ⚡ Quick start (for developers)

```bash
git clone https://github.com/YourName/electron-react-tree-app.git
cd electron-react-tree-app
npm install         # ⏳  installs all dependencies

# 1️⃣  React / Vite dev-server on http://localhost:3000
npm run dev

# 2️⃣  (in another terminal) open Electron window using that dev server
npm start
```

*Reload* app: **Ctrl + R**  Open DevTools: **Ctrl + Shift + I**

---

## 🏗️ Build a desktop release

```bash
# Cleans old artefacts (PowerShell)
Remove-Item dist,release -Recurse -Force
# or (bash/zsh):  rm -rf dist release

# Builds renderer (Vite) → packs with electron-builder
npm run build
```

### Where do the installers end up?

| OS      | Output files (in `release/`)                       | Notes |
|---------|----------------------------------------------------|-------|
| Windows | `TreeBuilder2025-0.x.x-x64.exe` <br> `…-ia32.exe`  | Portable, no install needed |
| macOS   | `TreeBuilder2025-0.x.x-arm64.dmg` <br> `…-x64.dmg` | Unsigned for testing; notarise for public distribution |
| macOS   | `TreeBuilder2025-0.x.x-*.zip` _(optional)_         | Same app, zipped |

> **Tip:** macOS builds **must** be compiled on macOS (or a macOS CI runner) to enable signing/notarisation.

---

## 📦 Download ready-made builds

Latest binaries are always in **GitHub Releases**:

| Platform | Download |
|----------|----------|
| Windows (x64) Portable | [TreeBuilder2025-Win-x64.exe](https://github.com/fawziabuhussin/electron-react-tree-app/releases/latest) |
| Windows (32-bit) Portable | [TreeBuilder2025-Win-ia32.exe](https://github.com/fawziabuhussin/electron-react-tree-app/releases/latest) |
| macOS (Apple Silicon) DMG | [TreeBuilder2025-macOS-arm64.dmg](https://github.com/fawziabuhussin/electron-react-tree-app/releases/latest) |
| macOS (Intel) DMG | [TreeBuilder2025-macOS-x64.dmg](https://github.com/fawziabuhussin/electron-react-tree-app/releases/latest) |

> ⚠️ If Gatekeeper blocks the app, open **System Settings → Privacy & Security → Open Anyway** (or notarise & sign to avoid this).

---

## 🗺️ Folder structure (simplified)

```
src/
  renderer/
    App.jsx           # main UI
    CustomNode.jsx
    strings.js        # i18n dictionaries
    style.css
  main.js             # Electron main process
  preload.js
assets/               # icons (.png, .icns)
dist/                 # Vite build output (ignored in Git)
release/              # Installers / portable builds
```

---

## 🤝 Contributing

1. Fork / branch, run **`npm run dev`**.
2. Follow ESLint / Prettier rules.
3. Commit with clear messages & open a PR — shukran!

---

## 📄 License

MIT ― _do whatever you want, just keep the copyright notice._