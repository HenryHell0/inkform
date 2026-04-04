# Inkform
> A handwriting-based mathematical whiteboard for exploring, solving, and visualizing math

Inkform™ lets you write math naturally and have it transformed into interactive expressions and graphs

🌐 **Live Demo:** https://inkform.io

https://github.com/user-attachments/assets/52c0791f-bf13-40a5-97ea-58d7a076732e

<br>

## Inkform lets you...
- Write in your own handwriting
- Visualize on the fly
- Use a tablet and stylus just like on paper

Instead of typing, you write naturally - Inkform handles recognition and visualization :)

<br>

## Features

- Handwritten Math Recognition (HMER) powered by [**TexTeller**](https://github.com/OleehyO/TexTeller)
- Live graphing powered by [**Desmos**](https://www.desmos.com/)
- Draggable and resizable math widgets
- Undo / Redo history system
- Touch input support

<br>

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

<br>

## 🛠 Development Setup

### Requirements

- Node.js 18+
- Docker
- Mkcert (if using LAN HTTPS)

### Clone & Install
```bash
git clone https://github.com/HenryHell0/inkform.git
cd inkform/frontend
npm install
```

### ⚠️ HTTPS over LAN
If you want to host the application to test on a LAN device (ie, your phone), follow these steps. Otherwise, remove the `https: {}` section from `frontend/vite.config.js`
#### Make certificates
```bash
# Install mkcert (if not already installed)
mkcert -install

# Generate certificates for your local IP
mkcert 192.168.x.x

# Move them into the project
mkdir -p keys
mv 192.168.x.x.pem keys/dev-cert.pem
mv 192.168.x.x-key.pem keys/dev-key.pem

```
### Run
```bash
npm run dev
```
>⚠️ First boot may take a while while TexTeller installs dependencies.


## 📝 Legal

Inkform is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).
© 2026 Henry Holton. Inkform™ is a trademark of Henry Holton.

Built with Vue! Yay! 💚
