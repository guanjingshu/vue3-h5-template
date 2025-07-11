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
