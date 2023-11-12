import './assets/main.scss'
import ElementPlus from 'element-plus';
import locale from 'element-plus/dist/locale/zh-cn.js'
import 'element-plus/dist/index.css'
import router from '@/router'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-persistedstate-plugin'
console.log(router);
const app = createApp(App)
const pinia = createPinia(); // 得到pinia 实力
const persist = createPersistedState();
pinia.use(persist)
app.use(router)
app.use(pinia);
app.use(ElementPlus, { locale })
app.mount('#app')
