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
