import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import $ from 'jquery';

const app = createApp(App)

app.use(router)

app.config.globalProperties.$ = $;

app.mount('#app')
