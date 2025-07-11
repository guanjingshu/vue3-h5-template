# 从0到1搭建Vue3+Vant移动端项目

基于Vue3和Vant组件库搭建一个完整的移动端项目，需要考虑项目结构、代码规范、基础功能模块等多个方面。下面我将详细介绍如何从零开始构建一个企业级移动端项目。

## 1. 初始化项目

首先，需要确保Node.js版本 >= 12.0.0，然后使用Vite初始化项目：

```bash
# 使用npm
npm init vite@latest my-mobile-app -- --template vue

# 或使用yarn
yarn create vite my-mobile-app --template vue

# 或使用pnpm
pnpm dlx create-vite my-mobile-app --template vue
```

进入项目目录并安装依赖：
```bash
cd my-mobile-app
npm install
```

## 2. 添加代码规范工具

### 2.1 ESLint配置

安装ESLint及相关插件：
```bash
npm install eslint eslint-plugin-vue babel-eslint -D
```

创建`.eslintrc.js`配置文件：
```javascript
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    'prettier/prettier': 'error',
    eqeqeq: 2, // 强制使用 === 和 !==
    'no-var': 2, // 禁止使用 var 声明变量
    'prefer-const': 2, // 使用 const 声明那些声明后不再被修改的变量
    // 更多规则...
  }
}
```

### 2.2 Prettier配置

安装Prettier及相关插件：
```bash
npm install prettier eslint-config-prettier eslint-plugin-prettier -D
```

创建`.prettierrc.js`配置文件：
```javascript
module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  semi: false,
  trailingComma: "none",
  bracketSpacing: true,
  eslintIntegration: true
}
```

### 2.3 Git Hook配置

使用husky管理Git Hook：
```bash
npm install husky -D
```

在`package.json`中添加配置：
```json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint --ext .vue,.js ./",
    "lint:fix": "eslint --fix --ext .vue,.js ./"
  }
}
```

执行命令并创建pre-commit钩子：
```bash
npm run prepare
```

创建`.husky/pre-commit`文件：
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint:fix
```

配置commit-msg钩子：
```bash
npm install @commitlint/cli @commitlint/config-conventional -D
```

创建`commitlint.config.js`文件：
```javascript
module.exports = {
  extends: [
    '@commitlint/config-conventional'
  ]
}
```

创建`.husky/commit-msg`文件：
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit $1
```

## 3. 添加路由管理

安装Vue Router：
```bash
npm install vue-router -S
```

创建`src/router/index.js`文件：
```javascript
import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页', keepAlive: false }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '我的', keepAlive: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '移动端应用'
  const token = localStorage.getItem('token')
  
  if (to.path === '/login') {
    next()
  } else {
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
```

在`main.js`中引入路由：
```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

## 4. 状态管理

安装Vuex：
```bash
npm install vuex -S
```

创建`src/store/index.js`：
```javascript
import { createStore } from 'vuex'
import user from './modules/user'
import app from './modules/app'

const store = createStore({
  modules: {
    user,
    app
  }
})

export default store
```

创建用户模块`src/store/modules/user.js`：
```javascript
import { login, logout, getUserInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken(),
  userInfo: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, info) => {
    state.userInfo = info
  }
}

const actions = {
  // 登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  
  // 获取用户信息
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token)
        .then(response => {
          const { data } = response
          commit('SET_USER_INFO', data)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  
  // 登出
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_USER_INFO', {})
          removeToken()
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
```

在`main.js`中引入Vuex：
```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
```

## 5. 网络请求封装

安装Axios：
```bash
npm install axios -S
```

创建`src/utils/request.js`：
```javascript
import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 如果存在token，请求携带token
    if (store.state.user.token) {
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 根据自定义错误码处理错误
    if (res.code !== 200) {
      Toast.fail(res.message || '请求失败')
      
      // 401: 未登录或token过期
      if (res.code === 401) {
        store.dispatch('user/logout').then(() => {
          location.reload()
        })
      }
      
      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      return res
    }
  },
  error => {
    console.log('请求错误', error)
    
    // 处理网络错误
    let message = '请求失败'
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = '请求错误'
          break
        case 401:
          message = '未授权，请登录'
          store.dispatch('user/logout').then(() => {
            location.reload()
          })
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = `连接错误${error.response.status}`
      }
    } else {
      if (error.message.includes('timeout')) {
        message = '请求超时'
      }
    }
    
    Toast.fail(message)
    return Promise.reject(error)
  }
)

