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
