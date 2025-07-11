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

<script>
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

