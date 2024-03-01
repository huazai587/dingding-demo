import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import zhCn from "element-plus/es/locale/lang/zh-cn";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons-vue'
import commonJs from './assets/js/common'
const app = createApp(App)
for (let i in Icons) {
    app.component(i, Icons[i])
}
app.use(router).use(ElementPlus, { zhCn })
app.config.globalProperties.$commonJs = commonJs
app.mount('#app')