import './assets/main.css' 
import { createApp } from 'vue'
import App from './App.vue' 
import 'toastr/build/toastr.min.css'
import toastr from 'toastr'

const app = createApp(App)
app.config.globalProperties.$toastr = toastr
app.mount('#app')
