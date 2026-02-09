import { createApp } from 'vue'
import App from './App.vue'
import VueMathjax from 'vue-mathjax-next'
import { createPinia } from 'pinia'
// import styles
import './styles/pallete.css'
import './styles/style.css'

const pinia = createPinia()
const app = createApp(App)
app.use(VueMathjax)
app.use(pinia)

app.mount('#app')
