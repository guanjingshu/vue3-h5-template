<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
   <van-nav-bar
      title="首页"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
      <van-button type="primary" @click="$router.push('/login')">登录</van-button>
    <van-button type="primary" @click="$router.push('/404')">404</van-button>
    <van-button type="primary" @click="$router.push('/500')">500</van-button>
  </div>
    <div class="logo-container">
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
