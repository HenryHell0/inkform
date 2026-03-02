# Inkform
> A handwriting-based mathematical whiteboard for exploring, solving, and visualizing math

Inkform lets you write math naturally and have it transformed into interactive expressions and graphs

🌐 **Live Demo:** https://inkform.io

<br>

## Inkform lets you...
- ✍️ Write in your own handwriting
- 📊 Visualize on the fly
- 🖊 Use a tablet and stylus just like on paper

Instead of typing, you write naturally - Inkform handles recognition and visualization :)

<br>

## 😎 Features

- 📐 Handwritten Math Recognition (HMER) powered by [**TexTeller**](https://github.com/OleehyO/TexTeller)
- 📈 Live graphing powered by [**Desmos**](https://www.desmos.com/)
- 🧱 Draggable and resizable math widgets
- 🔄 Undo / Redo history system
- 🖊 Touch input support

<br>

## 🎥 Demo
[Try it live!](https://inkform.io)

https://github.com/user-attachments/assets/10f42054-18e7-4dbe-8120-f94bb7aa1970

<br>

## 🗺️ Roadmap

**PHASE ONE 😲**
- 💃 Refactor widget movement + selection system
- 🧹 Major widget architecture cleanup
- 🌩️ Hover feedback when dragging expressions onto graphs
- 👀 Fix widget display on mobile
- 🗨️ Improve dialog system architecture
- ↩️ Ensure undo/redo works across all widget actions

**PHASE TWO 😎**
- 🔨 Fix toolbar styling on variable width displays
- 📷 Infinite pannable canvas / grab tool
- 🔍 Improve SEO
- 📊 Add Google Analytics
- 🩹 Introduction Dialog
- 📘 Information Dialog

**PHASE THREE 🙊**
- 🎨 Tool settings menu (stroke width, color, etc.)
- ⌨️ keyboard shortcuts
- 🖋️ Editable expression component
- 🔃 Convert expressions back into editable strokes
- 🧰 Select graph bounds interactively
- 🛡️ Save/Load functionality

<br>

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

<br>

## 🛠 Development Setup

### Requirements

- Node.js 18+
- Docker

### Clone & Run

```bash
git clone https://github.com/HenryHell0/inkform.git
cd inkform/frontend
npm install
npm run dev
```
>⚠️ First boot may take a while while TexTeller installs dependencies.


Built with Vue! Yay! 💚
