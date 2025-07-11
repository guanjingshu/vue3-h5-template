import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import router from './router'
import store from './store'
import './permission' // 引入权限控制
import './utils/flexible'// 引入适配脚本

// 引入全局样式
import './styles/index.scss'

// 按需引入Vant组件
// import { 
//   // Button, 
//   Form, 
//   Field, 
//   CellGroup, 
//   Toast, 
//   Dialog, 
//   NavBar,
//   Tabbar, 
//   TabbarItem,
//   Grid,
//   GridItem,
//   Icon,
//   Swipe,
//   SwipeItem,
//   List
// } from 'vant'

const app = createApp(App)

// 注册Vant组件
// const components = [
//   // Button, 
//   Form, 
//   Field, 
//   CellGroup, 
//   Toast, 
//   Dialog, 
//   NavBar,
//   Tabbar, 
//   TabbarItem,
//   Grid,
//   GridItem,
//   Icon,
//   Swipe,
//   SwipeItem,
//   List
// ]

// components.forEach(component => {
//   app.use(component)
// })

// 全局属性
// app.config.globalProperties.$toast = Toast
// app.config.globalProperties.$dialog = Dialog


app.use(router)
app.use(store)
app.mount('#app')

