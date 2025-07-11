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
