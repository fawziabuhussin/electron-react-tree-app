
# TreeBuilder 2025 _(Electron + React Flow)_

**منشئ الشجرة 2025** is a modern desktop tool for creating, editing, and exporting hierarchical trees.  
Built with **Electron 25**, **React 18**, **Vite 5**, and **React-Flow 11**—runs on **Windows** & **macOS** (Intel + Apple Silicon).

---

## ✨ Key features
| | |
|---|---|
| **Visual tree editor** | Drag-friendly canvas, custom nodes, collapse / expand, mini-map & grid |
| **Multi-language UI**  | Instant switch between **Arabic ↔ English** (add more in `strings.js`) |
| **Color picker**       | Swatches **+** HEX picker (react-colorful) |
| **Export**             | Save tree as **PNG**, **PDF** or **JSON** |
| **Portable build**     | Single-file `.exe` (Win) & notarised `.dmg` (Mac) generated locally |

---

## ⚡ Quick start (for developers)

```bash
git clone https://github.com/fawziabuhussin/electron-react-tree-app.git
cd electron-react-tree-app
npm install               # ⏳  installs dependencies

# 1️⃣  React / Vite dev-server
npm run dev               # http://localhost:3000

# 2️⃣  In another terminal: start Electron
npm start
```

Reload window **Ctrl + R**  Open DevTools **Ctrl + Shift + I**

---

## 🏗️ Build a desktop release

```bash
# clean previous artefacts (PowerShell)
Remove-Item dist,release -Recurse -Force
# bash/zsh:  rm -rf dist release

# build renderer & package installers
npm run build             # = vite build  ➜  dist/
npm run electron:make     # = electron-builder ➜ release/
```

### Resulting files (`release/`)

| OS      | Generated artefacts                      | How to run |
|---------|------------------------------------------|------------|
| **Windows** | `TreeBuilder2025-x64.exe` <br> `TreeBuilder2025-ia32.exe` | double-click (portable) |
| **macOS**   | `TreeBuilder2025-arm64.dmg` <br> `TreeBuilder2025-x64.dmg` | mount DMG and drag app to /Applications |
| **Linux** *(if enabled)* | `TreeBuilder2025.AppImage` | `chmod +x` then `./TreeBuilder2025.AppImage` |

> macOS builds **must** be created on macOS to enable code-sign & notarisation.

**Distribute installers via _GitHub Releases_:**  
create a new release → drag files from `release/` → publish.  
Users download from the Releases page—your repository stays small.

---

## 📦 Running without installers

If you just need to check the packaged app locally:

```bash
# Windows
.\release\win-unpacked\TreeBuilder2025.exe

# macOS
open release/mac-x64/TreeBuilder2025.app   # or arm64/
```

*(No install step; useful for QA before publishing.)*

---

## 🗺️ Folder structure (simplified)

```
src/
  renderer/
    App.jsx            # main UI
    CustomNode.jsx
    strings.js         # i18n dictionaries
    style.css
  main.js              # Electron main process
  preload.js
assets/                # icons (.png, .icns)
dist/                  # Vite build output  (ignored)
release/               # Installers / portable builds  (ignored)
```

---

## 🤝 Contributing

1. Fork / branch → **`npm run dev`**  
2. Follow ESLint / Prettier rules  
3. Commit with clear messages & open a PR — شكرًا!

---

## 📄 License

MIT ― do whatever you like, just retain the copyright notice.