export default service
```

## 6. API模块封装

创建`src/api/user.js`：
```javascript
import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

// 用户登出
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
```

创建`src/api/common.js`：
```javascript
import request from '@/utils/request'

// 获取首页数据
export function getHomeData() {
  return request({
    url: '/home/data',
    method: 'get'
  })
}

// 上传文件
export function uploadFile(data) {
  return request({
    url: '/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}
```

## 7. 工具函数模块

创建`src/utils/auth.js`：
```javascript
import Cookies from 'js-cookie'

const TokenKey = 'mobile_app_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
```

创建`src/utils/validate.js`：
```javascript
// 验证手机号
export function validatePhone(phone) {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

// 验证邮箱
export function validateEmail(email) {
  const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return reg.test(email)
}

// 验证身份证
export function validateIdCard(idCard) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(idCard)
}
```

创建`src/utils/storage.js`：
```javascript
// localStorage封装
export const localStorage = {
  set(key, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    window.localStorage.setItem(key, value)
  },
  get(key) {
    const value = window.localStorage.getItem(key)
    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  },
  remove(key) {
    window.localStorage.removeItem(key)
  },
  clear() {
    window.localStorage.clear()
  }
}

// sessionStorage封装
export const sessionStorage = {
  set(key, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    window.sessionStorage.setItem(key, value)
  },
  get(key) {
    const value = window.sessionStorage.getItem(key)
    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  },
  remove(key) {
    window.sessionStorage.removeItem(key)
  },
  clear() {
    window.sessionStorage.clear()
  }
}
```

## 8. 集成Vant组件库

安装Vant：
```bash
npm i vant@next -S
```

安装按需加载插件：
```bash
npm i vite-plugin-style-import -D
```

配置`vite.config.js`：
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import styleImport, { VantResolve } from 'vite-plugin-style-import'
import postCssPxToRem from 'postcss-pxtorem'

```

```javascript
// vite.config.js 继续
export default defineConfig({
  plugins: [
    vue(),
    styleImport({
      resolves: [VantResolve()],
      libs: [
        {
          libraryName: 'vant',
          esModule: true,
          resolveStyle: (name) => `vant/es/${name}/style/index`
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  css: {
    postcss: {
      plugins: [
        postCssPxToRem({
          rootValue: 37.5, // Vant 官方根字体大小是 37.5
          propList: ['*'],
          selectorBlackList: ['.norem'] // 过滤掉.norem-开头的class，不进行rem转换
        })
      ]
    }
  },
  build: {
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vant: ['vant'],
          vendor: ['vue', 'vue-router', 'vuex']
        }
      }
    }
  }
})
```

## 9. 移动端适配

创建`src/utils/flexible.js`文件来处理移动端适配：

```javascript
(function flexible(window, document) {
  const docEl = document.documentElement
  const dpr = window.devicePixelRatio || 1

  // 调整body标签的fontSize
  function setBodyFontSize() {
    if (document.body) {
      document.body.style.fontSize = '16px'
    } else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  setBodyFontSize()

  // 设置根元素fontSize
  function setRemUnit() {
    const rem = docEl.clientWidth / 10
    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()

  // 当页面大小变化时，重新设置rem
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function(e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // 当设备屏幕支持0.5px时，设置meta标签的viewport
  if (dpr >= 2) {
    const fakeBody = document.createElement('body')
    const testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
}(window, document))
```

在`main.js`中引入：

```javascript
import './utils/flexible'
```

## 10. 全局样式和组件

创建全局样式文件`src/styles/index.scss`：

```scss
// 引入重置样式
@import './reset.scss';
@import './variables.scss';
@import './mixin.scss';

// 全局样式
body {
  height: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
}

html {
  height: 100%;
  box-sizing: border-box;
}

// 滚动条样式
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

// 清除浮动
.clearfix {
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}

// 页面过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 安全区适配
.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
```

创建`src/styles/reset.scss`：

```scss
/* 基本样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

html, body {
  width: 100%;
  height: 100%;
  user-select: none;
}

a {
  text-decoration: none;
  color: inherit;
}

img {
  vertical-align: middle;
  width: 100%;
}

input, button, textarea {
  border: none;
  outline: none;
  background: none;
}

ul, ol, li {
  list-style: none;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: normal;
}
```

创建全局变量文件`src/styles/variables.scss`：

```scss
// 颜色变量
$primary-color: #1989fa;
$success-color: #07c160;
$warning-color: #ff976a;
$danger-color: #ee0a24;
$info-color: #909399;

// 文字颜色
$text-color-primary: #303133;
$text-color-regular: #606266;
$text-color-secondary: #909399;
$text-color-placeholder: #c0c4cc;

// 边框颜色
$border-color-base: #dcdfe6;
$border-color-light: #e4e7ed;
$border-color-lighter: #ebeef5;
$border-color-extra-light: #f2f6fc;

// 背景颜色
$background-color-base: #f5f7fa;
$background-color-light: #f5f5f5;
$background-color-white: #ffffff;

// 字体大小
$font-size-extra-large: 20px;
$font-size-large: 18px;
$font-size-medium: 16px;
$font-size-base: 14px;
$font-size-small: 13px;
$font-size-extra-small: 12px;

// 间距
$spacing-extra-large: 32px;
$spacing-large: 24px;
$spacing-medium: 16px;
$spacing-base: 12px;
$spacing-small: 8px;
$spacing-extra-small: 4px;

// 圆角
$border-radius-base: 4px;
$border-radius-small: 2px;
$border-radius-large: 8px;
$border-radius-round: 20px;
$border-radius-circle: 50%;

// 阴影
$box-shadow-base: 0 2px 4px rgba(0, 0, 0, 0.12);
$box-shadow-light: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
```

创建`src/styles/mixin.scss`：

```scss
// 文本溢出显示省略号
@mixin ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 多行文本溢出显示省略号
@mixin multi-ellipsis($line: 2) {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: $line;
  -webkit-box-orient: vertical;
}

// flex布局
@mixin flex($justify: center, $align: center, $direction: row) {
  display: flex;
  justify-content: $justify;
  align-items: $align;
  flex-direction: $direction;
}

// 定位居中
@mixin position-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

// 宽高
@mixin size($width, $height: $width) {
  width: $width;
  height: $height;
}

// 一像素边框
@mixin hairline($position: bottom, $color: $border-color-base) {
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    
    @if $position == top {
      left: 0;
      top: 0;
      right: 0;
      height: 1px;
      transform: scaleY(0.5);
      border-top: 1px solid $color;
    }
    @else if $position == right {
      top: 0;
      right: 0;
      bottom: 0;
      width: 1px;
      transform: scaleX(0.5);
      border-right: 1px solid $color;
    }
    @else if $position == bottom {
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      transform: scaleY(0.5);
      border-bottom: 1px solid $color;
    }
    @else if $position == left {
      top: 0;
      left: 0;
      bottom: 0;
      width: 1px;
      transform: scaleX(0.5);
      border-left: 1px solid $color;
    }
    @else if $position == all {
      top: 0;
      left: 0;
      width: 200%;
      height: 200%;
      transform: scale(0.5);
      transform-origin: left top;
      border: 1px solid $color;
    }
  }
}
```

## 11. 创建布局组件

创建`src/layout/index.vue`：

```vue
<template>
  <div class="app-container">
    <div class="content-container">
      <router-view v-slot="{ Component }">
        <keep-alive :include="cacheRoutes">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
    <div class="tabbar-container safe-area-bottom">
      <van-tabbar v-model="active" route>
        <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
        <van-tabbar-item icon="apps-o" to="/category">分类</van-tabbar-item>
        <van-tabbar-item icon="cart-o" to="/cart">购物车</van-tabbar-item>
        <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'Layout',
  setup() {
    const route = useRoute()
    const active = ref(0)
    
    // 需要缓存的路由
    const cacheRoutes = computed(() => {
      return ['Home', 'Category', 'User']
    })
    
    // 根据当前路由设置底部标签激活状态
    const setActive = () => {
      const path = route.path
      if (path.includes('/home')) {
        active.value = 0
      } else if (path.includes('/category')) {
        active.value = 1
      } else if (path.includes('/cart')) {
        active.value = 2
      } else if (path.includes('/user')) {
        active.value = 3
      }
    }
    
    // 监听路由变化
    route.path && setActive()
    
    return {
      active,
      cacheRoutes
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  
  .content-container {
    flex: 1;
    overflow-y: auto;
    background-color: $background-color-light;
  }
  
  .tabbar-container {
    width: 100%;
    background-color: #fff;
  }
}
</style>
```

## 12. 创建基础页面

### 12.1 创建首页 `src/views/home/index.vue`：

```vue
<template>
  <div class="home-container">
    <van-nav-bar title="首页" fixed />
    
    <div class="content">
      <!-- 轮播图 -->
      <van-swipe class="banner" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item, index) in banners" :key="index">
          <img :src="item.image" />
        </van-swipe-item>
      </van-swipe>
      
      <!-- 导航菜单 -->
      <van-grid :column-num="5" :border="false" class="nav-grid">
        <van-grid-item v-for="(item, index) in navs" :key="index" :icon="item.icon" :text="item.text" />
      </van-grid>
      
      <!-- 商品列表 -->
      <div class="product-list">
        <h3 class="section-title">推荐商品</h3>
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="product-grid">
            <div class="product-item" v-for="(item, index) in productList" :key="index">
              <img :src="item.image" class="product-image" />
              <div class="product-info">
                <div class="product-name">{{ item.name }}</div>
                <div class="product-price">¥{{ item.price }}</div>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>


import { ref, onMounted } from 'vue'
import { getHomeData } from '@/api/common'
import { Toast } from 'vant'

export default {
  name: 'Home',
  setup() {
    const banners = ref([])
    const navs = ref([])
    const productList = ref([])
    const loading = ref(false)
    const finished = ref(false)
    const page = ref(1)
    const limit = 10
    
    // 获取首页数据
    const fetchHomeData = async () => {
      try {
        const res = await getHomeData()
        banners.value = res.data.banners || []
        navs.value = res.data.navs || []
      } catch (error) {
        Toast.fail('获取首页数据失败')
        console.error(error)
      }
    }
    
    // 获取商品列表
    const fetchProducts = async () => {
      try {
        const res = await getHomeData({
          page: page.value,
          limit
        })
        
        const newProducts = res.data.products || []
        productList.value = [...productList.value, ...newProducts]
        
        // 判断是否还有更多数据
        if (newProducts.length < limit) {
          finished.value = true
        }
        
        page.value++
      } catch (error) {
        Toast.fail('获取商品列表失败')
        console.error(error)
      } finally {
        loading.value = false
      }
    }
    
    // 加载更多
    const onLoad = () => {
      fetchProducts()
    }
    
    onMounted(() => {
      fetchHomeData()
      // 模拟数据
      banners.value = [
        { image: 'https://img01.yzcdn.cn/vant/apple-1.jpg' },
        { image: 'https://img01.yzcdn.cn/vant/apple-2.jpg' }
      ]
      navs.value = [
        { icon: 'photo-o', text: '新品' },
        { icon: 'gift-o', text: '礼品' },
        { icon: 'coupon-o', text: '优惠' },
        { icon: 'cart-o', text: '购物车' },
        { icon: 'shop-o', text: '门店' }
      ]
      productList.value = Array(10).fill().map((_, index) => ({
        id: index + 1,
        name: `商品${index + 1}`,
        price: Math.floor(Math.random() * 1000) + 1,
        image: `https://img01.yzcdn.cn/vant/ipad.jpeg`
      }))
    })
    
    return {
      banners,
      navs,
      productList,
      loading,
      finished,
      onLoad
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  padding-top: 46px;
  min-height: 100vh;
  
  .content {
    padding-bottom: 50px;
  }
  
  .banner {
    height: 180px;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .nav-grid {
    margin: 10px 0;
    background-color: #fff;
  }
  
  .section-title {
    padding: 15px;
    font-size: $font-size-medium;
    color: $text-color-primary;
    font-weight: 500;
    background-color: #fff;
    margin: 10px 0 0;
  }
  
  .product-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 0 10px 10px;
  }
  
  .product-item {
    background-color: #fff;
    border-radius: $border-radius-base;
    overflow: hidden;
    
    .product-image {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }
    
    .product-info {
      padding: 10px;
      
      .product-name {
        font-size: $font-size-small;
        color: $text-color-primary;
        @include ellipsis;
      }
      
      .product-price {
        font-size: $font-size-medium;
        color: $danger-color;
        font-weight: 500;
        margin-top: 5px;
      }
    }
  }
}
</style>
```
### 三段
### 12.2 创建登录页 `src/views/login/index.vue`：

```vue
<template>
  <div class="login-container">
    <div class="login-header">
      <img src="@/assets/logo.png" class="logo" alt="logo">
      <h2 class="title">移动端应用</h2>
    </div>
    
    <div class="login-form">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="form.username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请输入用户名' }]"
            clearable
          />
          <van-field
            v-model="form.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请输入密码' }]"
            clearable
          />
        </van-cell-group>
        
        <div class="form-actions">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
          >
            登录
          </van-button>
        </div>
      </van-form>
      
      <div class="other-login">
        <div class="divider">
          <span>其他登录方式</span>
        </div>
        
        <div class="icon-list">
          <van-icon name="wechat" size="28" color="#07c160" />
          <van-icon name="weibo" size="28" color="#ee0a24" />
          <van-icon name="qq" size="28" color="#1989fa" />
        </div>
      </div>
    </div>
    
    <div class="login-footer">
      <p>登录即代表您已同意<a href="javascript:;">《用户协议》</a>和<a href="javascript:;">《隐私政策》</a></p>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Toast } from 'vant'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const store = useStore()
    const loading = ref(false)
    
    const form = reactive({
      username: '',
      password: ''
    })
    
    const onSubmit = async (values) => {
      loading.value = true
      try {
        await store.dispatch('user/login', values)
        Toast.success('登录成功')
        router.push('/')
      } catch (error) {
        Toast.fail('登录失败：' + (error.message || '未知错误'))
      } finally {
        loading.value = false
      }
    }
    
    return {
      form,
      loading,
      onSubmit
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  background-color: #fff;
  
  .login-header {
    padding-top: 60px;
    text-align: center;
    margin-bottom: 40px;
    
    .logo {
      width: 80px;
      height: 80px;
      margin-bottom: 15px;
    }
    
    .title {
      font-size: 24px;
      color: $text-color-primary;
      font-weight: 500;
    }
  }
  
  .login-form {
    flex: 1;
    
    .form-actions {
      margin: 25px 16px 40px;
    }
    
    .other-login {
      padding: 0 16px;
      
      .divider {
        display: flex;
        align-items: center;
        color: $text-color-secondary;
        font-size: $font-size-small;
        margin-bottom: 20px;
        
        &::before,
        &::after {
          content: '';
          height: 1px;
          flex: 1;
          background-color: $border-color-base;
        }
        
        span {
          padding: 0 12px;
        }
      }
      
      .icon-list {
        @include flex(center, center);
        
        .van-icon {
          margin: 0 20px;
        }
      }
    }
  }
  
  .login-footer {
    padding: 20px 0;
    text-align: center;
    font-size: $font-size-small;
    color: $text-color-secondary;
    
    a {
      color: $primary-color;
    }
  }
}
</style>
```

### 12.3 创建用户页 `src/views/user/index.vue`：

```vue
<template>
  <div class="user-container">
    <!-- 用户信息 -->
    <div class="user-header">
      <div class="user-info">
        <div class="avatar">
          <img :src="userInfo.avatar || defaultAvatar" alt="avatar">
        </div>
        <div class="info">
          <h3 class="name">{{ userInfo.nickname || '未登录' }}</h3>
          <p class="desc">{{ userInfo.desc || '这个人很懒，什么都没有留下' }}</p>
        </div>
      </div>
      <div class="settings">
        <van-icon name="setting-o" size="20" />
      </div>
    </div>
    
    <!-- 我的订单 -->
    <div class="user-card">
      <div class="card-header">
        <span>我的订单</span>
        <span class="more">全部订单 <van-icon name="arrow" /></span>
      </div>
      <van-grid :column-num="5" :border="false">
        <van-grid-item icon="pending-payment" text="待付款" />
        <van-grid-item icon="logistics" text="待发货" />
        <van-grid-item icon="paid" text="待收货" />
        <van-grid-item icon="comment-o" text="待评价" />
        <van-grid-item icon="after-sale" text="退款/售后" />
      </van-grid>
    </div>
    
    <!-- 我的服务 -->
    <div class="user-card">
      <div class="card-header">
        <span>我的服务</span>
      </div>
      <van-grid :column-num="4" :border="false">
        <van-grid-item icon="coupon-o" text="优惠券" />
        <van-grid-item icon="fire-o" text="积分商城" />
        <van-grid-item icon="medal-o" text="会员中心" />
        <van-grid-item icon="location-o" text="收货地址" />
        <van-grid-item icon="star-o" text="我的收藏" />
        <van-grid-item icon="browsing-history-o" text="浏览记录" />
        <van-grid-item icon="question-o" text="帮助中心" />
        <van-grid-item icon="service-o" text="联系客服" />
      </van-grid>
    </div>
    
    <!-- 退出登录 -->
    <div class="logout-btn">
      <van-button block round plain type="danger" @click="onLogout">退出登录</van-button>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Dialog, Toast } from 'vant'
