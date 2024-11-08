import '@fontsource/noto-sans-sc'
import '@/style/index.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import vuetify from '@/plugins/vuetify.ts'
import 'virtual:svg-icons-register'
import 'virtual:uno.css'

import App from './App.vue'
import router from './router'

import ArkIcon from './components/ArkIcon.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.component('ark-icon', ArkIcon)

app.mount('#app')
