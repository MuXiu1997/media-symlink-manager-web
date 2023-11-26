import App from './App.vue'

import routes from 'virtual:generated-pages'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import '@unocss/reset/tailwind.css'
import './styles/main.css'

import 'uno.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(router)
app.mount('#app')