import defaultAvatar from '@/assets/default-avatar.png'

export default {
  name: 'User',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    // 用户信息
    const userInfo = computed(() => store.state.user.userInfo || {})
    
    // 获取用户信息
    const fetchUserInfo = async () => {
      try {
        await store.dispatch('user/getUserInfo')
      } catch (error) {
        console.error('获取用户信息失败', error)
      }
    }
    
    // 退出登录
    const onLogout = () => {
      Dialog.confirm({
        title: '提示',
        message: '确定要退出登录吗？',
      })
        .then(async () => {
          try {
            await store.dispatch('user/logout')
            Toast.success('退出成功')
            router.push('/login')
          } catch (error) {
            Toast.fail('退出失败')
          }
        })
        .catch(() => {
          // 取消操作
        })
    }
    
    onMounted(() => {
      fetchUserInfo()
    })
    
    return {
      userInfo,
      defaultAvatar,
      onLogout
    }
  }
}
</script>

<style lang="scss" scoped>
.user-container {
  min-height: 100vh;
  background-color: $background-color-light;
  padding-bottom: 50px;
  
  .user-header {
    height: 200px;
    background-image: linear-gradient(to right, $primary-color, lighten($primary-color, 15%));
    padding: 20px;
    display: flex;
    justify-content: space-between;
    color: #fff;
    
    .user-info {
      display: flex;
      align-items: center;
      
      .avatar {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.5);
        overflow: hidden;
        margin-right: 15px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .info {
        .name {
          font-size: $font-size-large;
          font-weight: 500;
          

          
          margin-bottom: 8px;
        }
        
        .desc {
          font-size: $font-size-small;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
    
    .settings {
      padding: 10px;
    }
  }
  
  .user-card {
    background-color: #fff;
    border-radius: $border-radius-large;
    margin: 15px;
    padding: 15px 0;
    box-shadow: $box-shadow-light;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 15px 10px;
      font-size: $font-size-medium;
      font-weight: 500;
      
      .more {
        color: $text-color-secondary;
        font-size: $font-size-small;
        font-weight: normal;
      }
    }
  }
  
  .logout-btn {
    margin: 30px 15px;
  }
}
</style>
```

### 12.4 创建404页面 `src/views/error/404.vue`：

```vue
<template>
  <div class="not-found">
    <img src="@/assets/404.png" alt="404" class="error-image">
    <h2 class="error-title">页面不存在</h2>
    <p class="error-desc">抱歉，您访问的页面不存在或已被删除</p>
    <van-button round type="primary" @click="goHome">返回首页</van-button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NotFound',
  setup() {
    const router = useRouter()
    
    const goHome = () => {
      router.push('/')
    }
    
    return {
      goHome
    }
  }
}
</script>

<style lang="scss" scoped>
.not-found {
  height: 100vh;
  @include flex(center, center, column);
  padding: 0 30px;
  text-align: center;
  
  .error-image {
    width: 200px;
    margin-bottom: 20px;
  }
  
  .error-title {
    font-size: 22px;
    color: $text-color-primary;
    margin-bottom: 10px;
  }
  
  .error-desc {
    font-size: $font-size-base;
    color: $text-color-secondary;
    margin-bottom: 30px;
  }
}
</style>
```

## 13. 权限控制

创建`src/permission.js`文件，用于控制路由权限：

```javascript
import router from './router'
import store from './store'
import { getToken } from '@/utils/auth'

// 白名单路由
const whiteList = ['/login', '/register', '/forget']

router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '移动端应用'
  
  const hasToken = getToken()
  
  if (hasToken) {
    if (to.path === '/login') {
      // 已登录，跳转到首页
      next({ path: '/' })
    } else {
      // 判断用户信息是否存在
      const hasUserInfo = store.getters.userInfo && store.getters.userInfo.id
      
      if (hasUserInfo) {
        next()
      } else {
        try {
          // 获取用户信息
          await store.dispatch('user/getUserInfo')
          next()
        } catch (error) {
          // 获取用户信息失败，清除token，重定向到登录页
          await store.dispatch('user/logout')
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      // 在白名单中，直接进入
      next()
    } else {
      // 其他没有访问权限的页面将重定向到登录页面
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
  window.scrollTo(0, 0)
})
```

在`main.js`中引入：

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './permission' // 引入权限控制
import './utils/flexible' // 引入移动端适配

// 引入全局样式
import './styles/index.scss'

// 按需引入Vant组件
import { 
  Button, 
  Form, 
  Field, 
  CellGroup, 
  Toast, 
  Dialog, 
  NavBar,
  Tabbar, 
  TabbarItem,
  Grid,
  GridItem,
  Icon,
  Swipe,
  SwipeItem,
  List
} from 'vant'

const app = createApp(App)

// 注册Vant组件
const components = [
  Button, 
  Form, 
  Field, 
  CellGroup, 
  Toast, 
  Dialog, 
  NavBar,
  Tabbar, 
  TabbarItem,
  Grid,
  GridItem,
  Icon,
  Swipe,
  SwipeItem,
  List
]

components.forEach(component => {
  app.use(component)
})

// 全局属性
app.config.globalProperties.$toast = Toast
app.config.globalProperties.$dialog = Dialog

app.use(router)
app.use(store)
app.mount('#app')
```

## 14. 添加环境配置

创建不同环境的配置文件：

`.env.development`:
```
# 开发环境配置
VITE_APP_TITLE = 移动端应用(开发环境)
VITE_API_BASE_URL = /api
```

`.env.production`:
```
# 生产环境配置
VITE_APP_TITLE = 移动端应用
VITE_API_BASE_URL = https://api.yoursite.com
```

## 15. 配置打包优化

修改`vite.config.js`，添加打包优化配置：

```javascript
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import styleImport, { VantResolve } from 'vite-plugin-style-import'
import postCssPxToRem from 'postcss-pxtorem'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteCompression from 'vite-plugin-compression'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  
  return defineConfig({
    plugins: [
      vue(),
      styleImport({
        resolves: [VantResolve()],
        libs: [
          {
            libraryName: 'vant',
            esModule: true,
            resolveStyle: (name) => `vant/es/${name}/style/index`
          }
        ]
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_APP_TITLE
          }
        }
      }),
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz'
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@/styles/variables.scss";
            @import "@/styles/mixin.scss";
          `
        }
      },
      postcss: {
        plugins: [
          postCssPxToRem({
            rootValue: 37.5, // Vant 官方根字体大小是 37.5
            propList: ['*'],
            selectorBlackList: ['.norem'] // 过滤掉.norem-开头的class，不进行rem转换
          })
        ]
      }
    },
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks: {
            vant: ['vant'],
            vendor: ['vue', 'vue-router', 'vuex', 'axios']
          }
        }
      }
    }
  })
}
```

## 16. 完整项目目录结构

最终项目结构应该如下：

```
my-mobile-app/
├── node_modules/
├── public/
│   ├── favicon.ico
├── src/
│   ├── api/               # API请求模块
│   │   ├── common.js
│   │   ├── user.js
│   │   └── index.js
│   ├── assets/            # 静态资源
│   │   ├── logo.png
│   │   ├── default-avatar.png
│   │   └── 404.png
│   ├── components/        # 公共组件
│   │   ├── NavBar.vue
│   │   └── Tabbar.vue
│   ├── layout/            # 布局组件
│   │   └── index.vue
│   ├── router/            # 路由配置
│   │   └── index.js
│   ├── store/             # 状态管理
│   │   ├── modules/
│   │   │   ├── user.js
│   │   │   └── app.js
│   │   └── index.js
│   ├── styles/            # 全局样式
│   │   ├── index.scss
│   │   ├── reset.scss
│   │   ├── variables.scss
│   │   └── mixin.scss
│   ├── utils/             # 工具函数
│   │   ├── request.js
│   │   ├── auth.js
│   │   ├── validate.js
│   │   ├── storage.js
│   │   └── flexible.js
│   ├── views/             # 页面
│   │   ├── home/
│   │   │   └── index.vue
│   │   ├── login/
│   │   │   └── index.vue
│   │   ├── user/
│   │   │   └── index.vue
│   │   └── error/
│   │       └── 404.vue
│   ├── App.vue            # 根组件
│   ├── main.js            # 入口文件
│   └── permission.js      # 权限控制
├── .env.development       # 开发环境配置
├── .env.production        # 生产环境配置
├── .eslintrc.js           # ESLint配置
├── .prettierrc.js         # Prettier配置
├── commitlint.config.js   # Commit规范配置
├── index.html             # HTML模板
├── package.json           # 项目依赖
├── vite.config.js         # Vite配置
└── README.md              # 项目说明
```

## 17. 总结

本项目从0到1搭建了一个基于Vue3和Vant的移动端应用框架，包含了以下特点：

1. **技术栈**：Vue3 + Vite + Vant + Vuex + Vue Router
2. **工程化**：ESLint + Prettier + Husky + CommitLint
3. **移动端适配**：使用flexible.js和postcss-pxtorem实现
4. **模块化**：API模块、工具函数模块清晰分离
5. **权限控制**：基于路由的权限控制系统
6. **组件封装**：布局组件、公共组件等
7. **代码优化**：包括路由懒加载、图片懒加载、打包优化等
8. **样式系统**：基于SCSS的样式系统，包含变量、mixin等

这个项目结构可以作为企业级移动端项目的基础框架，具有高可扩展性和可维护性。团队可以基于此框架快速开发各类移动端应用，只需根据具体业务需求扩展相应功能模块即可。
