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
